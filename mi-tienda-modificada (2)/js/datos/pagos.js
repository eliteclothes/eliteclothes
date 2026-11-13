/* ÍCONOS DE MEDIOS DE PAGO.
   Para que se vean con el logo OFICIAL, guarda cada imagen en img/pagos/ con el nombre de la clave:
   visa.svg, mastercard.svg, pse.svg, bancolombia.svg, nequi.svg ... (también sirven .png o .webp).
   Si el archivo no existe, se muestra un dibujo de respaldo. Ver img/pagos/LEEME.txt */
const _pg = (n, x) => `<span class="pgi" title="${n}"><svg viewBox="0 0 48 30" width="44" height="28" role="img" aria-label="${n}">${x}</svg></span>`;
const PAGOS_SVG = {
  visa: _pg("Visa", '<rect width="48" height="30" rx="5" fill="#1434cb"/><text x="24" y="21" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#fff">VISA</text>'),
  mastercard: _pg("Mastercard", '<rect width="48" height="30" rx="5" fill="#1a1a1a"/><circle cx="19" cy="15" r="8" fill="#eb001b"/><circle cx="29" cy="15" r="8" fill="#f79e1b"/><path d="M24 8.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4z" fill="#ff5f00"/>'),
  pse: _pg("PSE", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><text x="24" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-style="italic" font-weight="300" font-size="15" fill="#4aa8e0">pse</text>'),
  nequi: _pg("Nequi", '<rect width="48" height="30" rx="5" fill="#da0081"/><text x="24" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#fff">nequi</text>'),
  contraentrega: _pg("Pago contra entrega", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><path d="M9 9h18v12H9zM27 12h7l5 5v4H27z" fill="none" stroke="#555" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="22" r="2.4" fill="#555"/><circle cx="33" cy="22" r="2.4" fill="#555"/>'),
  bancolombia: _pg("Bancolombia", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><g transform="skewX(-20)"><rect x="14" y="8" width="3.5" height="14" fill="#fdda24"/><rect x="19" y="8" width="3.5" height="14" fill="#1c3f94"/></g><text x="30.5" y="18" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="5.2" fill="#2c2a29">bancolombia</text>'),
  addi: _pg("Addi", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><circle cx="24" cy="15" r="10" fill="#111"/><g transform="translate(24 15) skewX(-20)" fill="#fff"><rect x="-4.5" y="-5.5" width="9" height="2.2"/><rect x="-4.5" y="-1.1" width="9" height="2.2"/><rect x="-4.5" y="3.3" width="9" height="2.2"/></g>')
};
const PAGOS_NOMBRE = { visa: "Visa", mastercard: "Mastercard", pse: "PSE", bancolombia: "Bancolombia", addi: "Addi", nequi: "Nequi", contraentrega: "Pago contra entrega" };
const PAGOS_EXT = ["svg", "png", "webp"];
function pagoIcono(k) {
  if (/[\/.]/.test(k)) return `<span class="pgi img"><img src="${k}" alt="Medio de pago" loading="lazy"></span>`;
  const n = PAGOS_NOMBRE[k] || k;
  return `<span class="pgi img" data-k="${k}" title="${n}"><img src="img/pagos/${k}.svg" alt="${n}" data-i="0" onerror="pagoFallback(this)"></span>`;
}
function pagoFallback(img) {
  const t = img.parentElement, k = t.dataset.k, i = +img.dataset.i + 1;
  if (i < PAGOS_EXT.length) { img.dataset.i = i; img.src = `img/pagos/${k}.${PAGOS_EXT[i]}`; return; }
  t.classList.remove("img");
  t.innerHTML = PAGOS_SVG[k] ? PAGOS_SVG[k].replace(/^<span[^>]*>|<\/span>$/g, "") : `<span class="pg">${k}</span>`;
}
