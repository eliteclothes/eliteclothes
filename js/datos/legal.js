/* TEXTOS LEGALES (Colombia). Son borradores bien armados para adaptar: que un abogado los revise antes de publicar.
   1) Llena el bloque LEGAL. Lo que diga [COMPLETAR...] sale resaltado en amarillo en la página: no publiques con amarillo.
   2) Los valores sin [COMPLETAR] (tiempos, plazos, costos) son SUGERIDOS: cámbialos por los de tu operación real.
   3) Cada página tiene "resumen" (la cajita "En corto") y "secciones" (las tarjetas). Edita el texto con calma, solo lo que está entre comillas/comillas invertidas. */
const LEGAL = {
  fecha: "6 de noviembre de 2026",
  // ---- DATOS DEL NEGOCIO Y PERSONALES (los llenas tú) ----
  razonSocial: "[COMPLETAR: nombre completo o razón social del titular]",
  nit: "[COMPLETAR: NIT o cédula]",
  ciudad: "[COMPLETAR: ciudad y departamento]",
  direccion: "[COMPLETAR: dirección, o escribe: Venta exclusivamente en línea]",
  direccionCambios: "[COMPLETAR: dirección a la que se envían cambios y devoluciones]",
  correo: "[COMPLETAR: correo de contacto]",
  horario: "[COMPLETAR: ej. lunes a sábado, 10:00 a. m. a 8:00 p. m.]",
  mediosPago: "[COMPLETAR: ej. transferencia bancaria, Nequi, link de pago, pago contra entrega]",
  transportadoras: "[COMPLETAR: ej. Servientrega, Interrapidísimo]",
  costoEnvio: "[COMPLETAR: ej. entre $13.000 y $30.000 según destino y peso]",
  // ---- POLÍTICAS (valores sugeridos: ajústalos a lo que realmente haces) ----
  tiempoLocal: "el mismo día o al siguiente día hábil",
  tiempoNacional: "de 2 a 5 días hábiles",
  diasCambio: "10",            // días hábiles para pedir un cambio por talla o gusto
  diasRespuesta: "15"          // días hábiles para responder una PQR
};
const _v = k => /^\[COMPLETAR/.test(LEGAL[k]) ? `<mark>${LEGAL[k]}</mark>` : LEGAL[k];
const _wa = () => "+" + TIENDA.whatsapp;
const _p = (...t) => t.map(x => `<p>${x}</p>`).join("");
const _ul = a => `<ul>${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
const _tip = x => `<div class="tip"><b>Tip:</b> ${x}</div>`;
const _sic = '<a href="https://www.sic.gov.co" target="_blank" rel="noopener">Superintendencia de Industria y Comercio (sic.gov.co)</a>';
const _titular = () => `<b>${_v("razonSocial")}</b>, que opera bajo el nombre comercial <b>${TIENDA.nombre}</b>, identificado con ${_v("nit")}, con domicilio en ${_v("ciudad")}`;
const _contacto = () => `WhatsApp <b>${_wa()}</b> · Correo <b>${_v("correo")}</b> · Horario: ${_v("horario")}`;

const LEGAL_PAGINAS = {
  terminos: { ico: "📜", titulo: "Términos y condiciones",
    resumen: ["Armas tu carrito aquí y el pedido se confirma por WhatsApp.", "Los precios están en COP; vale el que te confirmamos.", "Puedes cancelar antes del despacho, y tus derechos como consumidor siguen intactos."],
    secciones: () => [
    ["Quiénes somos y qué aceptas", _p(`Este sitio lo opera ${_titular()}. Al navegar o hacer un pedido aceptas estos términos y nuestra <a href="#/l/privacidad">política de privacidad</a>. Si no estás de acuerdo, mejor no uses el sitio.`, `Para comprar debes ser mayor de edad. Si eres menor de 18 años, haz tus compras con tu mamá, papá o un adulto responsable.`)],
    ["Cómo funciona una compra", _p(`El catálogo es informativo. Eliges tus productos y tallas, armas el carrito y el sitio genera un mensaje para nuestro WhatsApp (${_wa()}). Ahí confirmamos disponibilidad, precio final, envío y forma de pago.`, `Tu pedido es una <b>oferta de compra</b>: la compra queda hecha cuando te la confirmamos por ese canal y se recibe el pago (o se acuerda el pago contra entrega). Hasta entonces podemos no aceptarlo, por ejemplo si el producto se agotó.`)],
    ["Precios y promociones", _p(`Los precios están en pesos colombianos (COP) y pueden cambiar sin aviso previo. El precio que vale es el que te confirmamos al tomar el pedido; antes de que pagues te diremos el total con envío e impuestos, si aplican.`, `Las promociones y liquidaciones tienen sus propias condiciones, que se indican en la oferta. Si en un precio hay un error evidente (por ejemplo, una prenda a $1.000), te avisaremos antes de despachar para que confirmes al precio correcto o canceles con devolución de lo pagado.`)],
    ["Disponibilidad y cancelaciones", _p(`El inventario es limitado y cambia rápido. Si algo se agota después de tu pedido te lo contamos y eliges: cambiarlo por otro, esperar reposición o cancelar con reembolso total.`, `Puedes <b>cancelar sin costo mientras tu pedido no haya sido despachado</b>; escríbenos por WhatsApp lo antes posible. Después del despacho aplican la <a href="#/l/cambios">política de cambios y devoluciones</a> y el derecho de retracto.`)],
    ["Pagos y seguridad", _p(`Medios de pago que manejamos: ${_v("mediosPago")}. Los acordamos contigo por WhatsApp. <b>Este sitio no procesa pagos ni guarda datos de tarjetas.</b>`, `Para prevenir fraudes podemos pedirte verificar tu identidad, o el pago anticipado en pedidos contra entrega de alto valor. Si no se confirma el pago o no se logra verificar la información, podemos no despachar el pedido.`) + _tip(`Paga únicamente a cuentas o enlaces que te envíe nuestro WhatsApp oficial (${_wa()}). Nunca compartas claves, códigos de verificación ni datos de tu banco por chat.`)],
    ["Envíos, cambios y garantía", _p(`Se rigen por la <a href="#/l/envios">política de envíos</a> y la <a href="#/l/cambios">política de cambios, devoluciones y garantía</a>, que hacen parte de estos términos.`)],
    ["Fotos y descripciones", _p(`Hacemos lo posible para mostrar los productos tal como son, pero el color puede verse distinto según tu pantalla y las tallas pueden variar un poco entre referencias. Si tienes dudas, pregúntanos por WhatsApp antes de comprar.`)],
    ["Reseñas y comentarios", _p(`Solo publicamos reseñas de clientes reales y nunca inventamos opiniones. Si nos envías una reseña o comentario, nos autorizas a publicarlo con tu nombre o iniciales. Podemos retirar contenidos ofensivos, ilegales o que no sean verdaderos.`)],
    ["Uso correcto del sitio", _p(`Te pedimos usar el sitio de buena fe. No está permitido intentar entrar a zonas restringidas (como el panel de administración), alterar su funcionamiento, extraer su contenido con bots o programas automáticos, ni dar datos falsos al pedir.`)],
    ["Propiedad intelectual", _p(`El nombre y el logo ${TIENDA.nombre}, el diseño del sitio, los textos y las fotos son de su titular o se usan con autorización. No los copies ni los reutilices sin permiso escrito. Las marcas de terceros pertenecen a sus dueños (ver <a href="#/l/legal">Aviso legal</a>).`)],
    ["Servicios de terceros y enlaces", _p(`El sitio usa o enlaza servicios de terceros como WhatsApp, Instagram, TikTok, Supabase (catálogo) y Google Fonts (tipografías). Cada uno tiene sus propias condiciones y no controlamos su contenido ni su funcionamiento.`)],
    ["Responsabilidad", _p(`Procuramos que la información sea correcta y que el sitio funcione siempre, pero pueden ocurrir errores o interrupciones. No respondemos por fallas de terceros fuera de nuestro control (transportadoras, bancos, internet, fuerza mayor) en la medida que la ley lo permita.`, `Nada de esto limita los derechos que la ley te da como consumidor y que no se pueden renunciar, como el retracto y la garantía.`)],
    ["Cambios en estos términos", _p(`Podemos actualizar estos términos. Vale la versión publicada aquí, con su fecha de actualización, y tus pedidos se rigen por la versión vigente cuando los haces.`)],
    ["Ley aplicable y quejas", _p(`Rigen las leyes de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor). Si algo sale mal, escríbenos primero para resolverlo (<a href="#/l/contacto">Contacto y PQR</a>). También puedes acudir a la ${_sic}.`)]
  ] },

  privacidad: { ico: "🔒", titulo: "Política de privacidad",
    resumen: ["Solo pedimos lo necesario para atender tu pedido.", "No vendemos tus datos.", "Puedes pedir que los veamos, corrijamos o borremos cuando quieras."],
    secciones: () => [
    ["Quién es el responsable", _p(`${_titular()}. Dirección: ${_v("direccion")}. ${_contacto()}.`, `Esta política cumple la Ley 1581 de 2012 (protección de datos personales), el Decreto 1377 de 2013 y las normas que los desarrollan.`)],
    ["Principios que seguimos", _ul(["<b>Finalidad:</b> usamos tus datos solo para lo que te contamos aquí.", "<b>Libertad:</b> los tratamos con tu autorización.", "<b>Veracidad y transparencia:</b> te decimos qué hacemos con ellos y puedes preguntarnos en cualquier momento.", "<b>Seguridad y confidencialidad:</b> solo accede quien lo necesita para atenderte."])],
    ["Qué datos tratamos", _ul([`<b>Los que nos das por WhatsApp</b> al hacer un pedido o consulta: nombre, teléfono, ciudad, dirección de entrega, correo (si nos lo das) y detalles del pedido.`, `<b>Datos técnicos básicos</b> (IP, navegador, fecha y hora de visita) que registran los servicios que hacen funcionar el sitio.`, `<b>Tu carrito</b>, que se guarda solo en tu navegador y no en nuestros servidores.`]) + _p(`No pedimos datos sensibles (salud, origen étnico, orientación sexual, etc.) ni datos de tarjetas. El sitio no está dirigido a menores: si eres menor de 18, pide a un adulto que haga el pedido por ti.`)],
    ["Para qué los usamos", _ul(["Confirmar, cobrar, empacar y enviar tu pedido.", "Atender consultas, cambios, devoluciones, garantías y reclamos.", "Cumplir obligaciones legales, contables y tributarias (por ejemplo, facturación).", "Mejorar el sitio y la atención.", "Escribirte con promociones o novedades <b>solo si lo autorizas</b>; puedes decirnos que pares cuando quieras."])],
    ["Tu autorización", _p(`Al escribirnos por WhatsApp para pedir y darnos tus datos, nos autorizas a tratarlos para esas finalidades. Puedes revocar la autorización o pedir que eliminemos tus datos, salvo que la ley o un contrato nos obliguen a conservarlos.`)],
    ["Con quién compartimos tus datos", _p(`No vendemos tus datos. Solo los compartimos cuando hace falta para prestarte el servicio:`) + _ul([`<b>Transportadoras</b> (${_v("transportadoras")}): nombre, teléfono y dirección para entregarte el pedido.`, `<b>WhatsApp (Meta)</b>: es el canal de mensajería de los pedidos.`, `<b>Supabase</b>: aloja el catálogo de productos y el panel interno de la tienda.`, `<b>Google Fonts</b>: al abrir el sitio tu navegador descarga las tipografías desde Google, que puede registrar tu IP.`, `<b>Autoridades</b>, cuando la ley lo exija.`]) + _p(`Algunos de estos proveedores pueden procesar datos fuera de Colombia (transmisión o transferencia internacional); lo hacemos solo con proveedores que ofrecen medidas de seguridad adecuadas.`)],
    ["Tus derechos como titular", _ul(["Conocer, actualizar y rectificar tus datos.", "Pedir prueba de la autorización que diste.", "Ser informado de cómo hemos usado tus datos.", "Revocar la autorización y pedir la supresión de tus datos.", "Acceder gratis a tus datos personales.", `Presentar quejas ante la ${_sic}.`])],
    ["Cómo ejercer tus derechos", _p(`Escríbenos a ${_v("correo")} o por WhatsApp al ${_wa()} con tu nombre, lo que necesitas y un dato para contactarte. Respondemos las <b>consultas</b> en máximo 10 días hábiles (prorrogables 5 más) y los <b>reclamos</b> en máximo 15 días hábiles (prorrogables 8 más).`)],
    ["Seguridad y por cuánto tiempo los guardamos", _p(`Aplicamos medidas razonables de seguridad; el panel interno requiere usuario y contraseña. Guardamos tus datos el tiempo necesario para cumplir las finalidades y las obligaciones legales, y luego los eliminamos o anonimizamos.`)],
    ["Cookies y almacenamiento local", _p(`El sitio usa el almacenamiento del navegador solo para recordar tu carrito. Hoy no usa cookies de publicidad ni de analítica. Si algún día las agregamos (por ejemplo Meta Pixel o Google Analytics), actualizaremos esta política y te lo avisaremos.`)],
    ["Cambios en esta política", _p(`Podemos actualizar esta política; la versión vigente es la publicada aquí, con su fecha de actualización.`)]
  ] },

  cambios: { ico: "🔁", titulo: "Cambios, devoluciones y garantía",
    resumen: [`Cambios por talla o gusto: hasta ${_v("diasCambio")} días hábiles después de recibir.`, "Si te arrepientes de una compra a distancia tienes 5 días hábiles de retracto.", "Si llega defectuoso o equivocado, lo solucionamos y pagamos nosotros el envío."],
    secciones: () => [
    ["Cambio por talla o gusto", _p(`¿No te quedó o no te convenció? Escríbenos dentro de los <b>${_v("diasCambio")} días hábiles</b> siguientes a la entrega. Aceptamos el cambio si la prenda está sin uso, sin lavar, con etiquetas y en su empaque original, y si hay la talla o referencia que quieres.`, `El envío del cambio por talla o gusto lo paga el cliente.`)],
    ["Derecho de retracto", _p(`Como compras a distancia (WhatsApp y sitio web), puedes retractarte dentro de los <b>5 días hábiles siguientes a la entrega</b> (Estatuto del Consumidor, Ley 1480 de 2011). El producto debe estar sin uso y completo. Te devolvemos el dinero por el mismo medio de pago dentro de los 30 días calendario siguientes y los costos de la devolución los asumes tú.`, `La ley prevé excepciones, por ejemplo productos hechos a la medida o que por su naturaleza no se pueden devolver.`)],
    ["Garantía: producto defectuoso o equivocado", _p(`Si tu pedido llega con defecto de fabricación, dañado o distinto a lo que pediste, tienes derecho a reparación, cambio o devolución del dinero, y el envío corre por nuestra cuenta. Avísanos por WhatsApp con fotos <b>lo antes posible</b>; reportarlo rápido agiliza todo, pero la garantía legal no se pierde por demorarte unos días.`)],
    ["Artículos con reglas especiales", _ul(["<b>Perfumes y artículos de higiene personal:</b> solo tienen cambio si están sellados y sin abrir.", "<b>Ropa interior y trajes de baño:</b> solo con etiquetas y sin usar, por higiene.", "<b>Promociones y liquidación:</b> pueden tener condiciones propias, indicadas en la oferta. No afectan tu derecho de retracto ni la garantía."])],
    ["Cómo pedirlo", _p(`Escríbenos por WhatsApp (${_wa()}) o a ${_v("correo")} con tu nombre, número o fecha del pedido, el producto, el motivo y fotos si aplica. Te respondemos con los pasos a seguir.`)],
    ["Cómo enviarnos el producto", _p(`Te indicaremos cómo devolverlo. Dirección para envíos de cambios y devoluciones: ${_v("direccionCambios")}.`) + _tip(`Guarda el comprobante de envío de tu devolución y empácala bien: es tu prueba de que salió, y nos ayuda a ubicarla si se retrasa.`)],
    ["Cómo se hace el cambio", _p(`Cuando recibamos y revisemos la prenda, te enviamos la nueva talla o referencia (o la reservamos mientras llega). Si prefieres, también podemos hacer el cambio como un pedido nuevo.`)],
    ["Reembolsos", _p(`Cuando corresponda un reembolso, lo hacemos por el mismo medio de pago, o por el que acordemos contigo en compras contra entrega, dentro de los plazos de la ley.`)]
  ] },

  envios: { ico: "🚚", titulo: "Política de envíos",
    resumen: ["Enviamos a todo Colombia.", "Te damos la guía de seguimiento por WhatsApp.", "Revisa tu paquete al recibirlo y avísanos si algo llega mal."],
    secciones: () => [
    ["Dónde enviamos", _p(`${TIENDA.envios} Antes de pagar te confirmamos que podemos llegar a tu ciudad o municipio.`)],
    ["Cuánto demora", _ul([`En nuestra ciudad: ${_v("tiempoLocal")}.`, `En el resto del país: ${_v("tiempoNacional")}.`]) + _p(`Los plazos son estimados, cuentan en días hábiles desde que confirmamos tu pedido y el pago, y pueden cambiar por temporadas altas, festivos, clima u orden público. Transportadoras: ${_v("transportadoras")}.`)],
    ["Cuánto cuesta", _p(`El envío cuesta ${_v("costoEnvio")}.` + (TIENDA.envioGratis ? ` <b>Es gratis en compras superiores a ${cop(TIENDA.envioGratis)}.</b>` : "") + ` Te decimos el valor exacto antes de que pagues.`)],
    ["Tus datos de entrega", _p(`Revisa muy bien nombre, teléfono, dirección y barrio antes de confirmar: si hay un error en los datos que nos das, pueden ocurrir demoras o devoluciones, y el costo de un reenvío podría quedar a tu cargo.`)],
    ["Despacho y seguimiento", _p(`Cuando despachemos tu pedido te mandamos por WhatsApp la guía y la transportadora para que lo sigas en tiempo real. Si la transportadora te contacta, contesta: así se evitan devoluciones.`)],
    ...(TIENDA.pagos.includes("contraentrega") ? [["Pago contra entrega", _p(`Disponible en las ciudades que te confirmemos al tomar el pedido. Pagas al recibir. Si rechazas un pedido contra entrega sin causa justificada, podemos pedirte el pago anticipado en próximas compras.`)]] : []),
    ...(TIENDA.retiro ? [["Retiro en tienda", _p(`Puedes recoger tu pedido en <b>${TIENDA.retiro}</b> (${_v("direccion")}) cuando te avisemos que está listo.`)]] : []),
    ["Cuando llegue tu paquete", _p(`Revisa que llegue sellado y sin daños. Si ves algo raro, avísanos el mismo día con fotos para reclamar a la transportadora. Si un paquete se pierde en tránsito, nosotros hacemos el reclamo y te damos una solución.`)]
  ] },

  legal: { ico: "⚖️", titulo: "Aviso legal",
    resumen: ["Quién está detrás de la tienda y cómo contactarnos.", "Qué es nuestro (nombre, logo, diseño) y qué es de terceros.", "Lo que ves en la tienda es lo que es: información veraz sobre cada producto."],
    secciones: () => [
    ["Titular del sitio", _p(`${_titular()}. Dirección: ${_v("direccion")}. ${_contacto()}.`, `Con esta información cumplimos el deber de identificarnos ante quienes compran por internet, según el Estatuto del Consumidor.`)],
    ["Para qué sirve este sitio", _p(`Presenta el catálogo de ${TIENDA.nombre} y te permite preparar pedidos que se confirman por WhatsApp. Los mensajes y confirmaciones intercambiados por ese medio tienen validez como mensajes de datos (Ley 527 de 1999).`)],
    ["Lo que es nuestro", _p(`El nombre y logo ${TIENDA.nombre}, el diseño del sitio, los textos y las fotografías pertenecen a su titular o se usan con autorización. No se pueden copiar, modificar ni distribuir sin permiso escrito. No damos licencias implícitas sobre ellos.`)],
    ["Marcas de terceros", _p(`Los nombres y marcas de otras empresas que aparezcan son de sus dueños y se muestran solo para identificar los productos. No significan que seamos afiliados ni patrocinados por ellas, salvo que se diga expresamente.`)],
    ["Información veraz de los productos", _p(`Cada producto se presenta según su naturaleza real (por ejemplo original, importado u otra), con la información clara que exige el Estatuto del Consumidor. Si ves un dato inexacto, escríbenos y lo corregimos.`)],
    ["Responsabilidad", _p(`No garantizamos que el sitio esté siempre libre de errores o interrupciones, ni somos responsables por contenidos de sitios de terceros enlazados. Esto no limita tus derechos irrenunciables como consumidor.`)],
    ["Menores de edad", _p(`El sitio está pensado para mayores de edad. Si eres madre, padre o tutor de un menor que compra o navega, te recomendamos acompañarlo.`)],
    ["Ley aplicable", _p(`Rigen las leyes de la República de Colombia. En temas de consumo y de protección de datos la autoridad es la ${_sic}.`)]
  ] },

  contacto: { ico: "💬", titulo: "Contacto y PQR",
    resumen: ["Escríbenos por WhatsApp: es lo más rápido.", `Respondemos tus peticiones, quejas y reclamos en máximo ${_v("diasRespuesta")} días hábiles.`, "Si no quedas conforme, puedes acudir a la SIC."],
    secciones: () => [
    ["Cómo contactarnos", _p(_contacto()) + _p(`Instagram: <a href="${TIENDA.instagram}" target="_blank" rel="noopener">${TIENDA.instagram.replace("https://www.", "")}</a> · TikTok: <a href="${TIENDA.tiktok}" target="_blank" rel="noopener">${TIENDA.tiktok.replace("https://www.", "")}</a>`)],
    ["Peticiones, quejas y reclamos (PQR)", _p(`Puedes radicar una petición, queja, reclamo o sugerencia por WhatsApp o correo. Cuéntanos tu nombre, un dato de contacto, el número o fecha de tu pedido y qué pasó. Te confirmamos que lo recibimos y respondemos en máximo <b>${_v("diasRespuesta")} días hábiles</b>.`)],
    ["Si no quedas conforme", _p(`Puedes acudir a la ${_sic}, que es la autoridad de protección al consumidor y de datos personales.`)],
    ["Documentos de la tienda", _p("Todo lo que necesitas saber, en un solo lugar:") + _ul(Object.entries(LEGAL_PAGINAS).filter(([k]) => k !== "contacto").map(([k, d]) => `<a href="#/l/${k}">${d.titulo}</a>`))]
  ] }
};

/* DESPLEGABLES de la página de producto (Medios de pago, Tiempos de entrega, etc.).
   Toman sus datos de LEGAL y TIENDA, así que no tienes que escribirlos dos veces. Edita el texto si quieres. */
function ACORDEONES() {
  const gratis = TIENDA.envioGratis ? ` Envío gratis en compras superiores a ${cop(TIENDA.envioGratis)}.` : "";
  return [
    ["Medios de pago", `Manejamos: ${_v("mediosPago")}. Coordinamos el pago contigo por WhatsApp al confirmar tu pedido, y nunca te pediremos claves ni códigos de verificación. Más detalles en los <a href="#/l/terminos">términos y condiciones</a>.`],
    ["Tiempos de entrega", `En nuestra ciudad: ${_v("tiempoLocal")}. Resto del país: ${_v("tiempoNacional")}.${gratis} Todo sobre envíos en la <a href="#/l/envios">política de envíos</a>.`],
    ["Cambios y devoluciones", `Cambios por talla o gusto hasta ${_v("diasCambio")} días hábiles después de recibir, y 5 días hábiles de retracto en compras a distancia. Si llega defectuoso o equivocado, lo solucionamos. Léelo completo en <a href="#/l/cambios">cambios, devoluciones y garantía</a>.`],
    ["Guía de tallas", `¿Dudas con tu talla? Escríbenos por WhatsApp con tu estatura y peso y te recomendamos la ideal antes de que compres.`]
  ];
}
