/* CARRITO (se guarda en el navegador) y botón "Finalizar compra" (ver checkout.js) */
const aviso = m => alert(m);

// Agrega un producto. Devuelve true si quedó en el carrito (false si no hay unidades).
function agregar(p, talla, i, g, silencioso) {
  const max = p.stock ? Number(p.stock[talla] || 0) : null;          // unidades disponibles (null = sin control de stock)
  if (max !== null && max < 1) { aviso("Esta talla está agotada."); return false; }
  const f = carrito.find(c => c.nombre === p.nombre && c.talla === talla);
  if (f) {
    f.id = p.id; f.max = max; f.g = g; f.i = i;
    if (max !== null && f.cant >= max) { if (!silencioso) aviso(`Solo hay ${max} unidad(es) disponibles de esta talla.`); }
    else f.cant++;
  } else carrito.push({ id: p.id, nombre: p.nombre, talla, precio: p.precio, cant: 1, max, g, i, img: p.img || muestra(p.nombre, i) });
  dibujar();
  if (!silencioso) panel($("#carrito"), true);
  return true;
}

function dibujar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  $("#cuenta").textContent = carrito.reduce((a, c) => a + c.cant, 0);
  $("#items").innerHTML = carrito.length ? carrito.map((c, i) => `<div class="fila"><img src="${c.img}" alt=""><div>${c.nombre}<br>Talla ${c.talla} · ${cop(c.precio)}</div><button class="ic" data-m="${i}">−</button>${c.cant}<button class="ic" data-p="${i}">+</button></div>`).join("") : "<p>Tu carrito está vacío.</p>";
  const total = carrito.reduce((a, c) => a + c.precio * c.cant, 0), meta = TIENDA.envioGratis;
  $("#total").textContent = cop(total);
  $("#envnota").innerHTML = !meta || !carrito.length ? "" : total > meta ? "🎉 <b>¡Tu pedido tiene envío gratis!</b>" : `Envío gratis en compras superiores a <b>${cop(meta)}</b>`;
  $("#pedir").style.display = carrito.length ? "" : "none";
}

$("#items").onclick = e => {
  const m = e.target.dataset.m, p = e.target.dataset.p;
  if (m != null && --carrito[m].cant <= 0) carrito.splice(m, 1);
  if (p != null) { const c = carrito[p]; c.max != null && c.cant >= c.max ? aviso(`Solo hay ${c.max} unidad(es) disponibles de esta talla.`) : c.cant++; }
  dibujar();
};
$("#pedir").onclick = () => abrirCheckout();
dibujar();
$("#pagosCarrito").innerHTML = "Medios de pago<br>" + TIENDA.pagos.map(pagoIcono).join("");
