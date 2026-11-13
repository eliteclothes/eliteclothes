/* DATOS DE LA TIENDA: nombre, logo, WhatsApp, redes, envíos, pagos, textos de la página de producto */
// EDITA AQUÍ: datos de tu tienda
const TIENDA = {
  nombre: "ELITE CLOTHES",                    // nombre que sale en el logo (si no hay imagen)
   logo: "img/logo.png",                               // ej: "img/logo.png" (déjalo "" para usar texto)
  lema1: "Viste con intención,",                // título grande (línea 1)
  lema2: "estilo para cada ocasión.",  // título grande (línea 2)
  eslogan: "Moda, fragancias y accesorios",             // frase bajo el nombre en el pie negro
  info: ["Prendas seleccionadas con cuidado", "Despachamos a todo el país", "Te asesoramos por WhatsApp"],
  politicas: [                            // enlaces del pie (páginas en js/datos/legal.js)
    ["Contacto y PQR", "#/l/contacto"], ["Envíos", "#/l/envios"], ["Cambios y devoluciones", "#/l/cambios"],
    ["Aviso legal", "#/l/legal"], ["Privacidad", "#/l/privacidad"], ["Términos y condiciones", "#/l/terminos"]
  ],
  whatsapp: "573122469998",               // tu número con indicativo, sin + ni espacios
  instagram: "https://www.instagram.com/elite_clothes2/",
  tiktok: "https://www.tiktok.com/@elite.clothes7",
  envios: "Hacemos envíos a todo Colombia.",
  // ---- Página de producto ----
  envioGratis: 300000,                    // compras desde este valor tienen envío gratis (0 = ocultar aviso)
  retiro: "Tu tienda física",             // lugar de retiro ("" = ocultar)
  pagos: ["visa", "mastercard", "pse", "bancolombia", "contraentrega"], // medios que SÍ aceptas (borra los que no).
                                          // Claves: visa, mastercard, pse, bancolombia, addi, nequi, contraentrega  |  o una ruta: "img/pagos/otro.png"
  pagosTexto: "Pago contra entrega",
  calidadTitulo: "SELECCIÓN CUIDADA",
  calidadTexto: "Revisamos cada prenda antes de ponerla en la tienda.",
  acordeones: [                           // (YA NO SE USA) los desplegables ahora se editan en js/datos/legal.js → función ACORDEONES
    ["Medios de pago", "Confirmamos contigo por WhatsApp el medio de pago disponible al tomar tu pedido."],
    ["Tiempos de entrega", "Consulta tiempos y costos en nuestra <a href=\"#/l/envios\">política de envíos</a>."],
    ["Cambios & devoluciones", "Conoce las condiciones en <a href=\"#/l/cambios\">cambios y devoluciones</a>."]
  ]
};
