/* COMPARAR CATEGORÍAS: ignora mayúsculas, tildes, espacios sobrantes y singular/plural
   (así "relojes", "Relojes ", "RELOJES" y "Reloj" cuentan como la misma categoría). */
const _nc = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const _vs = s => new Set([s, s.replace(/s$/, ""), s.replace(/es$/, "")]);
function mismaCat(a, b) {
  const x = _nc(a), y = _nc(b);
  if (!x || !y) return x === y;
  if (x === y) return true;
  const vx = _vs(x);
  return [..._vs(y)].some(v => vx.has(v));
}
// Devuelve el nombre "oficial" de la categoría (el de SECCIONES.cats en menu.js) si coincide; si no, el texto limpio.
function canonCat(g, cat) {
  const c = String(cat || "").trim().replace(/\s+/g, " ");
  const lista = (typeof SECCIONES !== "undefined" && SECCIONES[g] && SECCIONES[g].cats) || [];
  return lista.find(x => mismaCat(x, c)) || c;
}
