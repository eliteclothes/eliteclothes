/* MENÚ LATERAL y títulos de las secciones del inicio */
// EDITA AQUÍ: menú lateral (cada grupo tiene sub-enlaces)
const MENU = [
  // href: "#hombre" = pestaña completa | "#hombre/Camisetas" = solo productos cuyo "cat" sea Camisetas
  { t: "INICIO", sub: [{ t: "Ir al inicio", href: "#inicio" }] },
  { t: "HOMBRE", g: "hombre", sub: [{ t: "Ver todo", href: "#hombre" }, { t: "Camisetas", href: "#hombre/Camisetas" }, { t: "Buzos", href: "#hombre/Buzos" }, { t: "Prendas inferiores", href: "#hombre/Prendas inferiores" }, { t: "Calzado", href: "#hombre/Calzado" }, { t: "Conjuntos", href: "#hombre/Conjuntos" }, { t: "Perfumes", href: "#hombre/Perfumes" }, { t: "Relojes", href: "#hombre/Relojes" }, { t: "Gorras", href: "#hombre/Gorras" }, { t: "Accesorios", href: "#hombre/Accesorios" }] },
  { t: "MUJER", g: "mujer", sub: [{ t: "Próximamente", href: "#mujer" }] }
];

// EDITA AQUÍ: título y descripción de cada sección del catálogo
// cats: categorías que aparecen como filtros aunque aún no tengan productos (el nombre debe ser igual al "cat" de los productos)
// proximamente: true = la sección muestra "Próximamente" en vez de los productos (quita esa línea para activarla)
const SECCIONES = {
  hombre: { cats: ["Camisetas", "Buzos", "Prendas inferiores", "Calzado", "Conjuntos", "Perfumes", "Relojes", "Gorras", "Accesorios"], titulo: "Hombre", texto: "Descubre camisetas, conjuntos y tenis seleccionados para elevar tu estilo." },
  mujer:  { titulo: "Mujer",  texto: "Descubre blusas y bodys seleccionados para elevar tu estilo.", proximamente: true }
};
