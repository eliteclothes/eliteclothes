// Utilidades compartidas por las funciones del servidor (Netlify). No es una función pública.
const crypto = require("crypto");

const env = k => (process.env[k] || "").trim();
const json = (status, obj) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(obj) });
const origen = () => (process.env.URL || "").replace(/\/+$/, "");
const enc = encodeURIComponent;

// ---- Supabase (con la llave secret, solo en el servidor) ----
async function sb(ruta, { method = "GET", body, prefer } = {}) {
  const base = env("SUPABASE_URL").replace(/\/+$/, ""), key = env("SUPABASE_SERVICE_KEY");
  if (!base || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en las variables de Netlify");
  const headers = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;   // llave antigua (JWT)
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(`${base}/rest/v1/${ruta}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${txt}`);
  return txt ? JSON.parse(txt) : null;
}

// ---- Datos de la tienda (js/datos/tienda.js): una sola fuente para la página y el servidor ----
let _t = null, _tHora = 0;
async function tienda() {
  if (_t && Date.now() - _tHora < 60000) return _t;
  const r = await fetch(origen() + "/js/datos/tienda.js", { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) throw new Error("No se pudo leer tienda.js (" + r.status + ")");
  _t = new Function((await r.text()) + "\n;return TIENDA;")();
  _tHora = Date.now();
  return _t;
}

// ---- Envío: ciudad > departamento > otras. Gratis si el subtotal SUPERA envioGratis ----
const norm = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
function costoEnvio(T, subtotal, departamento, ciudad) {
  if (T.envioGratis && subtotal > T.envioGratis) return 0;
  for (const [k, v] of Object.entries(T.envioPorCiudad || {})) if (norm(k) === norm(ciudad)) return Number(v);
  for (const [k, v] of Object.entries(T.envioPorDepartamento || {})) if (norm(k) === norm(departamento)) return Number(v);
  return Number(T.envioOtras || 0);
}

// ---- Bold ----
const hashIntegridad = (ref, monto, divisa) =>
  crypto.createHash("sha256").update(`${ref}${monto}${divisa}${env("BOLD_SECRET_KEY")}`).digest("hex");

function firmaValida(cuerpo, firma) {
  if (!firma) return false;
  const b64 = Buffer.from(cuerpo, "utf8").toString("base64");
  for (const k of [env("BOLD_SECRET_KEY"), env("BOLD_API_KEY")]) {       // la guía de Bold nombra "llave de identidad"; aceptamos cualquiera de las dos
    if (!k) continue;
    const h = crypto.createHmac("sha256", k).update(b64).digest("hex");
    if (h.length === firma.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(firma))) return true;
  }
  return false;
}

async function consultarBold(ref) {
  const r = await fetch(`https://payments.api.bold.co/v2/payment-voucher/${enc(ref)}`, { headers: { Authorization: "x-api-key " + env("BOLD_API_KEY") } });
  if (r.status === 404) return { payment_status: "NO_TRANSACTION_FOUND" };
  if (!r.ok) throw new Error("Bold respondió " + r.status);
  return r.json();
}

// ---- Aviso al dueño por WhatsApp (API oficial de Meta). Si faltan las variables, simplemente no hace nada ----
const puntos = n => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const sinSaltos = s => String(s || "").replace(/[\r\n\t]+/g, " ").replace(/ {2,}/g, " ").trim();
const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function enviarWhatsApp(p, items) {
  const token = env("WHATSAPP_TOKEN"), phoneId = env("WHATSAPP_PHONE_ID"), plantilla = env("WHATSAPP_TEMPLATE"), destino = env("AVISO_WHATSAPP").replace(/\D/g, "");
  const resumen = sinSaltos(items.map(i => `${i.cantidad}x ${i.nombre} (${i.talla})`).join(", ")).slice(0, 300) || "-";
  const valores = [p.ref, p.nombre, "$" + puntos(p.total), resumen, sinSaltos(`${p.ciudad}${p.departamento ? ", " + p.departamento : ""}`)];
  const r = await fetch(`https://graph.facebook.com/${env("WHATSAPP_API_VERSION") || "v23.0"}/${phoneId}/messages`, {
    method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: destino, type: "template",
      template: { name: plantilla, language: { code: env("WHATSAPP_LANG") || "es" }, components: [{ type: "body", parameters: valores.map(text => ({ type: "text", text: sinSaltos(text) || "-" })) }] } })
  });
  if (!r.ok) throw new Error("WhatsApp " + r.status + ": " + (await r.text()));
}

