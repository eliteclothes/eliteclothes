// La página "pedido.html" pregunta aquí cómo va el pago. Si sigue pendiente, se consulta a Bold directamente.
const { json, sb, enc, sincronizar } = require("./_lib");

exports.handler = async event => {
  const ref = String((event.queryStringParameters || {}).ref || "").trim();
  if (!/^[A-Za-z0-9_-]{6,60}$/.test(ref)) return json(400, { error: "Referencia inválida" });
  try {
    const filas = await sb(`pedidos?select=id,ref,estado,total&ref=eq.${enc(ref)}`);
    if (!filas.length) return json(404, { error: "Pedido no encontrado" });
    const ped = filas[0];
    let estado = ped.estado;
    if (estado === "pendiente" || estado === "fallido") {
      try { estado = await sincronizar(ped); } catch (e) { console.error("sincronizar:", e); }
    }
    return json(200, { ref: ped.ref, estado, total: ped.total });
  } catch (e) {
    console.error("estado-pedido:", e);
    return json(500, { error: "No se pudo consultar el pedido" });
  }
};
