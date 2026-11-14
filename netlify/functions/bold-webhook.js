// Bold avisa aquí cada vez que hay una venta aprobada/rechazada o una anulación. Se verifica la firma antes de hacer nada.
const { json, sb, enc, firmaValida, sincronizar } = require("./_lib");

exports.handler = async event => {
  if (event.httpMethod !== "POST") return json(405, { error: "Método no permitido" });
  const crudo = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : (event.body || "");
  const firma = String((event.headers || {})["x-bold-signature"] || "").toLowerCase();
  if (!firmaValida(crudo, firma)) { console.warn("Webhook con firma inválida"); return json(401, { error: "Firma inválida" }); }

  let ev;
  try { ev = JSON.parse(crudo); } catch (e) { return json(400, { error: "JSON inválido" }); }
  try {
    const d = ev.data || {}, pagoId = String(d.payment_id || ev.subject || "");
    const ref = d.metadata && d.metadata.reference;

    if (ev.type === "VOID_APPROVED") {                        // anulación: se devuelve el stock
      if (pagoId) {
        const peds = await sb(`pedidos?select=id,estado&bold_tx=eq.${enc(pagoId)}`);
        for (const p of peds) if (["pagado", "enviado", "revisar"].includes(p.estado))
          await sb("rpc/devolver_stock_pedido", { method: "POST", body: { p_pedido: p.id } });
      }
      return json(200, { ok: true });
    }

    if (ev.type === "SALE_APPROVED" || ev.type === "SALE_REJECTED") {
      let candidatos = [];
      if (ref) candidatos = await sb(`pedidos?select=id,ref,estado,total&ref=eq.${enc(ref)}`);
      if (!candidatos.length) {                               // sin referencia: pedidos pendientes recientes con el mismo valor
        const desde = new Date(Date.now() - 26 * 3600 * 1000).toISOString();
        const total = Number(d.amount && d.amount.total) || 0;
        candidatos = await sb(`pedidos?select=id,ref,estado,total&estado=in.(pendiente,fallido)&total=eq.${total}&creado=gte.${enc(desde)}&order=creado.desc&limit=5`);
      }
      for (const p of candidatos) await sincronizar(p);       // Bold confirma el estado real, no confiamos solo en el aviso
    }
    return json(200, { ok: true });
  } catch (e) {
    console.error("bold-webhook:", e);
    return json(500, { error: "Error interno" });
  }
};
