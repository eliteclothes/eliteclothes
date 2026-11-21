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
  envioGratis: 500000,                    // compras SUPERIORES a este valor tienen envío gratis (0 = ocultar aviso)
  // ---- COSTO DEL ENVÍO (solo se cobra cuando la compra NO supera envioGratis) ----
  // En el formulario el cliente elige su zona en un menú desplegable (Medellín y Valle de Aburrá).
  // Si NO es de la zona, elige Interrapidísimo: no se cobra envío en la página, el cliente paga la guía
  // directamente a Interrapidísimo cuando reclama su pedido.
  envioZonas: {
    "Pedregal": 13000,
    "12 de Octubre": 14000,
    "Picacho": 15000,
    "París": 14000,
    "Cabañas": 10000,
    "Campo Valdés": 12000,
    "Bello": 15000,
    "Niquía": 16000,
    "Copacabana": 20000,
    "Girardota": 25000,
    "Castilla": 14000,
    "Barrio Antioquia": 17000,
    "Villa Hermosa": 15000,
    "Buenos Aires": 16000,
    "San Javier": 18000,
    "Laureles": 17000,
    "Envigado": 20000,
    "Itagüí": 24000,
    "Sabaneta": 25000,
    "La Estrella": 30000
  },
  retiroTiempo: "Normalmente está listo en 1 hora",   // texto bajo cada sede en la opción "Retiro" (las sedes están en js/datos/sedes.js)
  envioZonaTitulo: "Domicilio en Medellín y Valle de Aburrá",
  envioInterTitulo: "Interrapidísimo (fuera de Medellín)",
  envioInterNota: "Pagas tus productos aquí en la página. Solo la guía del envío la pagas a Interrapidísimo cuando reclames tu pedido.",
  retiro: "cualquiera de nuestras sedes",             // lugar de retiro ("" = ocultar)
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
