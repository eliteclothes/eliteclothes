/* PÁGINAS LEGALES: dibuja la página #/l/<nombre> con los textos de js/datos/legal.js */
function verLegal(k) {
  const d = LEGAL_PAGINAS[k];
  document.title = `${d.titulo} · ${TIENDA.nombre}`;
  $("#legal").innerHTML = `<article class="lg">
    <div class="lg-hero"><div><div class="mig"><a href="#inicio">Inicio</a> / ${d.titulo}</div>
      <h1><span class="hl">${d.titulo}</span></h1><p class="fe">Última actualización: ${LEGAL.fecha}</p></div></div>
    ${d.resumen ? `<div class="corto"><b>En corto</b><ul>${d.resumen.map(x => `<li>${x}</li>`).join("")}</ul></div>` : ""}
    <div class="lg-cards">${d.secciones().map(([t, x], i) => `<section class="lc c${i % 4}"><h2><span class="n">${String(i + 1).padStart(2, "0")}</span>${t}</h2>${x}</section>`).join("")}</div>
    <nav class="otros"><b>Más ayuda</b>${Object.entries(LEGAL_PAGINAS).filter(([x]) => x !== k).map(([x, o]) => `<a href="#/l/${x}">${o.titulo}</a>`).join("")}</nav></article>`;
}
