/* CARGA LOS PRODUCTOS desde la base de datos (si está configurada) y luego arranca la página */
(async () => {
  // Banners guardados desde el panel (si la tabla no existe o está vacía, se usan los de js/datos/banners.js)
  const _hdr = { apikey: SUPABASE.key, Authorization: "Bearer " + SUPABASE.key };
  const banPromesa = SUPABASE.url && SUPABASE.key
    ? fetch(`${SUPABASE.url}/rest/v1/banners?select=*&activo=eq.true&order=orden.asc,id.asc`, { headers: _hdr }).then(r => r.ok ? r.json() : []).catch(() => [])
    : Promise.resolve([]);
  if (SUPABASE.url && SUPABASE.key) {
    try {
      const r = await fetch(`${SUPABASE.url}/rest/v1/productos?select=*&activo=eq.true&order=orden.asc,id.asc`, { headers: { apikey: SUPABASE.key, Authorization: "Bearer " + SUPABASE.key } });
      if (!r.ok) throw new Error(r.status);
      const filas = await r.json();
      Object.keys(PRODUCTOS).forEach(g => PRODUCTOS[g] = []);
      filas.forEach(f => PRODUCTOS[f.grupo] && PRODUCTOS[f.grupo].push({
        id: f.id, stock: f.stock || null, nombre: f.nombre, marca: f.marca || "", cat: canonCat(f.grupo, f.cat), precio: f.precio, antes: Number(f.precio_antes) || 0,
        img: (f.imgs && f.imgs[0]) || "", imgs: f.imgs || [], tallas: f.tallas || [], agotadas: f.agotadas || []
      }));
    } catch (e) { console.warn("No se pudo leer la base de datos; se usan los productos locales.", e); }
  }
  try {
    const filas = await banPromesa, t = x => String(x == null ? "" : x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const ok = filas.filter(b => b && b.img);
    if (ok.length) BANNERS.splice(0, BANNERS.length, ...ok.map(b => ({
      img: String(b.img).replace(/['"()\s]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")),
      pos: /^[\w% .-]{1,40}$/.test(b.pos || "") ? b.pos : "center",
      titulo: t(b.titulo), texto: t(b.texto), boton: t(b.boton), href: /^(#|https:\/\/)/.test(b.href || "") ? b.href : "#inicio"
    })));
  } catch (e) { console.warn("No se pudieron leer los banners; se usan los locales.", e); }
  for (const s of ["util", "cabecera", "sedes", "rutas", "inicio", "catalogo", "producto", "legal", "carrito", "checkout", "anuncios", "cargando", "app"])
    await new Promise(ok => { const e = document.createElement("script"); e.src = `js/${s}.js`; e.async = false; e.onload = e.onerror = ok; document.body.appendChild(e); });
})();
