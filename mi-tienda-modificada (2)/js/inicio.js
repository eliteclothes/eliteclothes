/* PÁGINA DE INICIO: banners y carruseles de cada sección */
// ---------- Banners ----------
$("#slides").innerHTML = BANNERS.map((b, i) => `<div class="slide ${i ? "m" : "b"}" ><div class="fondo" style="${b.img ? `background-image:url('${b.img}')` : ""}"></div><div class="cap"><h2>${b.titulo}</h2><p>${b.texto}</p><a class="btn" href="${b.href}">${b.boton}</a></div></div>`).join("");
$("#dots").innerHTML = BANNERS.map((_, i) => `<button aria-label="Banner ${i + 1}"></button>`).join("");
const sl = $("#slides"), pts = [...$("#dots").children];
let pausa = false;
const actual = () => Math.round(sl.scrollLeft / sl.clientWidth);
const ver = i => sl.scrollTo({ left: ((i + BANNERS.length) % BANNERS.length) * sl.clientWidth, behavior: "smooth" });
pts.forEach((p, i) => p.onclick = () => ver(i));
$("#bPrev").onclick = () => ver(actual() - 1);
$("#bNext").onclick = () => ver(actual() + 1);
$("#bPausa").onclick = e => { pausa = !pausa; e.target.textContent = pausa ? "▶" : "❚❚"; };
sl.onscroll = () => pts.forEach((p, j) => p.classList.toggle("on", actual() === j));
sl.onscroll();
setInterval(() => { if (!pausa) ver(actual() + 1); }, 7000);

// ---------- Secciones de catálogo (una por grupo) ----------
$("#secciones").innerHTML = GRUPOS.map(g => SECCIONES[g].proximamente ? `<section class="sec" id="${g}"><div class="sec-in"><h2>${SECCIONES[g].titulo}</h2><p class="prox">Próximamente</p></div></section>` : `<section class="sec" id="${g}"><div class="sec-in"><h2>${SECCIONES[g].titulo}</h2><a class="vt" href="#${g}">Ver todo →</a><p>${SECCIONES[g].texto}</p><div class="filtro"></div><div class="track"></div><div class="ctl"><button class="pv" aria-label="Anterior">‹</button><span class="cn"></span><button class="nx" aria-label="Siguiente">›</button></div></div></section>`).join("");
const paso = t => (t.firstElementChild?.getBoundingClientRect().width || 0) + parseFloat(getComputedStyle(t).gap || 0);
function contar(g) {
  if (SECCIONES[g].proximamente) return;
  const r = $("#" + g), t = $(".track", r), n = t.querySelectorAll(".card").length, st = paso(t);
  const tot = Math.max(1, n - (innerWidth <= 768 ? 2 : 4) + 1);
  $(".cn", r).textContent = n && st ? `${Math.min(Math.round(t.scrollLeft / st) + 1, tot)} / ${tot}` : "0 / 0";
}
function pintar(g) {
  if (SECCIONES[g].proximamente) return;
  const r = $("#" + g), f = filt[g], t = $(".track", r);
  const l = PRODUCTOS[g].map((p, i) => ({ p, i })).filter(({ p }) => (!f || p.cat === f) && (!q || `${p.nombre} ${p.marca} ${p.cat}`.toLowerCase().includes(q)));
  $(".filtro", r).innerHTML = f ? `Mostrando: <b>${f}</b> · <button class="quitar">Ver todo</button>` : "";
  t.innerHTML = l.length ? l.map(({ p, i }) => cardH(g, i, p)).join("") : "<p>No encontramos productos.</p>";
  t.scrollLeft = 0; contar(g);
}
function mover(g, d) {
  const t = $(".track", $("#" + g)), st = paso(t), max = t.scrollWidth - t.clientWidth;
  if (!st) return;
  if (d > 0) t.scrollTo({ left: t.scrollLeft >= max - 5 ? 0 : t.scrollLeft + st });
  else t.scrollTo({ left: t.scrollLeft <= 5 ? max : t.scrollLeft - st });
}
GRUPOS.forEach(g => {
  if (SECCIONES[g].proximamente) return;
  const r = $("#" + g), t = $(".track", r);
  $(".pv", r).onclick = () => mover(g, -1);
  $(".nx", r).onclick = () => mover(g, 1);
  t.onscroll = () => contar(g);
  r.onclick = e => { if (e.target.classList.contains("quitar")) { filt[g] = null; pintar(g); } };
  setInterval(() => { if (!r.matches(":hover")) mover(g, 1); }, 3500);
  pintar(g);
});
addEventListener("resize", () => GRUPOS.forEach(contar));

