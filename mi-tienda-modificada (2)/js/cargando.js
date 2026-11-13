/* PANTALLA DE CARGA: el logo gira en 3D un momento cada vez que se cambia de apartado */
const _cg = document.createElement("div");
_cg.id = "cargando"; _cg.setAttribute("aria-hidden", "true");
const _capas = Array.from({ length: 9 }, (_, i) => `<img src="${TIENDA.logo}" alt="" class="${i === 0 ? "atras" : i === 8 ? "frente" : "canto"}" style="--z:${(i - 4) * 2}px">`).join("");
_cg.innerHTML = `<div class="escena"><div class="moneda">${_capas}<span class="brillo"></span></div><div class="sombra"></div><p>Cargando…</p></div>`;
document.body.appendChild(_cg);
let _cgT = null;
function cargando(ms) {
  clearTimeout(_cgT);
  _cg.classList.add("on");
  _cgT = setTimeout(() => _cg.classList.remove("on"), ms || 800);
}
