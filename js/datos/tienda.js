/* DATOS DE LA TIENDA: nombre, logo, WhatsApp, redes, envíos, pagos, textos de la página de producto */
// EDITA AQUÍ: datos de tu tienda
// ---------- ENVÍO POR ZONAS (Inter Rapidísimo): solo tienes que poner 4 precios ----------
// Cómo sacarlos (10 minutos): entra al cotizador de interrapidisimo.com, origen Medellín, un paquete de ropa típico, y cotiza:
//   origen -> una ciudad de Antioquia (ej. Rionegro)      centro -> Bogotá (o Cali)
//   costa  -> Barranquilla                                 lejano -> Leticia, Mocoa o San Andrés
// Escribe cada valor redondeado a $500 o $1.000. Si quieres UN SOLO precio para todo el país, pon el mismo número en las 4 zonas.
// Valores cotizados en Inter Rapidísimo (mensajería estándar, origen Medellín, noviembre de 2026) y redondeados hacia arriba a $500.
// Revísalos cuando Inter Rapidísimo cambie sus tarifas.
const ENVIO_ZONAS = {
  origen: { valor: 13000, deptos: ["Antioquia"] },        // cotizado: $12.600
  valle:  { valor: 17000, deptos: ["Valle del Cauca"] },     // cotizado: Medellín -> Cali, mensajería estándar = $16.900
  centro: { valor: 23500, deptos: ["Bogotá D.C.", "Cundinamarca", "Boyacá", "Caldas", "Risaralda", "Quindío", "Tolima", "Huila", "Santander", "Norte de Santander", "Meta", "Cauca"] },   // cotizado: Medellín -> Bogotá = $23.400
  costa:  { valor: 23500, deptos: ["Atlántico", "Bolívar", "Magdalena", "Cesar", "La Guajira", "Córdoba", "Sucre", "Nariño", "Casanare", "Arauca"] },   // cotizado: Barranquilla $23.400
  lejano: { valor: 54000, deptos: ["Amazonas", "Caquetá", "Chocó", "Guainía", "Guaviare", "Putumayo", "San Andrés y Providencia", "Vaupés", "Vichada"] }   // cotizado: $53.900
};
const ENVIO_DEPTOS = Object.fromEntries(Object.values(ENVIO_ZONAS).flatMap(z => z.deptos.map(d => [d, z.valor])));

const TIENDA = {
  nombre: "ELITE CLOTHES",                    // nombre que sale en el logo (si no hay imagen)
   logo: "img/logo.png",                               // ej: "img/logo.png" (déjalo "" para usar texto)
  lema1: "Ponte bien,",                // título grande (línea 1)
  lema2: "100% Elite.",  // título grande (línea 2)
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
  // Los valores del envío se llenan en ENVIO_ZONAS (al inicio de este archivo): solo son 4 precios.
  // Si una ciudad cuesta distinto a su zona (por ejemplo Medellín), agrégala en envioPorCiudad.
  envioPorDepartamento: ENVIO_DEPTOS,        // se arma solo a partir de las ZONAS de arriba (no lo edites aquí)
  envioPorCiudad: {                       // OPCIONAL: ciudades con un valor distinto al de su departamento
    // "Medellín": 8000,
    // "Rionegro": 10000
  },
  envioOtras: 23500,                      // valor si no se encuentra la ciudad ni el departamento
  retiro: "cualquiera de nuestras sedes",             // lugar de retiro ("" = ocultar)
  pagos: ["visa", "mastercard", "pse", "bancolombia"], // medios que SÍ aceptas (borra los que no).
                                          // Claves: visa, mastercard, pse, bancolombia, addi, nequi, contraentrega  |  o una ruta: "img/pagos/otro.png"
  pagosTexto: "Pago seguro en línea con Bold",
  calidadTitulo: "SELECCIÓN CUIDADA",
  calidadTexto: "Revisamos cada prenda antes de ponerla en la tienda.",
  acordeones: [                           // (YA NO SE USA) los desplegables ahora se editan en js/datos/legal.js → función ACORDEONES
    ["Medios de pago", "Confirmamos contigo por WhatsApp el medio de pago disponible al tomar tu pedido."],
    ["Tiempos de entrega", "Consulta tiempos y costos en nuestra <a href=\"#/l/envios\">política de envíos</a>."],
    ["Cambios & devoluciones", "Conoce las condiciones en <a href=\"#/l/cambios\">cambios y devoluciones</a>."]
  ]
};
