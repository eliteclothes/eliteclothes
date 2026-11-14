/* COMPRA EN LA PÁGINA: formulario de envío -> el servidor crea el pedido -> botón de pago de Bold.
   El precio, el stock y el envío los vuelve a calcular el servidor (netlify/functions/crear-pedido.js). */
const FN = "/.netlify/functions";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normTxt = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

// Mismo cálculo que hace el servidor (solo para mostrar el valor en pantalla)
function calcEnvio(subtotal, depto, ciudad) {
  if (TIENDA.envioGratis && subtotal > TIENDA.envioGratis) return 0;
  for (const [k, v] of Object.entries(TIENDA.envioPorCiudad || {})) if (normTxt(k) === normTxt(ciudad)) return Number(v);
  for (const [k, v] of Object.entries(TIENDA.envioPorDepartamento || {})) if (k === depto) return Number(v);
  return Number(TIENDA.envioOtras || 0);
}

const coBox = () => $("#co .co-box");
function cerrarCheckout() { $("#co").hidden = true; document.body.style.overflow = ""; }
function pintarCO(html) {
  const co = $("#co");
  co.innerHTML = `<div class="co-box" role="dialog" aria-modal="true" aria-label="Finalizar compra"><button class="co-x" type="button" aria-label="Cerrar">✕</button>${html}</div>`;
  co.hidden = false; document.body.style.overflow = "hidden";
  co.onclick = e => { if (e.target === co || e.target.closest(".co-x")) cerrarCheckout(); };
}

function abrirCheckout() {
  panel($("#carrito"), false);
  if (!carrito.length) return;
  if (carrito.some(c => !c.id)) {
    pintarCO(`<h2>Actualiza tu carrito</h2><p>Tu carrito tiene productos de una versión anterior de la tienda. Vacíalo y vuelve a agregarlos para poder pagar.</p><button class="bt n" type="button" id="coVaciar">Vaciar carrito</button>`);
    $("#coVaciar").onclick = () => { carrito.length = 0; dibujar(); cerrarCheckout(); };
    return;
  }
  const subtotal = carrito.reduce((a, c) => a + c.precio * c.cant, 0);
  const deptos = Object.keys(TIENDA.envioPorDepartamento || {});
  pintarCO(`
    <h2>Finalizar compra</h2>
    <div class="co-res">${carrito.map(c => `<div><span>${c.cant} × ${esc(c.nombre)} <small>(talla ${esc(c.talla)})</small></span><b>${cop(c.precio * c.cant)}</b></div>`).join("")}</div>
    <form id="coForm" class="co-form" novalidate>
      <label>Nombre completo<input name="nombre" autocomplete="name" required></label>
      <label>Cédula<input name="cedula" inputmode="numeric" autocomplete="off" required></label>
      <label>Celular<input name="telefono" type="tel" inputmode="tel" autocomplete="tel" required></label>
      <label>Correo<input name="correo" type="email" autocomplete="email" required></label>
      <label>Departamento<select name="departamento" required><option value="">Selecciona…</option>${deptos.map(d => `<option>${esc(d)}</option>`).join("")}</select></label>
      <label>Ciudad o municipio<input name="ciudad" autocomplete="address-level2" required></label>
      <label class="ancho">Dirección de entrega<input name="direccion" autocomplete="street-address" placeholder="Calle, número, barrio, apartamento…" required></label>
      <label class="ancho">Notas para el envío (opcional)<input name="notas" maxlength="300"></label>
      <div class="co-tot ancho">
        <div><span>Subtotal</span><b>${cop(subtotal)}</b></div>
        <div><span>Envío</span><b id="coEnvio">Elige tu ciudad</b></div>
        <div class="gr"><span>Total</span><b id="coTotal">${cop(subtotal)}</b></div>
      </div>
      <label class="co-chk ancho"><input type="checkbox" name="acepto"> <span>Acepto los <a href="#/l/terminos" target="_blank">Términos</a> y autorizo el tratamiento de mis datos según la <a href="#/l/privacidad" target="_blank">Política de privacidad</a>.</span></label>
      <p class="co-err ancho" id="coErr" role="alert"></p>
      <button class="bt n ancho" id="coIr" type="submit">Continuar al pago</button>
    </form>`);
  const f = $("#coForm");
  const actualizar = () => {
    if (!f.departamento.value) return;
    const e = calcEnvio(subtotal, f.departamento.value, f.ciudad.value);
    $("#coEnvio").textContent = e ? cop(e) : "¡Gratis!"; $("#coTotal").textContent = cop(subtotal + e);
  };
  f.departamento.onchange = actualizar; f.ciudad.oninput = actualizar;
  f.onsubmit = async ev => {
    ev.preventDefault();
    const err = m => { $("#coErr").textContent = m; $("#coIr").disabled = false; $("#coIr").textContent = "Continuar al pago"; };
    const v = Object.fromEntries(new FormData(f)); v.acepto = f.acepto.checked;
    $("#coErr").textContent = ""; $("#coIr").disabled = true; $("#coIr").textContent = "Creando tu pedido…";
    try {
      const r = await fetch(`${FN}/crear-pedido`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, items: carrito.map(c => ({ id: c.id, talla: c.talla, cant: c.cant })) }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return err(d.error || "No pudimos crear tu pedido. Intenta de nuevo.");
      mostrarPago(d);
    } catch (e) { err("No hay conexión con la tienda. Revisa tu internet e intenta de nuevo."); }
  };
}

function mostrarPago(d) {
  pintarCO(`
    <h2>Tu pedido está listo</h2>
    <p class="co-ok">Pedido <b>${esc(d.ref)}</b></p>
    <div class="co-tot"><div><span>Productos</span><b>${cop(d.subtotal)}</b></div><div><span>Envío</span><b>${d.envio ? cop(d.envio) : "¡Gratis!"}</b></div><div class="gr"><span>Total a pagar</span><b>${cop(d.total)}</b></div></div>
    <p>Paga de forma segura con <b>Bold</b>: tarjeta, PSE, Nequi y más.</p>
    <div id="boldBtn" class="co-bold"></div>
    <p class="co-peq">Después de pagar volverás a la tienda y verás la confirmación de tu pedido.</p>`);
  const cont = $("#boldBtn"), s = document.createElement("script");
  const at = { "data-bold-button": "dark-L", "data-api-key": d.apiKey, "data-order-id": d.ref, "data-currency": d.divisa, "data-amount": String(d.total),
    "data-integrity-signature": d.hash, "data-redirection-url": d.redirigir, "data-origin-url": d.volver, "data-description": d.descripcion,
    "data-customer-data": JSON.stringify(d.cliente), "data-billing-address": JSON.stringify(d.direccion), "data-render-mode": "embedded" };
  for (const k in at) s.setAttribute(k, at[k]);
  cont.appendChild(s);
  document.querySelectorAll("script[data-bold-lib]").forEach(x => x.remove());   // la librería se carga DESPUÉS de poner el botón en la página
  const lib = document.createElement("script");
  lib.src = "https://checkout.bold.co/library/boldPaymentButton.js"; lib.setAttribute("data-bold-lib", "");
  lib.onerror = () => { cont.innerHTML = `<p class="co-err">No pudimos cargar el botón de pago. Revisa tu conexión y vuelve a intentar.</p>`; };
  document.head.appendChild(lib);
}
