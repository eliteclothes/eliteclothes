/* UTILIDADES y estado general (no editar) */
const $ = (s, r = document) => r.querySelector(s);
// Enlace completo (https://...) de una imagen; las de muestra (data:) no se envían
const urlImg = s => { try { return !s || s.startsWith("data:") ? "" : new URL(s, location.href).href; } catch (e) { return ""; } };
// Enlace a la página del producto
const urlProducto = (g, i) => location.origin + location.pathname + `#/p/${g}/${i}`;
const cop = n => "$" + Number(n).toLocaleString("es-CO");
const muestra = (t, i) => "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='${["#e6e6e6","#dcdcdc","#d2d2d2"][i % 3]}'/><text x='400' y='410' fill='#888' font-size='34' text-anchor='middle' font-family='sans-serif'>${t}</text></svg>`);
const IG = '<svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.7 2.05h6.6A4.65 4.65 0 0 1 17.95 6.7v6.6a4.65 4.65 0 0 1-4.65 4.65H6.7A4.65 4.65 0 0 1 2.05 13.3V6.7A4.65 4.65 0 0 1 6.7 2.05m0 1.5A3.15 3.15 0 0 0 3.55 6.7v6.6a3.15 3.15 0 0 0 3.15 3.15h6.6a3.15 3.15 0 0 0 3.15-3.15V6.7a3.15 3.15 0 0 0-3.15-3.15zM10 6.3a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4m0 1.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4m3.9-2.3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8"/></svg>';
const TT = '<svg viewBox="0 0 20 20"><path d="M10.5 1.7h2.7s-.2 3.5 3.8 3.8v2.7s-2.1.1-3.8-1.2l.1 5.600A5.100 5.100 0 1 1 8.200 7.600h.7v2.800a2.300 2.300 0 1 0 1.600 2.200z"/></svg>';
const ICO = {
  caja: '<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10M8 5l8 4"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 18v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3M8 18v-3M16 18v-3M10 20h4"/><rect x="9" y="3" width="6" height="7" rx="3"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="4"/><path d="M8 11V8a4 4 0 1 1 8 0v3M12 15v2"/></svg>'
};
const GRUPOS = Object.keys(SECCIONES);
const filt = {}, vistos = {};
let q = "", carrito = [], sel = null;
try { carrito = JSON.parse(localStorage.getItem("carrito") || "[]"); } catch (e) {}

