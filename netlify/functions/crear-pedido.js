// Crea el pedido (con precios y stock REALES de la base de datos) y devuelve lo que necesita el botón de Bold.
const crypto = require("crypto");
const { env, json, origen, sb, tienda, costoEnvio, hashIntegridad } = require("./_lib");

const DIVISA = "COP";
const limpiar = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n);

exports.handler = async event => {
  if (event.httpMethod !== "POST") return json(405, { error: "Método no permitido" });
  try {
    const T = await tienda();
    let d;
    try { d = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Datos inválidos." }); }

    // 1) Datos del cliente
    const c = {
      nombre: limpiar(d.nombre, 80), cedula: String(d.cedula || "").replace(/\D/g, "").slice(0, 15),
      telefono: String(d.telefono || "").replace(/\D/g, "").slice(0, 15), correo: limpiar(d.correo, 120).toLowerCase(),
      departamento: limpiar(d.departamento, 40), ciudad: limpiar(d.ciudad, 60), direccion: limpiar(d.direccion, 160), notas: limpiar(d.notas, 300)
    };
    if (c.nombre.length < 3) return json(400, { error: "Escribe tu nombre completo." });
    if (c.cedula.length < 5) return json(400, { error: "Escribe tu número de cédula (solo números)." });
    if (c.telefono.length < 7) return json(400, { error: "Escribe un teléfono válido." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo)) return json(400, { error: "Escribe un correo válido." });
    const deps = Object.keys(T.envioPorDepartamento || {});
    if (deps.length && !deps.includes(c.departamento)) return json(400, { error: "Escoge tu departamento de la lista." });
    if (c.ciudad.length < 2) return json(400, { error: "Escribe tu ciudad." });
    if (c.direccion.length < 5) return json(400, { error: "Escribe tu dirección completa." });
    if (d.acepto !== true) return json(400, { error: "Debes aceptar la política de datos y los términos para continuar." });

    // 2) Productos del carrito (se juntan los repetidos)
    const crudos = Array.isArray(d.items) ? d.items : [];
    if (!crudos.length || crudos.length > 30) return json(400, { error: "Tu carrito está vacío o es demasiado grande." });
    const juntos = new Map();
    for (const it of crudos) {
      const id = Number(it.id), cant = Math.floor(Number(it.cant)), talla = limpiar(it.talla, 20);
      if (!Number.isInteger(id) || id < 1 || !talla || !(cant >= 1 && cant <= 20))
        return json(400, { error: "Tu carrito tiene productos inválidos. Vacíalo y vuelve a agregarlos." });
      const k = id + "|" + talla, a = juntos.get(k);
      a ? (a.cant += cant) : juntos.set(k, { id, talla, cant });
    }
    const lista = [...juntos.values()];
    const ids = [...new Set(lista.map(x => x.id))];
    const prods = await sb(`productos?select=id,nombre,precio,tallas,stock,imgs,activo&id=in.(${ids.join(",")})`);
    const porId = new Map(prods.map(p => [p.id, p]));

    // 3) Validar con los datos reales (nunca con lo que mande el navegador)
    const lineas = [];
    for (const x of lista) {
      const p = porId.get(x.id);
      if (!p || !p.activo) return json(409, { error: "Un producto de tu carrito ya no está disponible. Quítalo e intenta de nuevo." });
      if (!(p.tallas || []).includes(x.talla)) return json(409, { error: `La talla ${x.talla} de "${p.nombre}" ya no existe.` });
      const disp = Number((p.stock || {})[x.talla] || 0);
      if (disp < x.cant) return json(409, { error: disp > 0 ? `De "${p.nombre}" talla ${x.talla} solo quedan ${disp} unidad(es).` : `"${p.nombre}" talla ${x.talla} se agotó.` });
      lineas.push({ id: p.id, nombre: p.nombre, talla: x.talla, cant: x.cant, precio: Number(p.precio), img: (p.imgs || [])[0] || "" });
    }

    const subtotal = lineas.reduce((a, l) => a + l.precio * l.cant, 0);
    const envio = costoEnvio(T, subtotal, c.departamento, c.ciudad);
    const total = subtotal + envio;
    if (total < 1000) return json(400, { error: "El valor mínimo de compra es $1.000." });

    // 4) Guardar el pedido como "pendiente"
    const ref = `EC-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const filas = await sb("pedidos", { method: "POST", prefer: "return=representation",
      body: { ref, nombre: c.nombre, cedula: c.cedula, telefono: c.telefono, correo: c.correo, departamento: c.departamento, ciudad: c.ciudad, direccion: c.direccion, notas: c.notas, subtotal, envio, total } });
    const ped = filas[0];
    try {
      await sb("pedido_items", { method: "POST", prefer: "return=minimal",
        body: lineas.map(l => ({ pedido_id: ped.id, producto_id: l.id, nombre: l.nombre, talla: l.talla, cantidad: l.cant, precio: l.precio, img: l.img })) });
    } catch (e) {
      await sb(`pedidos?id=eq.${ped.id}`, { method: "DELETE" }).catch(() => {});
      throw e;
    }

    // 5) Datos para el botón de Bold (la firma se calcula aquí, con la llave secreta)
    return json(200, {
      ref, subtotal, envio, total, divisa: DIVISA, hash: hashIntegridad(ref, total, DIVISA), apiKey: env("BOLD_API_KEY"),
      descripcion: `Pedido ${ref} - ${T.nombre}`.slice(0, 100), redirigir: origen() + "/pedido.html", volver: origen() + "/",
      cliente: { email: c.correo, fullName: c.nombre, phone: c.telefono, dialCode: "+57", documentNumber: c.cedula, documentType: "CC" },
      direccion: { address: c.direccion, city: c.ciudad, state: c.departamento, country: "CO" }
    });
  } catch (e) {
    console.error("crear-pedido:", e);
    return json(500, { error: "No pudimos crear tu pedido. Intenta de nuevo en un momento o escríbenos por WhatsApp." });
  }
};
