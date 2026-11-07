/* DATOS DE LA TIENDA: nombre, logo, WhatsApp, redes, envíos, pagos, textos de la página de producto */
// EDITA AQUÍ: datos de tu tienda
const TIENDA = {
  nombre: "ELITE CLOTHES",                    // nombre que sale en el logo (si no hay imagen)
   logo: "img/logo.png",                               // ej: "img/logo.png" (déjalo "" para usar texto)
  lema1: "Viste con intención,",                // título grande (línea 1)
  lema2: "estilo para cada ocasión.",  // título grande (línea 2)
  eslogan: "Moda, fragancias y accesorios",             // frase bajo el nombre en el pie negro
  info: ["Prendas seleccionadas con cuidado", "Despachamos a todo el país", "Te asesoramos por WhatsApp"],
  politicas: [                            // enlaces del pie (pon aquí tus páginas)
    ["Contacto", "#"], ["Cambios y devoluciones", "#"], ["Aviso legal", "#"],
    ["Privacidad", "#"], ["Términos de servicio", "#"]
  ],
  whatsapp: "573122469998",               // tu número con indicativo, sin + ni espacios
  instagram: "https://www.instagram.com/elite_clothes2/",
  tiktok: "https://www.tiktok.com/@elite.clothes7",
  envios: "Hacemos envíos a todo Colombia.",   // el aviso de envío gratis se agrega solo con "envioGratis"
  // ---- Página de producto ----
  envioGratis: 500000,                    // compras desde este valor tienen envío gratis (0 = ocultar aviso)
  retiro: "Tu tienda física",             // lugar de retiro ("" = ocultar)
  pagos: ["visa", "mastercard", "pse", "contraentrega"], // medios que SÍ aceptas. Disponibles: visa, mastercard, pse, nequi, contraentrega
                                          // o la ruta de tu propio logo: "img/pagos/daviplata.png"
  pagosTexto: "Pago contra entrega",
  calidadTitulo: "SELECCIÓN CUIDADA",
  calidadTexto: "Revisamos cada prenda antes de ponerla en la tienda.",
  acordeones: [                           // desplegables de la página de producto: [título, texto]
    ["Medios de pago", "Escribe aquí los medios de pago que aceptas."],
    ["Tiempos de entrega", "Escribe aquí los tiempos de entrega por ciudad."],
    ["Cambios & devoluciones", "Escribe aquí tu política de cambios y devoluciones."]
  ]
};
