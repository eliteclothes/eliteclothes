/* COMPRA EN LA PÁGINA: formulario de envío -> el servidor crea el pedido -> botón de pago de Bold.
   El precio, el stock y el envío los vuelve a calcular el servidor (netlify/functions/crear-pedido.js). */
const FN = "/.netlify/functions";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normTxt = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const SIN_ENVIO_INTER = "Guía: la pagas al recibir";
const POR_CONFIRMAR = "Te lo confirmamos por WhatsApp";

// Mismo cálculo que hace el servidor (solo para mostrar el valor en pantalla)
function calcEnvio(subtotal, zona) {
  const par = Object.entries(TIENDA.envioZonas || {}).find(([k]) => normTxt(k) === normTxt(zona));
  if (!par) return null;
  return TIENDA.envioGratis && subtotal > TIENDA.envioGratis ? 0 : Number(par[1]);
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
  const sedesOk = typeof SEDES !== "undefined" && SEDES.length > 0, tieneGeo = x => typeof x.lat === "number" && typeof x.lng === "number";
  const zonas = Object.keys(TIENDA.envioZonas || {}).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  pintarCO(`
    <h2>Finalizar compra</h2>
    <div class="co-res">${carrito.map(c => `<div><span>${c.cant} × ${esc(c.nombre)} <small>(talla ${esc(c.talla)})</small></span><b>${cop(c.precio * c.cant)}</b></div>`).join("")}</div>
    <form id="coForm" class="co-form" novalidate>
      <label>Nombre completo<input name="nombre" autocomplete="name" required></label>
      <label>Cédula<input name="cedula" inputmode="numeric" autocomplete="off" required></label>
      <label>Celular<input name="telefono" type="tel" inputmode="tel" autocomplete="tel" required></label>
      <label>Correo<input name="correo" type="email" autocomplete="email" required></label>
      <fieldset class="co-ent ancho">
        <legend>Entrega</legend>
        ${sedesOk ? `<div class="ent-tog"><label class="on" data-e="envio"><input type="radio" name="entrega" value="envio" checked><span>📦 Envío</span></label><label data-e="retiro"><input type="radio" name="entrega" value="retiro"><span>📍 Retiro</span></label></div>` : `<input type="radio" name="entrega" value="envio" checked hidden>`}
        <div id="panEnvio">
      <fieldset class="co-env ancho">
        <legend>Métodos de envío</legend>
        <div class="env-box">
        <label class="env-op on" data-m="zona"><input type="radio" name="metodoEnvio" value="zona" checked><span>${esc(TIENDA.envioZonaTitulo || "Domicilio")}</span><b id="envZonaPrecio">Elige tu zona</b></label>
        <div class="env-zona" id="envZona"><select name="zona" aria-label="Zona de envío"><option value="">¿De dónde eres? Selecciona tu zona…</option>${zonas.map(z => `<option value="${esc(z)}">${esc(z)} — ${cop(TIENDA.envioZonas[z])}</option>`).join("")}<option value="__medellin">Soy de Medellín pero mi sector no aparece → escribo mi dirección</option><option value="__otra">Soy de otra ciudad → Interrapidísimo</option></select></div>
        <label class="env-op" data-m="inter"><input type="radio" name="metodoEnvio" value="inter"><span>${esc(TIENDA.envioInterTitulo || "Interrapidísimo")}</span><b>Guía al recibir</b></label>
        <p class="env-nota" id="envInter" hidden>${esc(TIENDA.envioInterNota || "")}</p>
        <p class="env-nota" id="envSector" hidden>📍 Escribe abajo tu dirección completa (calle, número, barrio y sector). La tienda te escribirá para decirte el valor del domicilio.</p>
        </div>
      </fieldset>
      <label class="ancho"><span id="dirEt">Dirección de entrega</span><input name="direccion" id="dirIn" autocomplete="street-address" placeholder="Calle, número, barrio, apartamento…" required></label>
        </div>
        <div id="panRetiro" hidden>
          <p class="ret-top"><span>Hay ${SEDES.length} sucursal${SEDES.length === 1 ? "" : "es"} con tu artículo</span>${SEDES.some(tieneGeo) && "geolocation" in navigator ? `<button type="button" id="retCerca">📍 La más cercana</button>` : ""}</p>
          <p class="ret-msg" id="retMsg" aria-live="polite"></p>
          <div class="env-box" id="retLista">${(sedesOk ? SEDES : []).map((s, i) => `<label class="env-op ret-op${i ? "" : " on"}" data-i="${i}"><input type="radio" name="sede" value="${esc(s.nombre)}"${i ? "" : " checked"}><div class="ret-in"><div class="ret-n"><b>${esc(s.nombre)}</b><b>GRATIS</b></div><div>${esc(s.direccion)}</div>${s.horario ? `<small>${esc(s.horario)}</small>` : ""}<small>🕐 ${esc(TIENDA.retiroTiempo || "Te avisamos cuando esté listo")}</small></div></label>`).join("")}</div>
        </div>
      </fieldset>
      <label class="ancho">Notas para tu pedido (opcional)<input name="notas" maxlength="300"></label>
      <div class="co-tot ancho">
        <div><span>Subtotal</span><b>${cop(subtotal)}</b></div>
        <div><span>Envío</span><b id="coEnvio">Elige tu zona</b></div>
        <div class="gr"><span>Total</span><b id="coTotal">${cop(subtotal)}</b></div>
      </div>
      <label class="co-chk ancho"><input type="checkbox" name="acepto"> <span>Acepto los <a href="#/l/terminos" target="_blank">Términos</a> y autorizo el tratamiento de mis datos según la <a href="#/l/privacidad" target="_blank">Política de privacidad</a>.</span></label>
      <p class="co-err ancho" id="coErr" role="alert"></p>
      <button class="bt n ancho" id="coIr" type="submit">Continuar al pago</button>
    </form>`);
  const f = $("#coForm");
  const metodo = () => f.metodoEnvio.value, retira = () => f.entrega.value === "retiro";
  const actualizar = () => {
    const ret = retira(), inter = metodo() === "inter", otro = !ret && !inter && f.zona.value === "__medellin", z = otro ? null : calcEnvio(subtotal, f.zona.value), e = ret || inter || otro ? 0 : z;
    const gratis = !!(TIENDA.envioGratis && subtotal > TIENDA.envioGratis), sectorTxt = gratis ? "¡Gratis!" : POR_CONFIRMAR;
    f.querySelectorAll(".ent-tog label").forEach(l => l.classList.toggle("on", l.dataset.e === (ret ? "retiro" : "envio")));
    f.querySelectorAll(".co-env .env-op").forEach(l => l.classList.toggle("on", l.dataset.m === metodo()));
    f.querySelectorAll(".ret-op").forEach(l => l.classList.toggle("on", l.querySelector("input").checked));
    $("#panEnvio").hidden = ret; $("#panRetiro").hidden = !ret;
    $("#envZona").hidden = inter; $("#envInter").hidden = !inter; $("#envSector").hidden = !otro;
    $("#dirEt").textContent = inter ? "Ciudad, departamento y dirección de entrega" : otro ? "Tu dirección en Medellín (con barrio y sector)" : "Dirección de entrega";
    $("#dirIn").placeholder = inter ? "Ej: Bogotá, Cundinamarca. Calle 10 # 5-20 (o sede de Interrapidísimo)" : otro ? "Ej: Cra 45 # 80-12, barrio Aranjuez, sector…, apto 301" : "Calle, número, barrio, apartamento…";
    $("#envZonaPrecio").textContent = otro ? sectorTxt : z === null ? "Elige tu zona" : z ? cop(z) : "¡Gratis!";
    $("#coEnvio").textContent = ret ? "Retiro en sede: ¡Gratis!" : inter ? SIN_ENVIO_INTER : otro ? sectorTxt : e === null ? "Elige tu zona" : e ? cop(e) : "¡Gratis!";
    $("#coTotal").textContent = cop(subtotal + (e || 0));
  };
  f.querySelectorAll("input[name=metodoEnvio],input[name=entrega],input[name=sede]").forEach(r => r.onchange = actualizar);
  f.zona.onchange = () => { if (f.zona.value === "__otra") { f.metodoEnvio.value = "inter"; f.zona.value = ""; } actualizar(); };   // "soy de otra ciudad" = Interrapidísimo; "__medellin" se queda: dirección escrita y la tienda confirma el domicilio
  const cerca = $("#retCerca");
  if (cerca) cerca.onclick = () => {                         // elige la sede más cercana a la ubicación del cliente
    const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
    cerca.disabled = true; $("#retMsg").textContent = "Buscando tu ubicación…";
    navigator.geolocation.getCurrentPosition(p => {
      const o = SEDES.map((s, i) => ({ s, i, d: tieneGeo(s) ? km(p.coords.latitude, p.coords.longitude, s.lat, s.lng) : Infinity })).sort((a, b) => a.d - b.d)[0];
      const lab = f.querySelector(`.ret-op[data-i="${o.i}"]`); lab.querySelector("input").checked = true; $("#retLista").prepend(lab); actualizar();
      $("#retMsg").textContent = `La más cercana a ti: ${o.s.nombre} (a ${o.d < 1 ? Math.round(o.d * 1000) + " m" : o.d.toFixed(1).replace(".", ",") + " km"})`; cerca.disabled = false;
    }, () => { $("#retMsg").textContent = "No pudimos acceder a tu ubicación. Elige una sede de la lista."; cerca.disabled = false; }, { timeout: 9000, maximumAge: 120000 });
  };
  f.onsubmit = async ev => {
    ev.preventDefault();
    const err = m => { $("#coErr").textContent = m; $("#coIr").disabled = false; $("#coIr").textContent = "Continuar al pago"; };
    const v = Object.fromEntries(new FormData(f)); v.acepto = f.acepto.checked;
    if (!retira() && metodo() === "zona" && !f.zona.value) {      // no es de una zona de Medellín: sigue con Interrapidísimo y la dirección que escriba
      f.metodoEnvio.value = "inter"; actualizar(); $("#dirIn").focus();
      return err("No elegiste una zona de Medellín, así que tu envío será por Interrapidísimo (solo pagas la guía al recibir). Escribe abajo tu ciudad, departamento y dirección, y toca Continuar al pago.");
    }
    if (!retira() && metodo() === "zona" && f.zona.value === "__medellin" && v.direccion.trim().length < 10) { $("#dirIn").focus(); return err("Escribe tu dirección completa en Medellín (calle, número y barrio) para que la tienda pueda calcular tu domicilio."); }
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
    <div class="co-tot"><div><span>Productos</span><b>${cop(d.subtotal)}</b></div><div><span>Envío</span><b>${d.retiro ? "Retiro en sede: ¡Gratis!" : d.inter ? SIN_ENVIO_INTER : d.sector && !d.envio && !d.gratis ? POR_CONFIRMAR : d.envio ? cop(d.envio) : "¡Gratis!"}</b></div><div class="gr"><span>Total a pagar</span><b>${cop(d.total)}</b></div></div>
    ${d.retiro ? `<p class="co-ok">Pagas ahora con Bold y luego recoges tu pedido en <b>${esc(d.sede)}</b>. Te avisamos cuando esté listo.</p>` : ""}
    ${d.sector && !d.gratis ? `<p class="co-ok">Pagas ahora tus productos con Bold. Como tu sector no está en la lista, la tienda te escribirá por WhatsApp o llamada al <b>${esc(d.cliente.phone)}</b> para decirte el <b>valor del domicilio</b>.</p>` : ""}
    ${d.inter ? `<p class="co-ok">Tus productos los pagas ahora con Bold. Solo la <b>guía de envío</b> la pagas a <b>Interrapidísimo</b> cuando reclames tu pedido.</p>` : ""}
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
