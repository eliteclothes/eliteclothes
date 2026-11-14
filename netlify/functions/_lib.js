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
