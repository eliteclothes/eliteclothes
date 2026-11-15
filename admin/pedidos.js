/* PEDIDOS: lista, detalle, marcar enviado, cancelar y avisos de pedidos nuevos.
   Usa api(), toast(), esc(), cop() y TIENDA de admin.js. */
const EST = { pendiente: "Sin pagar", pagado: "Pagado", enviado: "Enviado", fallido: "Pago fallido", cancelado: "Cancelado", revisar: "Revisar" };
const FILTROS = {
  atender: "estado=in.(pagado,revisar)", nuevos: "estado=in.(pagado,revisar)&visto=eq.false", enviado: "estado=eq.enviado",
  sinpago: "estado=in.(pendiente,fallido)", revisar: "estado=eq.revisar", cancelado: "estado=eq.cancelado", todos: ""
};
let peds = [], nuevosPrev = null;
const fechaP = s => s ? new Date(s).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "";
const esNuevo = p => !p.visto && (p.estado === "pagado" || p.estado === "revisar");
const telWA = t => { const d = String(t || "").replace(/\D/g, ""); return d.length === 10 ? "57" + d : d; };

// ---------- pestañas ----------
document.querySelector(".tabs").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
  $("#vProd").hidden = b.dataset.v !== "vProd"; $("#vPed").hidden = b.dataset.v !== "vPed";
  if (b.dataset.v === "vPed") cargarPeds().catch(x => toast(x.message, true));
};
$("#pFiltro").onchange = () => cargarPeds().catch(x => toast(x.message, true));
$("#pRef").onclick = () => { cargarPeds().catch(x => toast(x.message, true)); contarNuevos(); };

// ---------- lista ----------
async function cargarPeds() {
  const q = FILTROS[$("#pFiltro").value];
  peds = await api(`/rest/v1/pedidos?select=*,pedido_items(*)&${q}${q ? "&" : ""}order=creado.desc&limit=100`);
  pintarPeds();
}
function pintarPeds() {
  $("#pCuenta").textContent = `${peds.length} pedido${peds.length === 1 ? "" : "s"}`;
  $("#pLista").innerHTML = peds.length ? peds.map(p => `<div class="pd ${esNuevo(p) ? "nuevo" : ""}" data-id="${p.id}">
    <div><h3>${esNuevo(p) ? '<span class="nv">NUEVO</span>' : ""}${esc(p.nombre)}</h3>
      <div class="m">${esc(p.ref)} · ${fechaP(p.creado)} · ${esc(p.ciudad)}</div>
      <div class="m">${(p.pedido_items || []).map(i => `${i.cantidad}× ${esc(i.nombre)} (${esc(i.talla)})`).join(", ")}</div></div>
    <div><div class="tt">${cop(p.total)}</div><span class="est ${p.estado}">${EST[p.estado]}</span></div></div>`).join("")
    : '<p class="mut">No hay pedidos en esta vista.</p>';
}
$("#pLista").onclick = e => { const c = e.target.closest(".pd"); if (c) abrirPed(+c.dataset.id); };

