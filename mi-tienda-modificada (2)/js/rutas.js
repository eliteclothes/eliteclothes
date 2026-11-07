/* TARJETAS de producto y NAVEGACIÓN entre inicio / categoría / producto */
// ---------- Tarjeta de producto (home y "Otras opciones") ----------
const cop2 = n => "$" + Number(n).toLocaleString("es-CO");
function cardH(g, i, p, precio) {
  return `<a href="#/p/${g}/${i}" class="card"><div class="im" style="background-image:url('${(p.imgs && p.imgs[0]) || p.img || muestra(p.nombre, i)}')"></div><div class="cat">${p.cat}</div><div class="nm">${p.nombre}</div><div class="pr">${cop2(p.precio)}</div><div class="sz">${p.tallas.map(x => `<span class="${p.agotadas.includes(x) ? "ago" : ""}">${x}</span>`).join("")}</div>${p.marca ? `<div class="mk">${p.marca}</div>` : ""}</a>`;
}

// ---------- Navegación: inicio / categoría (#/c/grupo/categoría) / producto (#/p/grupo/número) ----------
const enInicio = () => !$("#home").hidden;
function irHome() { history.pushState(null, "", location.pathname + location.search); ruta(); }
function ruta() {
  const h = location.hash, p = h.match(/^#\/p\/(\w+)\/(\d+)$/), c = h.match(/^#\/c\/(\w+)(?:\/(.+))?$/);
  const okP = p && SECCIONES[p[1]] && PRODUCTOS[p[1]] && !SECCIONES[p[1]].proximamente && PRODUCTOS[p[1]][+p[2]], okC = !okP && c && SECCIONES[c[1]] && PRODUCTOS[c[1]];
  $("#home").hidden = !!(okP || okC); $("#producto").hidden = !okP; $("#catalogo").hidden = !okC;
  if (okP) verProducto(p[1], +p[2]); else if (okC) verCatalogo(c[1], c[2] ? decodeURIComponent(c[2]) : "");
  if (okP || okC) scrollTo(0, 0);
}
addEventListener("hashchange", ruta);
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]'), h = a && a.getAttribute("href");
  if (!h || h === "#" || h.startsWith("#/")) return;
  e.preventDefault(); cerrar();
  const [g, f] = h.slice(1).split("/");
  if (SECCIONES[g]) { location.hash = "#/c/" + g + (f ? "/" + encodeURIComponent(decodeURIComponent(f)) : ""); return; }
  if (!enInicio()) irHome();
  document.getElementById(h.slice(1))?.scrollIntoView({ behavior: "smooth" });
});
