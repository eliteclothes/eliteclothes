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
  $("#producto").innerHTML = `<div class="pd"><div class="gal">${im.map(s => `<img src="${s}" alt="${p.nombre}" title="Toca para ampliar">`).join("")}</div>
  <div class="inf"><div class="mig"><a href="#inicio">Inicio</a> / <a href="#${g}/${encodeURIComponent(p.cat)}">${p.cat}</a></div>
  <div class="pm">${p.marca}</div><h1 class="pt">${p.nombre}</h1><div class="pp">${cop2(p.precio)}</div>
  <div class="lb">Talla</div><div class="tl">${p.tallas.map(x => { const ag = p.agotadas.includes(x); return `<button class="${ag ? "ago" : x === selP.t ? "sel" : ""}" ${ag ? "disabled" : ""} data-t="${x}">${x}</button>`; }).join("")}</div>
  <div class="caja"><div>● ${selP.t ? "Disponible ahora" : "Agotado"}</div>${TIENDA.envioGratis ? `<div class="env">Envío gratis por compras superiores a ${cop(TIENDA.envioGratis)}</div>` : ""}</div>
  <button class="bt" id="add" ${selP.t ? "" : "disabled"}>Agregar al carrito</button><button class="bt n" id="ya" ${selP.t ? "" : "disabled"}>Comprar ahora</button>
  ${TIENDA.retiro ? `<div class="ret">✓ Retiro disponible en <b>${TIENDA.retiro}</b><small>Normalmente está listo en 1 hora</small><a href="https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent("Hola, ¿tienen disponible " + p.nombre + " en otra sede?")}" target="_blank" rel="noopener">Verificar disponibilidad en otras sedes</a></div>` : ""}
  <div class="pgs">${TIENDA.pagos.map(pagoIcono).join("")}<small>${TIENDA.pagosTexto}</small><b>Comunícate a nuestro WhatsApp</b></div>
  <div class="cal"><b>✔ ${TIENDA.calidadTitulo}</b><p>${TIENDA.calidadTexto}</p></div>
  ${ACORDEONES().map(x => `<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join("")}</div></div>
  <div class="rv"><h3>Reseñas</h3>${rs.length ? `<div class="avg"><span>${est(Math.round(prom))}</span> <b>${prom.toFixed(1)}</b> (${rs.length})</div>${rs.map(r => `<div class="r"><div><b>${r.nombre}</b><span>${est(r.estrellas)}</span></div><p>${r.texto}</p>${r.verificada ? "<small>Compra verificada</small>" : ""}</div>`).join("")}` : "<p>Aún no hay reseñas. ¡Sé el primero en comprar y contarnos tu experiencia!</p>"}</div>
  ${otras.length ? `<h2 class="ot">Otras opciones</h2><div class="otras">${otras.map(({ x, j }) => cardH(g, j, x, true)).join("")}</div>` : ""}`;
}
$("#producto").onclick = e => {
  const b = e.target, p = selP && PRODUCTOS[selP.g][selP.i];
  if (b.tagName === "IMG" && b.closest(".gal")) { const fotos = [...document.querySelectorAll("#producto .gal img")]; abrirVisor(fotos.map(x => x.currentSrc || x.src), fotos.indexOf(b), p && p.nombre); return; }
  if (b.dataset.t) { selP.t = b.dataset.t; document.querySelectorAll("#producto .tl button").forEach(x => x.classList.toggle("sel", x === b)); }
  if (b.id === "add") agregar(p, selP.t, selP.i, selP.g);
  if (b.id === "ya" && agregar(p, selP.t, selP.i, selP.g, true)) abrirCheckout();
};


// ---------- Visor de fotos con zoom (clic en la foto del producto) ----------
// Clic o doble clic = acercar/alejar · rueda del mouse = zoom · arrastrar = mover la foto · dos dedos = pellizcar · Esc = cerrar · ← → = otra foto
let visor = null;
function abrirVisor(fotos, inicio, nombre) {
  cerrarVisor();
  let idx = Math.max(0, inicio), s = 1, tx = 0, ty = 0;
  const MAX = 5, ptr = new Map();
  let arrastre = null, pellizco = null, movio = false;
  const el = document.createElement("div");
  el.className = "visor"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Foto ampliada");
  el.innerHTML = `<button class="vx" type="button" aria-label="Cerrar">✕</button>
    ${fotos.length > 1 ? `<button class="vf vp" type="button" aria-label="Foto anterior">‹</button><button class="vf vs" type="button" aria-label="Foto siguiente">›</button><div class="vn"></div>` : ""}
    <div class="vc"><img alt="${esc(nombre || "Producto")}" draggable="false"></div>
    <div class="vh">Toca la foto para acercar · arrastra para moverla</div>`;
  document.body.appendChild(el); visor = el;
  const cont = el.querySelector(".vc"), img = el.querySelector("img"), num = el.querySelector(".vn");
  const prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
  el._cerrar = () => { document.body.style.overflow = prevOverflow; document.removeEventListener("keydown", tecla); el.remove(); if (visor === el) visor = null; };
  const limitar = () => {                                   // la foto no se sale de la pantalla
    const mx = Math.max(0, (img.offsetWidth * s - cont.clientWidth) / 2), my = Math.max(0, (img.offsetHeight * s - cont.clientHeight) / 2);
    tx = Math.min(mx, Math.max(-mx, tx)); ty = Math.min(my, Math.max(-my, ty));
  };
  const pintar = () => { limitar(); img.style.transform = `translate(${tx}px,${ty}px) scale(${s})`; el.classList.toggle("zoom", s > 1.01); };
  const zoomEn = (nuevo, px, py) => {                       // acerca/aleja manteniendo fijo el punto (px, py) de la pantalla
    nuevo = Math.min(MAX, Math.max(1, nuevo));
    const r = cont.getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), k = nuevo / s;
    tx = dx - k * (dx - tx); ty = dy - k * (dy - ty); s = nuevo;
    if (s === 1) { tx = 0; ty = 0; }
    pintar();
  };
  const mostrar = i => {
    idx = (i + fotos.length) % fotos.length; s = 1; tx = 0; ty = 0; img.src = fotos[idx]; pintar();
    if (num) num.textContent = `${idx + 1} / ${fotos.length}`;
  };
  const tecla = e => {
    if (e.key === "Escape") cerrarVisor();
    else if (e.key === "ArrowRight" && fotos.length > 1) mostrar(idx + 1);
    else if (e.key === "ArrowLeft" && fotos.length > 1) mostrar(idx - 1);
    else if (e.key === "+" || e.key === "=") { const r = cont.getBoundingClientRect(); zoomEn(s * 1.4, r.left + r.width / 2, r.top + r.height / 2); }
    else if (e.key === "-") { const r = cont.getBoundingClientRect(); zoomEn(s / 1.4, r.left + r.width / 2, r.top + r.height / 2); }
  };
  document.addEventListener("keydown", tecla);
  el.onclick = e => {
    if (e.target.closest(".vx") || e.target === el || (e.target === cont && s === 1)) return cerrarVisor();
    if (e.target.closest(".vp")) return mostrar(idx - 1);
    if (e.target.closest(".vs")) return mostrar(idx + 1);
  };
  cont.addEventListener("wheel", e => { e.preventDefault(); zoomEn(s * (e.deltaY < 0 ? 1.25 : 0.8), e.clientX, e.clientY); }, { passive: false });
  const dist = () => { const [a, b] = [...ptr.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  cont.addEventListener("pointerdown", e => {
    if (e.target !== img) return;
    cont.setPointerCapture(e.pointerId); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); movio = false;
    if (ptr.size === 2) { pellizco = { d: dist(), s }; arrastre = null; }
    else arrastre = { x: e.clientX, y: e.clientY, tx, ty };
  });
  cont.addEventListener("pointermove", e => {
    if (!ptr.has(e.pointerId)) return;
    ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptr.size === 2 && pellizco) { const [a, b] = [...ptr.values()]; movio = true; zoomEn(pellizco.s * dist() / pellizco.d, (a.x + b.x) / 2, (a.y + b.y) / 2); }
    else if (arrastre) {
      if (Math.hypot(e.clientX - arrastre.x, e.clientY - arrastre.y) > 5) movio = true;
      if (s > 1) { tx = arrastre.tx + e.clientX - arrastre.x; ty = arrastre.ty + e.clientY - arrastre.y; pintar(); }
    }
  });
  const soltar = e => {
    if (!ptr.has(e.pointerId)) return;
    ptr.delete(e.pointerId); pellizco = null;
    if (e.type === "pointerup" && ptr.size === 0 && arrastre && !movio) zoomEn(s > 1.01 ? 1 : 2.5, e.clientX, e.clientY);   // un toque: acerca o aleja
    arrastre = ptr.size === 1 ? (([p]) => ({ x: p.x, y: p.y, tx, ty }))([...ptr.values()]) : null;
  };
  cont.addEventListener("pointerup", soltar); cont.addEventListener("pointercancel", soltar);
  mostrar(idx);
  el.querySelector(".vx").focus();
}
function cerrarVisor() { if (visor) visor._cerrar(); }
