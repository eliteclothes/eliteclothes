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
  // El sistema busca, en este orden: 1) la ciudad en envioPorCiudad, 2) el departamento, 3) envioOtras.
  // IMPORTANTE: los valores de abajo son DE EJEMPLO ($15.000 en todos). Reemplázalos por los de la transportadora del dueño.
  envioPorDepartamento: {
    "Amazonas": 15000,
    "Antioquia": 15000,
    "Arauca": 15000,
    "Atlántico": 15000,
    "Bogotá D.C.": 15000,
    "Bolívar": 15000,
    "Boyacá": 15000,
    "Caldas": 15000,
    "Caquetá": 15000,
    "Casanare": 15000,
    "Cauca": 15000,
    "Cesar": 15000,
    "Chocó": 15000,
    "Córdoba": 15000,
    "Cundinamarca": 15000,
    "Guainía": 15000,
    "Guaviare": 15000,
    "Huila": 15000,
    "La Guajira": 15000,
    "Magdalena": 15000,
    "Meta": 15000,
    "Nariño": 15000,
    "Norte de Santander": 15000,
    "Putumayo": 15000,
    "Quindío": 15000,
    "Risaralda": 15000,
    "San Andrés y Providencia": 15000,
    "Santander": 15000,
    "Sucre": 15000,
    "Tolima": 15000,
    "Valle del Cauca": 15000,
    "Vaupés": 15000,
    "Vichada": 15000
  },
  envioPorCiudad: {                       // OPCIONAL: ciudades con un valor distinto al de su departamento
    // "Medellín": 8000,
    // "Rionegro": 10000
  },
  envioOtras: 15000,                      // valor si no se encuentra la ciudad ni el departamento
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
