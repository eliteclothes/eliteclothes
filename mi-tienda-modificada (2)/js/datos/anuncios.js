/* BARRA DE ANUNCIOS (arriba del encabezado). Aquí editas los mensajes. */

// Segundos que dura cada mensaje antes de pasar al siguiente (más alto = más lento)
const ANUNCIOS_SEG = 5;

// Mensajes que rotan. "enlace" es opcional (ej: "#/l/envios", "#hombre"); déjalo "" si no lleva enlace.
// Usa <b>...</b> para resaltar en dorado. Puedes usar {envioGratis} y {diasCambio}: se llenan solos.
const ANUNCIOS = [
  { texto: "Envío gratis en compras desde <b>{envioGratis}</b>", enlace: "#/l/envios" },
  { texto: "Cambios por talla hasta <b>{diasCambio} días hábiles</b>", enlace: "#/l/cambios" },
  { texto: "Escríbenos por WhatsApp y te <b>asesoramos</b> con tu talla", enlace: "" },
  { texto: "Prendas <b>seleccionadas</b> una a una", enlace: "" }
];
