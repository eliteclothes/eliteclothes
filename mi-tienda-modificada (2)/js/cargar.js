/* CARGA LOS PRODUCTOS desde la base de datos (si está configurada) y luego arranca la página */
(async () => {
  if (SUPABASE.url && SUPABASE.key) {
    try {
      const r = await fetch(`${SUPABASE.url}/rest/v1/productos?select=*&activo=eq.true&order=orden.asc,id.asc`, { headers: { apikey: SUPABASE.key, Authorization: "Bearer " + SUPABASE.key } });
      if (!r.ok) throw new Error(r.status);
      const filas = await r.json();
      Object.keys(PRODUCTOS).forEach(g => PRODUCTOS[g] = []);
      filas.forEach(f => PRODUCTOS[f.grupo] && PRODUCTOS[f.grupo].push({
        nombre: f.nombre, marca: f.marca || "", cat: f.cat, precio: f.precio,
        img: (f.imgs && f.imgs[0]) || "", imgs: f.imgs || [], tallas: f.tallas || [], agotadas: f.agotadas || []
      }));
    } catch (e) { console.warn("No se pudo leer la base de datos; se usan los productos locales.", e); }
  }
  for (const s of ["util", "cabecera", "rutas", "inicio", "catalogo", "producto", "carrito", "app"])
    await new Promise(ok => { const e = document.createElement("script"); e.src = `js/${s}.js`; e.async = false; e.onload = e.onerror = ok; document.body.appendChild(e); });
})();
