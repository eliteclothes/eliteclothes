/* PÁGINA DE PRODUCTO */
// ---------- Página de producto ----------
let selP = null;
function verProducto(g, i) {
  const p = PRODUCTOS[g][i];
  selP = { g, i, t: p.tallas.find(x => !p.agotadas.includes(x)) };
  const im = p.imgs && p.imgs.length ? p.imgs : [p.img || muestra(p.nombre, i), muestra(p.nombre + " 2", i + 1)];
  const rs = RESENAS.filter(r => !r.producto || r.producto === p.nombre);
  const prom = rs.length ? rs.reduce((s, r) => s + r.estrellas, 0) / rs.length : 0;
  const est = n => "★".repeat(n) + "☆".repeat(5 - n);
  const otras = PRODUCTOS[g].map((x, j) => ({ x, j })).filter(o => o.j !== i).slice(0, 4);
  $("#producto").innerHTML = `<div class="pd"><div class="gal">${im.map(s => `<img src="${s}" alt="${p.nombre}">`).join("")}</div>
  <div class="inf"><div class="mig"><a href="#inicio">Inicio</a> / <a href="#${g}/${encodeURIComponent(p.cat)}">${p.cat}</a></div>
  <div class="pm">${p.marca}</div><h1 class="pt">${p.nombre}</h1><div class="pp">${cop2(p.precio)}</div>
  <div class="lb">Talla</div><div class="tl">${p.tallas.map(x => { const ag = p.agotadas.includes(x); return `<button class="${ag ? "ago" : x === selP.t ? "sel" : ""}" ${ag ? "disabled" : ""} data-t="${x}">${x}</button>`; }).join("")}</div>
  <div class="caja"><div>● ${selP.t ? "Disponible ahora" : "Agotado"}</div>${TIENDA.envioGratis ? `<div class="env">Envío gratis en compras desde ${cop(TIENDA.envioGratis)}</div>` : ""}</div>
  <button class="bt" id="add" ${selP.t ? "" : "disabled"}>Agregar al carrito</button><button class="bt n" id="ya" ${selP.t ? "" : "disabled"}>Comprar ahora</button>
  ${TIENDA.retiro ? `<div class="ret">✓ Retiro disponible en <b>${TIENDA.retiro}</b><small>Normalmente está listo en 1 hora</small><a href="https://wa.me/${TIENDA.whatsapp}" target="_blank" rel="noopener">Verificar disponibilidad en otras tiendas</a></div>` : ""}
  <div class="pgs">${TIENDA.pagos.map(pagoIcono).join("")}<small>${TIENDA.pagosTexto}</small><b>Comunícate a nuestro WhatsApp</b></div>
  <div class="cal"><b>✔ ${TIENDA.calidadTitulo}</b><p>${TIENDA.calidadTexto}</p></div>
  ${TIENDA.acordeones.map(x => `<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join("")}</div></div>
  <div class="rv"><h3>Reseñas</h3>${rs.length ? `<div class="avg"><span>${est(Math.round(prom))}</span> <b>${prom.toFixed(1)}</b> (${rs.length})</div>${rs.map(r => `<div class="r"><div><b>${r.nombre}</b><span>${est(r.estrellas)}</span></div><p>${r.texto}</p>${r.verificada ? "<small>Compra verificada</small>" : ""}</div>`).join("")}` : "<p>Aún no hay reseñas. ¡Sé el primero en comprar y contarnos tu experiencia!</p>"}</div>
  ${otras.length ? `<h2 class="ot">Otras opciones</h2><div class="otras">${otras.map(({ x, j }) => cardH(g, j, x, true)).join("")}</div>` : ""}`;
}
$("#producto").onclick = e => {
  const b = e.target, p = selP && PRODUCTOS[selP.g][selP.i];
  if (b.dataset.t) { selP.t = b.dataset.t; document.querySelectorAll("#producto .tl button").forEach(x => x.classList.toggle("sel", x === b)); }
  if (b.id === "add") agregar(p, selP.t, selP.i, selP.g);
  if (b.id === "ya") window.open(`https://wa.me/${TIENDA.whatsapp}?text=` + encodeURIComponent(`Hola ${TIENDA.nombre}, quiero comprar:\n\n1 x ${p.nombre} (talla ${selP.t}) - ${cop(p.precio)}` + (urlImg(p.img) ? `\n\nFoto: ${urlImg(p.img)}` : "") + `\n\nVer producto: ${urlProducto(selP.g, selP.i)}`), "_blank");
};

