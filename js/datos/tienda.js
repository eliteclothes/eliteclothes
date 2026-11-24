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
    "Pedregal": 10000,
    "12 de Octubre": 8000,
    "Picacho": 6000,
    "París": 5000,
    "Acevedo": 8000,
    "Cabañas": 8000,
    "Zamora": 6000,
    "Santa Rita": 5000,
    "Popular 1": 8000,
    "Popular 2": 8000,
    "Andalucía": 8000,
    "Campo Valdés": 12000,
    "Aranjuez": 12000,
    "Santo Domingo": 10000,
    "Bello": 12000,
    "Niquía": 14000,
    "Copacabana": 17000,
    "Girardota": 20000,
    "Castilla": 10000,
    "Manrique": 12000,
    "Barrio Antioquia": 14000,
    "Villa Hermosa": 10000,
    "Buenos Aires": 15000,
    "San Javier": 15000,
    "Laureles": 17000,
    "Guayabal": 14000,
    "Belén Po": 17000,
    "Belén Rincón": 17000,
    "San Cristóbal": 17000,
    "Prado Centro": 15000,
    "El Centro": 15000,
    "Envigado": 20000,
    "Itagüí": 20000,
    "Sabaneta": 20000,
    "La Estrella": 25000
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
