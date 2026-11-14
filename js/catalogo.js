/* PÁGINA DE CATEGORÍA: muestra solo los productos de esa categoría, con filtros y orden */
let cs = null;
const dispo = p => p.tallas.some(t => !p.agotadas.includes(t));
function verCatalogo(g, cat) {
  const S = SECCIONES[g];
  if (S.proximamente) { cs = null; $("#catalogo").innerHTML = `<div class="cp"><div class="mig"><a href="#inicio">Inicio</a> / ${S.titulo}</div><h1 class="ct">${S.titulo}</h1><p class="prox">Próximamente</p></div>`; return; }
  const base = PRODUCTOS[g], cats = [...new Set([...(S.cats || []), ...base.map(p => p.cat)])];
  const scope = base.filter(p => !cat || p.cat === cat), uniq = f => [...new Set(scope.flatMap(f))];
  const tallas = uniq(p => p.tallas), marcas = uniq(p => [p.marca]);
  cs = { g, cat, solo: false, tallas: [], marcas: [], min: "", max: "", orden: "" };
  $("#catalogo").innerHTML = `<div class="cp">
    <div class="mig"><a href="#inicio">Inicio</a> / <a href="#${g}">${S.titulo}</a>${cat ? ` / ${cat}` : ""}</div>
    <h1 class="ct">${cat || S.titulo}</h1><p class="cd">${cat ? `${S.titulo} · ${cat}` : S.texto}</p>
    <div class="chips">${[["", "Todo"], ...cats.map(c => [c, c])].map(([v, t]) => `<a class="chip ${v === cat ? "on" : ""}" href="#${g}${v ? "/" + encodeURIComponent(v) : ""}">${t}</a>`).join("")}</div>
    <div class="barra"><button type="button" class="ftog" data-f="toggle">Filtrar ▾</button>
      <label class="ord">Ordenar <select data-f="orden"><option value="">Destacados</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option><option value="az">Nombre A–Z</option></select></label>
      <span id="ccount"></span></div>
    <div class="flc" hidden>
      <div><b>Disponibilidad</b><label class="ck"><input type="checkbox" data-f="solo"> Solo disponibles</label></div>
      <div><b>Talla</b><div class="sz">${tallas.map(t => `<button type="button" data-ft="${t}">${t}</button>`).join("")}</div></div>
      ${marcas.length > 1 ? `<div><b>Marca</b>${marcas.map(x => `<label class="ck"><input type="checkbox" data-fm="${x}"> ${x}</label>`).join("")}</div>` : ""}
      <div><b>Precio</b><div class="pr2"><input type="number" min="0" placeholder="Desde" data-f="min"><input type="number" min="0" placeholder="Hasta" data-f="max"></div></div>
      <button type="button" class="lim" data-f="limpiar">Limpiar filtros</button></div>
    <div class="cgrid" id="cgrid"></div></div>`;
  gridCat();
}
function gridCat() {
  const c = cs, mn = +c.min || 0, mx = +c.max || Infinity;
  const ord = { asc: (a, b) => a.p.precio - b.p.precio, desc: (a, b) => b.p.precio - a.p.precio, az: (a, b) => a.p.nombre.localeCompare(b.p.nombre) }[c.orden];
  const l = PRODUCTOS[c.g].map((p, i) => ({ p, i })).filter(({ p }) =>
    (!c.cat || p.cat === c.cat) && (!c.solo || dispo(p)) &&
    (!c.tallas.length || p.tallas.some(t => c.tallas.includes(t) && !p.agotadas.includes(t))) &&
    (!c.marcas.length || c.marcas.includes(p.marca)) && p.precio >= mn && p.precio <= mx);
  if (ord) l.sort(ord);
  $("#cgrid").innerHTML = l.length ? l.map(({ p, i }) => cardH(c.g, i, p, true)).join("") : `<p class='vacio'>${PRODUCTOS[c.g].some(p => !c.cat || p.cat === c.cat) ? "No hay productos con esos filtros." : "Próximamente"}</p>`;
  $("#ccount").textContent = `${l.length} producto${l.length === 1 ? "" : "s"}`;
}
function filtroEvento(e) {
  const t = e.target; if (!cs) return;
  if (e.type === "click") {
    if (t.dataset.f === "toggle") { const f = $("#catalogo .flc"); f.hidden = !f.hidden; return; }
    if (t.dataset.f === "limpiar") { verCatalogo(cs.g, cs.cat); $("#catalogo .flc").hidden = false; return; }
    if (!t.dataset.ft) return;
    const i = cs.tallas.indexOf(t.dataset.ft); i < 0 ? cs.tallas.push(t.dataset.ft) : cs.tallas.splice(i, 1);
    t.classList.toggle("sel");
  } else if (t.dataset.f === "solo") cs.solo = t.checked;
  else if (t.dataset.f) cs[t.dataset.f] = t.value;
  else if (t.dataset.fm) { const i = cs.marcas.indexOf(t.dataset.fm); t.checked ? cs.marcas.push(t.dataset.fm) : cs.marcas.splice(i, 1); }
  else return;
  gridCat();
}
$("#catalogo").addEventListener("input", filtroEvento);
$("#catalogo").addEventListener("click", filtroEvento);
