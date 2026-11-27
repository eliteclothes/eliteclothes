/* MENÚ LATERAL y títulos de las secciones del inicio */
// EDITA AQUÍ: menú lateral (cada grupo tiene sub-enlaces)
const MENU = [
  // href: "#hombre" = pestaña completa | "#hombre/Camisetas" = solo productos cuyo "cat" sea Camisetas
  { t: "INICIO", sub: [{ t: "Ir al inicio", href: "#inicio" }] },
  { t: "HOMBRE", g: "hombre", sub: [{ t: "Ver todo", href: "#hombre" }, { t: "Camisetas", href: "#hombre/Camisetas" }, { t: "Buzos", href: "#hombre/Buzos" }, { t: "Pantalones", href: "#hombre/Pantalones" }, { t: "Pantalonetas", href: "#hombre/Pantalonetas" }, { t: "Sudaderas", href: "#hombre/Sudaderas" }, { t: "Calzado", href: "#hombre/Calzado" }, { t: "Conjuntos", href: "#hombre/Conjuntos" }, { t: "Perfumes", href: "#hombre/Perfumes" }, { t: "Relojes 1.1", href: "#hombre/Relojes 1.1" }, { t: "Relojes originales", href: "#hombre/Relojes originales" }, { t: "Bolsos 1.1", href: "#hombre/Bolsos 1.1" }, { t: "Bolsos originales", href: "#hombre/Bolsos originales" }, { t: "Gorras", href: "#hombre/Gorras" }, { t: "Accesorios", href: "#hombre/Accesorios" }] },
  // DESCUENTOS: muestra los productos que tienen descuento (el descuento se pone en el panel, en cada producto)
  { t: "DESCUENTOS", sub: [{ t: "Ver descuentos", href: "#hombre/Descuentos" }] },
  { t: "MUJER", g: "mujer", sub: [{ t: "Próximamente", href: "#mujer" }] },
  { t: "SEDES", sub: [{ t: "Cómo llegar", href: "#sedes" }] }
];

// EDITA AQUÍ: título y descripción de cada sección del catálogo
// cats: categorías que aparecen como filtros aunque aún no tengan productos (el nombre debe ser igual al "cat" de los productos)
// proximamente: true = la sección muestra "Próximamente" en vez de los productos (quita esa línea para activarla)
// NOMBRES ANTIGUOS: los productos que aún tengan estas categorías se muestran con el nombre nuevo (así no hay que editarlos uno por uno)
const CAT_ALIAS = { "Jeans": "Pantalones", "Mochos": "Pantalonetas" };

const SECCIONES = {
  hombre: { cats: ["Camisetas", "Buzos", "Pantalones", "Pantalonetas", "Sudaderas", "Calzado", "Conjuntos", "Perfumes", "Relojes 1.1", "Relojes originales", "Bolsos 1.1", "Bolsos originales", "Gorras", "Accesorios"], titulo: "Hombre", texto: "Descubre camisetas, conjuntos y tenis seleccionados para elevar tu estilo." },
  mujer:  { titulo: "Mujer",  texto: "Descubre blusas y bodys seleccionados para elevar tu estilo.", proximamente: true }
};
