/* CABECERA, menú lateral, buscador, textos y pies de página */
// ---------- Encabezado, textos, beneficios y pies ----------
$("#logo").innerHTML = TIENDA.logo ? `<img src="${TIENDA.logo}" alt="${TIENDA.nombre}">` : TIENDA.nombre;
$("#titulo").innerHTML = `${TIENDA.lema1}<br><span>${TIENDA.lema2}</span>`;
$("#wa").href = `https://wa.me/${TIENDA.whatsapp}`;
$("#benef").innerHTML = `<div class="it f">${ICO.caja}<b>Envíos a todo el país</b><p>${TIENDA.envios}${TIENDA.envioGratis ? ` <b class="gr">Envío gratis en compras desde ${cop(TIENDA.envioGratis)}.</b>` : ""}</p></div>
  <div class="g"><div class="it">${ICO.chat}<b>Asesoría directa</b><p>Resolvemos tus dudas por WhatsApp.</p></div>
  <div class="it">${ICO.lock}<b>Compra tranquila</b><p>Pagos protegidos y atención cercana.</p></div></div>`;
$("#negro").innerHTML = `<h2>${TIENDA.nombre}</h2><div class="es">${TIENDA.eslogan}</div>
  <h3>Ayuda</h3>${TIENDA.politicas.map(p => `<a href="${p[1]}">${p[0]}</a>`).join("")}
  <h3 style="margin-top:30px">Nuestra tienda</h3><div class="inf">${TIENDA.info.join("<br>")}</div><hr>
  <small>© ${new Date().getFullYear()} ${TIENDA.nombre} · All rights reserved</small>`;
$("#oscuro").innerHTML = `<div class="rs"><a href="${TIENDA.instagram}" aria-label="Instagram">${IG}</a><a href="${TIENDA.tiktok}" aria-label="TikTok">${TT}</a></div>
  <small>© ${new Date().getFullYear()}, ${TIENDA.nombre}</small>
  <ul class="po">${TIENDA.politicas.map(p => `<li><a href="${p[1]}">${p[0]}</a></li>`).join("")}</ul>`;
addEventListener("scroll", () => $("#top").classList.toggle("min", scrollY > 60), { passive: true });

// ---------- Paneles laterales ----------
const nEnl = h => { const [g, f] = h.slice(1).split("/"); return PRODUCTOS[g] && !SECCIONES[g].proximamente ? PRODUCTOS[g].filter(p => !f || p.cat === decodeURIComponent(f)).length : null; };
$("#drawer").innerHTML = MENU.map((m, i) => `<div class="mg" style="--i:${i}"><button class="mh" aria-expanded="false">${m.t}<i>›</i></button><div class="ms"><div>${m.sub.map(x => { const n = nEnl(x.href); return `<a class="lk" href="${x.href}">${x.t}${n ? `<em>${n}</em>` : ""}</a>`; }).join("")}</div></div></div>`).join("");
$("#drawer").addEventListener("click", e => {
  const b = e.target.closest(".mh"); if (!b) return;
  const g = b.parentElement, abrir = !g.classList.contains("abierto");
  document.querySelectorAll("#drawer .mg").forEach(x => { x.classList.remove("abierto"); x.querySelector(".mh").setAttribute("aria-expanded", "false"); });
  if (abrir) { g.classList.add("abierto"); b.setAttribute("aria-expanded", "true"); }
});
const panel = (el, on) => { el.classList.toggle("open", on); $("#velo").classList.toggle("on", on); el.setAttribute("aria-hidden", !on); };
const cerrar = () => { panel($("#drawer"), false); panel($("#carrito"), false); };
$("#btnMenu").onclick = () => panel($("#drawer"), true);
$("#btnCarrito").onclick = () => panel($("#carrito"), true);
$("#velo").onclick = cerrar;
$("#btnBuscar").onclick = () => { const b = $("#busca"); b.hidden = !b.hidden; if (!b.hidden) $("#q").focus(); };
$("#q").oninput = e => { if (!enInicio()) irHome(); q = e.target.value.trim().toLowerCase(); GRUPOS.forEach(pintar); };
$("#busca").onsubmit = e => { e.preventDefault(); if (!enInicio()) irHome(); $("#hombre").scrollIntoView({ behavior: "smooth" }); };

