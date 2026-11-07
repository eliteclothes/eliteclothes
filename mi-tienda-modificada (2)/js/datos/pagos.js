/* ÍCONOS DE MEDIOS DE PAGO. Son dibujos aproximados; para usar el logo oficial pon su imagen en img/pagos/
   y escribe la ruta en TIENDA.pagos (ej: "img/pagos/nequi.png"). */
const _pg = (n, x) => `<span class="pgi" title="${n}"><svg viewBox="0 0 48 30" width="44" height="28" role="img" aria-label="${n}">${x}</svg></span>`;
const PAGOS_SVG = {
  visa: _pg("Visa", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><text x="24" y="21" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-style="italic" font-size="14" fill="#1a1f71">VISA</text>'),
  mastercard: _pg("Mastercard", '<rect width="48" height="30" rx="5" fill="#1a1a1a"/><circle cx="19" cy="15" r="8" fill="#eb001b"/><circle cx="29" cy="15" r="8" fill="#f79e1b"/><path d="M24 8.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4z" fill="#ff5f00"/>'),
  pse: _pg("PSE", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><circle cx="12" cy="15" r="4" fill="#00a0df"/><text x="31" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#004a99">PSE</text>'),
  nequi: _pg("Nequi", '<rect width="48" height="30" rx="5" fill="#da0081"/><text x="24" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#fff">nequi</text>'),
  contraentrega: _pg("Pago contra entrega", '<rect width="48" height="30" rx="5" fill="#fff" stroke="#d9d9d9"/><path d="M9 9h18v12H9zM27 12h7l5 5v4H27z" fill="none" stroke="#555" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="22" r="2.4" fill="#555"/><circle cx="33" cy="22" r="2.4" fill="#555"/>')
};
function pagoIcono(k) {
  if (PAGOS_SVG[k]) return PAGOS_SVG[k];
  return /[\/.]/.test(k) ? `<span class="pgi"><img src="${k}" alt="Medio de pago" height="28"></span>` : `<span class="pg">${k}</span>`;
}
