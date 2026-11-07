/* CARRITO y pedido por WhatsApp */
// ---------- Carrito (se guarda en el navegador) y pedido por WhatsApp ----------
function agregar(p, talla, i, g) {
  const f = carrito.find(c => c.nombre === p.nombre && c.talla === talla);
  f ? f.cant++ : carrito.push({ nombre: p.nombre, talla, precio: p.precio, cant: 1, img: p.img || muestra(p.nombre, i), g, i });
  dibujar(); panel($("#carrito"), true);
}
function dibujar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  $("#cuenta").textContent = carrito.reduce((a, c) => a + c.cant, 0);
  $("#items").innerHTML = carrito.length ? carrito.map((c, i) => `<div class="fila"><img src="${c.img}" alt=""><div>${c.nombre}<br>Talla ${c.talla} · ${cop(c.precio)}</div><button class="ic" data-m="${i}">−</button>${c.cant}<button class="ic" data-p="${i}">+</button></div>`).join("") : "<p>Tu carrito está vacío.</p>";
  const total = carrito.reduce((a, c) => a + c.precio * c.cant, 0);
  $("#total").textContent = cop(total);
  const lineas = carrito.map(c => {
    const foto = urlImg(c.img), ver = c.g ? urlProducto(c.g, c.i) : "";
    return `• ${c.cant} x ${c.nombre} (talla ${c.talla}) - ${cop(c.precio)}` + (foto ? `\n  Foto: ${foto}` : "") + (ver ? `\n  Ver producto: ${ver}` : "");
  });
  const msg = `Hola ${TIENDA.nombre}, quiero pedir:\n\n` + lineas.join("\n\n") + `\n\nTotal: ${cop(total)}`;
  const meta = TIENDA.envioGratis;
  $("#envnota").innerHTML = !meta || !carrito.length ? "" : total >= meta ? "🎉 <b>¡Tu pedido tiene envío gratis!</b>" : `Te faltan <b>${cop(meta - total)}</b> para envío gratis`;
  $("#pedir").href = `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(msg)}`;
  $("#pedir").style.display = carrito.length ? "" : "none";
}
$("#items").onclick = e => {
  const m = e.target.dataset.m, p = e.target.dataset.p;
  if (m != null && --carrito[m].cant <= 0) carrito.splice(m, 1);
  if (p != null) carrito[p].cant++;
  dibujar();
};
dibujar();
