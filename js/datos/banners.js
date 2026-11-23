/* BANNERS del carrusel principal de la página de inicio */
// EDITA AQUÍ: banners del carrusel principal (imagen: "img/banner1.jpg")
//
// pos = qué parte de la foto se ve cuando se recorta (en el computador se corta más arriba y abajo).
//   Son dos porcentajes: "izquierda-derecha arriba-abajo".  Ejemplos:
//     "center center"  -> el centro (lo normal)
//     "center top"     -> se ve la parte de ARRIBA de la foto (úsalo si se te corta la cabeza o un letrero)
//     "center bottom"  -> se ve la parte de ABAJO
//     "center 25%"     -> casi arriba (0% = arriba del todo, 100% = abajo del todo)
//     "20% center"     -> más hacia la izquierda;  "80% center" -> más hacia la derecha
//   Si no pones pos, se usa el centro.
const BANNERS = [
  { img: "img/navidad.jpg", pos: "center center", titulo: "Visítanos en tienda",   texto: "Prueba, elige y llévate tu estilo",  boton: "Cómo llegar", href: "#sedes" },
  { img: "img/banner1.jpg", pos: "center center", titulo: "Gorras y fragancias",   texto: "Los detalles que completan tu look", boton: "Explorar", href: "#hombre/Gorras" },
  { img: "img/banner3.jpg", pos: "center center", titulo: "Estilo a tu medida",    texto: "Prendas seleccionadas una a una",    boton: "Ver colección", href: "#hombre" }
];