// ---------- detalle ----------
function abrirPed(id) {
  const p = peds.find(x => x.id === id); if (!p) return;
  const items = p.pedido_items || [], msg = p.estado === "enviado"
    ? `Hola ${p.nombre}, tu pedido ${p.ref} de ${TIENDA.nombre} ya fue enviado.${p.guia ? " Guía: " + p.guia : ""} ¡Gracias por tu compra!`
    : `Hola ${p.nombre}, te escribimos de ${TIENDA.nombre} sobre tu pedido ${p.ref}.`;
  $("#pdBox").dataset.id = id;
  $("#pdBox").innerHTML = `
    <div class="ph"><h2>Pedido ${esc(p.ref)}</h2><button class="x" type="button" data-a="x" aria-label="Cerrar">×</button></div>
    <p><span class="est ${p.estado}">${EST[p.estado]}</span> <span class="mut">${fechaP(p.creado)}${p.pagado_en ? " · pagado " + fechaP(p.pagado_en) : ""}</span></p>
    ${p.estado === "revisar" ? '<p class="aviso"><b>Revisar:</b> el pago entró pero ya no había stock suficiente (o el monto no coincidía). Contacta al cliente o devuélvele el dinero desde tu panel de Bold, y luego cancela el pedido aquí.</p>' : ""}
    <dl class="pdx">
      <dt>Cliente</dt><dd>${esc(p.nombre)}</dd><dt>Cédula</dt><dd>${esc(p.cedula)}</dd>
      <dt>Celular</dt><dd>${esc(p.telefono)}</dd><dt>Correo</dt><dd>${esc(p.correo)}</dd>
      <dt>Enviar a</dt><dd>${esc(p.direccion)}<br>${esc(p.ciudad)}${p.departamento ? ", " + esc(p.departamento) : ""}</dd>
      ${p.notas ? `<dt>Notas</dt><dd>${esc(p.notas)}</dd>` : ""}
      ${p.bold_tx ? `<dt>Ref. Bold</dt><dd>${esc(p.bold_tx)}</dd>` : ""}
    </dl>
    ${items.map(i => `<div class="pit">${i.img ? `<img src="${esc(i.img)}" alt="">` : '<div class="ph0"></div>'}<div>${esc(i.nombre)}<br><span class="mut">Talla ${esc(i.talla)} · ${i.cantidad} × ${cop(i.precio)}</span></div><b>${cop(i.precio * i.cantidad)}</b></div>`).join("")}
    <div class="pt"><div><span>Subtotal</span><b>${cop(p.subtotal)}</b></div><div><span>Envío</span><b>${p.envio ? cop(p.envio) : "Gratis"}</b></div><div class="g"><span>Total</span><b>${cop(p.total)}</b></div></div>
    <label>Número de guía / transportadora<input id="pdGuia" maxlength="120" value="${esc(p.guia)}" placeholder="Ej: Servientrega 1234567890"></label>
    <div class="pdacc">
      ${["pagado", "revisar", "enviado"].includes(p.estado) ? `<button class="b n" type="button" data-a="env">${p.estado === "enviado" ? "Guardar guía" : "Marcar como enviado"}</button>` : ""}
      <a class="b" target="_blank" rel="noopener" href="https://wa.me/${telWA(p.telefono)}?text=${encodeURIComponent(msg)}">Escribir por WhatsApp</a>
      ${["pendiente", "fallido"].includes(p.estado) ? '<button class="b" type="button" data-a="ver">Verificar pago con Bold</button>' : ""}
      ${p.estado !== "cancelado" ? '<button class="b del" type="button" data-a="dev">Cancelar pedido</button>' : ""}
    </div>`;
  $("#mPed").hidden = false;
  if (esNuevo(p)) api(`/rest/v1/pedidos?id=eq.${id}`, { method: "PATCH", json: { visto: true } }).then(() => { p.visto = true; pintarPeds(); contarNuevos(); }).catch(() => {});
}
async function recargarUno(id) {
  const r = await api(`/rest/v1/pedidos?id=eq.${id}&select=*,pedido_items(*)`);
  if (r && r[0]) { const i = peds.findIndex(x => x.id === id); i >= 0 ? peds[i] = r[0] : peds.unshift(r[0]); pintarPeds(); abrirPed(id); }
  contarNuevos();
}
$("#mPed").onclick = async e => {
  const a = e.target.dataset.a, id = +$("#pdBox").dataset.id;
  if (e.target === $("#mPed") || a === "x") { $("#mPed").hidden = true; return cargarPeds().catch(() => {}); }
  if (!a) return;
  const p = peds.find(x => x.id === id), btn = e.target; btn.disabled = true;
  try {
    if (a === "env") {
      const g = $("#pdGuia").value.trim(), cuerpo = p.estado === "enviado" ? { guia: g } : { estado: "enviado", guia: g, enviado_en: new Date().toISOString() };
      await api(`/rest/v1/pedidos?id=eq.${id}`, { method: "PATCH", json: cuerpo });
      toast(p.estado === "enviado" ? "Guía guardada" : "Pedido marcado como enviado"); await recargarUno(id);
    }
    if (a === "ver") {
      const r = await fetch(`/.netlify/functions/estado-pedido?ref=${encodeURIComponent(p.ref)}`).then(x => x.json());
      toast(r.estado === "pagado" ? "¡Pago confirmado!" : "Estado en Bold: " + (EST[r.estado] || r.estado)); await recargarUno(id);
    }
    if (a === "dev") {
      const msg = p.stock_descontado ? "¿Cancelar este pedido? Las unidades volverán al inventario." : "¿Cancelar este pedido?";
      if (confirm(msg)) { await api("/rest/v1/rpc/devolver_stock_pedido", { method: "POST", json: { p_pedido: id } }); toast("Pedido cancelado"); await recargarUno(id); }
    }
  } catch (x) { toast(x.message, true); }
  btn.disabled = false;
};

// ---------- aviso de pedidos nuevos (contador + sonido), se revisa cada 30 segundos ----------
function avisarNuevo(k) {
  toast(k === 1 ? "🛍️ ¡Nuevo pedido pagado!" : `🛍️ ¡${k} pedidos nuevos!`);
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880].forEach((hz, i) => { const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + i * .18;
      o.frequency.value = hz; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(.15, t); g.gain.exponentialRampToValueAtTime(.0001, t + .16); o.start(t); o.stop(t + .17); });
  } catch (e) {}
}
async function contarNuevos() {
  if (!ses) return;
  try {
    const r = await api("/rest/v1/pedidos?select=id&estado=in.(pagado,revisar)&visto=eq.false"), n = r.length, b = $("#nNuevos");
    b.textContent = n; b.hidden = !n; document.title = (n ? `(${n}) ` : "") + "Panel de administración";
    if (nuevosPrev !== null && n > nuevosPrev) { avisarNuevo(n - nuevosPrev); if (!$("#vPed").hidden) cargarPeds().catch(() => {}); }
    nuevosPrev = n;
  } catch (e) {}
}
setInterval(contarNuevos, 30000);