// Correo al dueño con el resumen del pedido (Resend: https://resend.com, plan gratis)
async function enviarCorreo(p, items) {
  const revisar = p.estado === "revisar";
  const asunto = revisar ? `⚠️ Pedido por revisar ${p.ref} - $${puntos(p.total)}` : `🛍️ Nuevo pedido pagado ${p.ref} - $${puntos(p.total)}`;
  const filas = items.map(i => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(i.cantidad)} × ${esc(i.nombre)} (talla ${esc(i.talla)})</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">$${puntos(i.precio * i.cantidad)}</td></tr>`).join("");
  const panel = origen() + "/admin/";
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1612">
    <h2 style="margin:0 0 6px">${revisar ? "⚠️ Pedido por revisar" : "🛍️ ¡Nuevo pedido pagado!"}</h2>
    <p style="margin:0 0 14px;color:#7a6f60">Pedido <b>${esc(p.ref)}</b></p>
    ${revisar ? '<p style="background:#f8dcc0;padding:10px 12px;border-radius:8px">El pago entró pero ya no había stock suficiente (o el monto no coincidía). Contacta al cliente o devuélvele el dinero desde Bold.</p>' : ""}
    <table style="width:100%;border-collapse:collapse;font-size:14px">${filas}
      <tr><td style="padding:6px 10px">Envío</td><td style="padding:6px 10px;text-align:right">${p.envio ? "$" + puntos(p.envio) : "Gratis"}</td></tr>
      <tr><td style="padding:8px 10px;font-weight:bold">Total</td><td style="padding:8px 10px;text-align:right;font-weight:bold">$${puntos(p.total)}</td></tr></table>
    <h3 style="margin:18px 0 6px">Cliente</h3>
    <p style="margin:0;line-height:1.6">${esc(p.nombre)}<br>Cédula: ${esc(p.cedula)}<br>Celular: ${esc(p.telefono)}<br>Correo: ${esc(p.correo)}</p>
    <h3 style="margin:18px 0 6px">Enviar a</h3>
    <p style="margin:0;line-height:1.6">${esc(p.direccion)}<br>${esc(p.ciudad)}${p.departamento ? ", " + esc(p.departamento) : ""}${p.notas ? "<br><i>Notas: " + esc(p.notas) + "</i>" : ""}</p>
    <p style="margin:22px 0"><a href="${esc(panel)}" style="background:#1a1612;color:#fff;padding:12px 22px;border-radius:99px;text-decoration:none">Abrir el panel de pedidos</a></p></div>`;
  const texto = `${asunto}\n\n${items.map(i => `${i.cantidad} x ${i.nombre} (talla ${i.talla})`).join("\n")}\nEnvío: ${p.envio ? "$" + puntos(p.envio) : "Gratis"}\nTotal: $${puntos(p.total)}\n\nCliente: ${p.nombre} - ${p.telefono} - ${p.correo}\nEnviar a: ${p.direccion}, ${p.ciudad}\n\nPanel: ${panel}`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: "Bearer " + env("RESEND_API_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify({ from: env("AVISO_CORREO_DE") || "Elite Clothes <onboarding@resend.dev>", to: [env("AVISO_CORREO")], subject: asunto, html, text: texto })
  });
  if (!r.ok) throw new Error("Correo " + r.status + ": " + (await r.text()));
}

// Avisa al dueño por los canales configurados (correo y/o WhatsApp). Solo UNA vez por pedido. Si no hay ninguno configurado, no hace nada.
async function avisarDueno(pedidoId) {
  const hayWA = env("WHATSAPP_TOKEN") && env("WHATSAPP_PHONE_ID") && env("WHATSAPP_TEMPLATE") && env("AVISO_WHATSAPP");
  const hayCorreo = env("RESEND_API_KEY") && env("AVISO_CORREO");
  if (!hayWA && !hayCorreo) return;
  const mio = await sb(`pedidos?id=eq.${pedidoId}&avisado=eq.false`, { method: "PATCH", prefer: "return=representation", body: { avisado: true } });   // reclama el aviso
  if (!mio || !mio.length) return;
  const p = mio[0];
  let resultados = [];
  try {
    const items = await sb(`pedido_items?select=nombre,talla,cantidad,precio&pedido_id=eq.${pedidoId}`);
    const tareas = [];
    if (hayCorreo) tareas.push(enviarCorreo(p, items));
    if (hayWA) tareas.push(enviarWhatsApp(p, items));
    resultados = await Promise.allSettled(tareas);
    resultados.filter(r => r.status === "rejected").forEach(r => console.error("aviso:", r.reason && r.reason.message));
  } catch (e) { console.error("aviso:", e.message); }
  if (!resultados.some(r => r.status === "fulfilled"))       // ningún canal funcionó: se libera para reintentar
    await sb(`pedidos?id=eq.${pedidoId}`, { method: "PATCH", prefer: "return=minimal", body: { avisado: false } }).catch(() => {});
}

// Pregunta a Bold (servidor a servidor, no se puede falsificar desde el navegador) y actualiza el pedido. Se puede repetir sin riesgo.
async function sincronizar(ped) {
  if (!["pendiente", "fallido"].includes(ped.estado)) return ped.estado;
  const v = await consultarBold(ped.ref);
  const st = v.payment_status;
  if (st === "APPROVED") {
    if (Number(v.total) !== Number(ped.total)) {
      await sb(`pedidos?id=eq.${ped.id}`, { method: "PATCH", prefer: "return=minimal", body: { estado: "revisar", bold_tx: v.transaction_id || null } });
      return "revisar";
    }
    if (v.transaction_id) await sb(`pedidos?id=eq.${ped.id}`, { method: "PATCH", prefer: "return=minimal", body: { bold_tx: v.transaction_id } });
    const res = await sb("rpc/descontar_stock_pedido", { method: "POST", body: { p_pedido: ped.id } });
    await avisarDueno(ped.id).catch(e => console.error("aviso:", e.message));
    return res === "sin_stock" ? "revisar" : "pagado";
  }
  if ((st === "REJECTED" || st === "FAILED") && ped.estado === "pendiente") {
    await sb(`pedidos?id=eq.${ped.id}`, { method: "PATCH", prefer: "return=minimal", body: { estado: "fallido" } });
    return "fallido";
  }
  if (st === "VOIDED" && ped.estado === "pendiente") {
    await sb(`pedidos?id=eq.${ped.id}`, { method: "PATCH", prefer: "return=minimal", body: { estado: "cancelado" } });
    return "cancelado";
  }
  return ped.estado;
}

module.exports = { env, json, origen, enc, sb, tienda, costoEnvio, hashIntegridad, firmaValida, consultarBold, sincronizar };
