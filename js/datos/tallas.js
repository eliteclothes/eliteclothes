/* TALLAS: tipos de talla que ofrece el panel (ropa, gorras, calzado) y cómo se ordenan.
   Lo usan el panel (admin/) y la tienda. Para agregar o quitar tallas, edita las listas de abajo. */

// Orden de las tallas de letras (las numéricas y con fracción se ordenan por su valor)
const ORDEN_TALLAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XS/S", "S/M", "M/L", "L/XL", "Única"];

// Gorras ajustadas New Era 59FIFTY: talla -> cm de contorno de cabeza
const GORRA_CM = { "6 7/8": "54.9", "7": "55.8", "7 1/8": "56.8", "7 1/4": "57.7", "7 3/8": "58.7", "7 1/2": "59.6", "7 5/8": "60.6", "7 3/4": "61.5", "7 7/8": "62.5", "8": "63.5", "8 1/8": "64.5", "8 1/4": "65.4" };
// Gorras elásticas New Era 39THIRTY: talla -> rango de cm
const GORRA_ELASTICA_CM = { "XS/S": "54.9–55.8", "S/M": "56.8–58.7", "M/L": "58.7–60.6", "L/XL": "61.5–65.4" };

// grupos: bloques de botones que se muestran en el panel. cm: ayuda al pasar el mouse por encima.
const TIPOS_TALLA = {
  ropa: {
    nombre: "Ropa",
    ayuda: "Tallas de ropa. Si necesitas otra, escríbela en “Otra talla”.",
    grupos: [{ l: ["XS", "S", "M", "L", "XL", "XXL", "Única", ...Array.from({ length: 9 }, (_, i) => String(36 + i))] }]
  },
  gorras: {
    nombre: "Gorras",
    ayuda: "Gorras New Era: ajustadas (59FIFTY, talla en pulgadas) y elásticas (39THIRTY). Pasa el mouse por una talla para ver los cm de contorno de cabeza.",
    ejemplo: "7 1/8",
    grupos: [
      { t: "Ajustadas · 59FIFTY", l: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8", "7 3/4", "7 7/8", "8", "8 1/8", "8 1/4"], cm: GORRA_CM },
      { t: "Elásticas · 39THIRTY", l: ["XS/S", "S/M", "M/L", "L/XL"], cm: GORRA_ELASTICA_CM },
      { t: "Ajustable", l: ["Única"] }
    ]
  },
  calzado: {
    nombre: "Calzado (tallas europeas)",
    ayuda: "Tallas europeas (EU). Para media talla escríbela en “Otra talla” (ej: 42.5).",
    ejemplo: "42.5",
    grupos: [{ l: Array.from({ length: 13 }, (_, i) => String(35 + i)) }]
  }
};

// Qué tipo de talla corresponde a una categoría ("Gorras" -> gorras, "Calzado"/"Tenis" -> calzado, lo demás -> ropa)
function tipoTallaDeCat(cat) {
  const c = String(cat || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (/gorr|cachucha|cap\b/.test(c)) return "gorras";
  if (/calzado|tenis|zapat|sneaker|bota|sandalia|chancla/.test(c)) return "calzado";
  return "ropa";
}

// Para ordenar tallas: letras según ORDEN_TALLAS, luego números ("42", "42.5", "7 1/8")
function valorTalla(t) {
  const i = ORDEN_TALLAS.indexOf(t);
  if (i >= 0) return [0, i];
  const m = String(t).trim().match(/^(\d+)(?:\s+(\d+)\/(\d+))?$/);
  if (m) return [1, +m[1] + (m[2] ? m[2] / m[3] : 0)];
  const n = parseFloat(String(t).replace(",", "."));
  return isNaN(n) ? [2, 0] : [1, n];
}
function ordenTalla(a, b) {
  const x = valorTalla(a), y = valorTalla(b);
  return x[0] - y[0] || x[1] - y[1] || String(a).localeCompare(String(b), "es", { numeric: true });
}
