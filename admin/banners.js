/* BANNERS DEL INICIO: lista, crear, editar, ordenar, ocultar y borrar desde el panel.
   Usa api(), toast(), esc(), borrarFotos() y TIENDA de admin.js. Se guardan en la tabla "banners" (sql/banners.sql). */
let bans = [], bf = null;
const bUrl = u => /^(https?:)?\/\//.test(u || "") ? u : "../" + (u || "");
const bClamp = n => Math.min(100, Math.max(0, n));

// Lugares a los que puede llevar el botón del banner
const DESTINOS = (() => {
  const l = [], tt = s => s.charAt(0) + s.slice(1).toLowerCase();
  MENU.forEach(m => m.sub.forEach(s => l.push([`${tt(m.t)} · ${s.t}`, s.href])));
  l.push(["Política de envíos", "#/l/envios"], ["Cambios y devoluciones", "#/l/cambios"], ["WhatsApp de la tienda", "https://wa.me/" + TIENDA.whatsapp]);
  if (TIENDA.instagram) l.push(["Instagram", TIENDA.instagram]);
  return l;
})();
$("#bDest").innerHTML = DESTINOS.map(([t, h]) => `<option value="${esc(h)}">${esc(t)}</option>`).join("") + `<option value="__otro">Otro enlace…</option>`;
const destinoTxt = h => !h ? "Sin botón" : (DESTINOS.find(d => d[1] === h) || [h])[0];

// "center top", "20% 40%"… -> [x, y] en porcentaje
function leerPos(p) {
  const m = { left: 0, top: 0, center: 50, right: 100, bottom: 100 }, t = String(p || "").trim().split(/\s+/);
  const n = x => x in m ? m[x] : /^\d+(\.\d+)?%$/.test(x) ? parseFloat(x) : 50;
  return [bClamp(n(t[0] || "center")), bClamp(n(t[1] || t[0] || "center"))];
}

// ---------- pestaña ----------
document.querySelector(".tabs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $("#vBan").hidden = b.dataset.v !== "vBan";
  if (b.dataset.v === "vBan") cargarBan();
});
async function cargarBan() {
  try { bans = await api("/rest/v1/banners?select=*&order=orden.asc,id.asc"); pintarBan(); }
  catch (x) {
    bans = []; $("#bLista").innerHTML = `<p class="err">No se pudieron leer los banners: ${esc(x.message)}.<br><span class="mut">Si dice que no encuentra la tabla “banners”, falta ejecutar <b>sql/banners.sql</b> en Supabase (SQL Editor).</span></p>`; $("#bCuenta").textContent = "";
  }
}
function pintarBan() {
  $("#bCuenta").textContent = `${bans.length} banner${bans.length === 1 ? "" : "s"}`;
  $("#bLista").innerHTML = bans.length ? bans.map((b, i) => {
    const [x, y] = leerPos(b.pos);
    return `<div class="bi ${b.activo ? "" : "off"}" data-id="${b.id}">
    <div class="th" style="background-image:url('${esc(bUrl(b.img))}');background-position:${x}% ${y}%"></div>
    <div><h3>${esc(b.titulo) || "<i>(sin título)</i>"}</h3><div class="m">${esc(b.texto)}</div>
      <div class="m">Botón: ${b.boton ? `“${esc(b.boton)}” → ${esc(destinoTxt(b.href))}` : "sin botón"}${b.activo ? "" : " · <b>OCULTO</b>"}</div></div>
    <div class="acc"><button class="b mv" data-a="up" title="Subir" ${i ? "" : "disabled"}>↑</button><button class="b mv" data-a="dn" title="Bajar" ${i < bans.length - 1 ? "" : "disabled"}>↓</button>
      <button class="b" data-a="ed">Editar</button><button class="b" data-a="tog">${b.activo ? "Ocultar" : "Mostrar"}</button><button class="b del" data-a="del">Eliminar</button></div></div>`;
  }).join("") : `<p class="mut">Aún no hay banners guardados aquí, así que la tienda muestra los que vienen en el código.<br><button class="b" id="bImp" type="button" style="margin-top:10px">Importar los banners actuales</button> <span class="mut">(los copia aquí para poder editarlos)</span></p>`;
}
$("#bLista").onclick = async e => {
  if (e.target.id === "bImp") return importarBan(e.target);
  const a = e.target.dataset.a, id = e.target.closest(".bi")?.dataset.id; if (!a) return;
  const i = bans.findIndex(x => x.id == id), b = bans[i]; if (!b) return;
  try {
    if (a === "ed") return abrirBan(b);
    if (a === "tog") { await api(`/rest/v1/banners?id=eq.${b.id}`, { method: "PATCH", json: { activo: !b.activo } }); await cargarBan(); return toast(b.activo ? "Banner oculto" : "Banner visible"); }
    if (a === "up" || a === "dn") {
      const j = a === "up" ? i - 1 : i + 1; if (j < 0 || j >= bans.length) return;
      [bans[i], bans[j]] = [bans[j], bans[i]];
      await Promise.all(bans.map((x, k) => api(`/rest/v1/banners?id=eq.${x.id}`, { method: "PATCH", json: { orden: k } })));
      await cargarBan(); return;
    }
    if (a === "del" && confirm(`¿Eliminar el banner “${b.titulo || "sin título"}”? No se puede deshacer.`)) {
      await api(`/rest/v1/banners?id=eq.${b.id}`, { method: "DELETE" }); await borrarFotos([b.img]); await cargarBan(); toast("Banner eliminado");
    }
  } catch (x) { toast(x.message, true); cargarBan(); }
};
async function importarBan(btn) {
  if (typeof BANNERS === "undefined" || !BANNERS.length) return toast("No hay banners para importar", true);
  btn.disabled = true;
  try { await api("/rest/v1/banners", { method: "POST", json: BANNERS.map((b, k) => ({ img: b.img, pos: b.pos || "center center", titulo: b.titulo || "", texto: b.texto || "", boton: b.boton || "", href: b.href || "", orden: k, activo: true })) }); await cargarBan(); toast("Banners importados"); }
  catch (x) { toast("No se pudo importar: " + x.message, true); btn.disabled = false; }
}

// ---------- formulario ----------
function abrirBan(b) {
  const [px, py] = leerPos(b?.pos), dest = b ? b.href : DESTINOS[0][1], enLista = DESTINOS.some(d => d[1] === dest) || !dest;
  bf = { id: b?.id || null, img: b?.img || "", original: b?.img || "", nueva: "", px, py, iw: 0, ih: 0, drag: null, subiendo: false };
  $("#bTit").textContent = b ? "Editar banner" : "Nuevo banner";
  $("#bTitulo").value = b?.titulo || ""; $("#bTexto").value = b?.texto || ""; $("#bBoton").value = b ? b.boton : "Explorar";
  $("#bDest").value = !b ? DESTINOS[0][1] : !dest ? DESTINOS[0][1] : enLista ? dest : "__otro"; $("#bOtro").value = enLista ? "" : dest;
  $("#bOtroL").hidden = $("#bDest").value !== "__otro";
  $("#bActivo").checked = b ? b.activo : true; $("#bErr").textContent = ""; $("#bGuardar").disabled = false;
  vistaBan("pc"); cargarDim(); pintarPrev(); $("#mBan").hidden = false;
}
function cargarDim() {
  $("#bEnc").hidden = !bf.img; $("#bDropT").innerHTML = bf.img ? "Cambiar foto: arrastra otra aquí o <u>elígela</u>" : "Arrastra la foto aquí o <u>elígela</u>";
  if (!bf.img) return;
  const im = new Image(), mio = bf; im.onload = () => { if (bf !== mio) return; bf.iw = im.naturalWidth; bf.ih = im.naturalHeight; pintarPrev(); }; im.src = bUrl(bf.img); pintarPrev();
}
function pintarPrev() {
  if (!bf) return;
  const f = $("#bPrev .bfondo"); f.style.backgroundImage = bf.img ? `url('${bUrl(bf.img)}')` : "none"; f.style.backgroundPosition = `${bf.px}% ${bf.py}%`;
  $("#bpT").textContent = $("#bTitulo").value; $("#bpX").textContent = $("#bTexto").value;
  $("#bpB").textContent = $("#bBoton").value; $("#bpB").hidden = !$("#bBoton").value.trim();
}
function vistaBan(v) { $("#bPrev").className = "bprev " + v; document.querySelectorAll(".bvt button").forEach(x => x.classList.toggle("on", x.dataset.v === v)); }
document.querySelector(".bvt").onclick = e => { const v = e.target.dataset.v; if (v) vistaBan(v); };
["#bTitulo", "#bTexto", "#bBoton"].forEach(s => $(s).addEventListener("input", pintarPrev));
$("#bDest").onchange = () => { $("#bOtroL").hidden = $("#bDest").value !== "__otro"; };

// Arrastrar la foto dentro de la vista previa = mover el encuadre (igual que lo hace la tienda)
const pv = $("#bPrev");
pv.onpointerdown = e => { if (!bf || !bf.img) return; pv.setPointerCapture(e.pointerId); bf.drag = { x: e.clientX, y: e.clientY, px: bf.px, py: bf.py }; };
pv.onpointermove = e => {
  const d = bf && bf.drag; if (!d || !bf.iw) return;
  const r = pv.getBoundingClientRect(), k = Math.max(r.width / bf.iw, r.height / bf.ih), ow = bf.iw * k - r.width, oh = bf.ih * k - r.height;
  if (ow > 1) bf.px = Math.round(bClamp(d.px - (e.clientX - d.x) / ow * 100));
  if (oh > 1) bf.py = Math.round(bClamp(d.py - (e.clientY - d.y) / oh * 100));
  pintarPrev();
};
pv.onpointerup = pv.onpointercancel = () => { if (bf) bf.drag = null; };

// ---------- foto (se reduce en el navegador y se sube al mismo almacenamiento de las fotos de productos) ----------
async function reducirBan(file) {
  const bmp = await createImageBitmap(file), k = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  let b = await new Promise(r => c.toBlob(r, "image/webp", .85)), ext = "webp";
  if (!b || b.type !== "image/webp") { b = await new Promise(r => c.toBlob(r, "image/jpeg", .86)); ext = "jpg"; }
  return { b, ext };
}
async function subirBan(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return toast(`“${file.name}” no es una imagen`, true);
  const mio = bf; mio.subiendo = true; $("#bGuardar").disabled = true; $("#bDrop").classList.add("sub");
  try {
    const { b, ext } = await reducirBan(file), path = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await api(`/storage/v1/object/fotos/${path}`, { method: "POST", body: b, headers: { "Content-Type": b.type, "x-upsert": "false" } });
    const url = `${U}/storage/v1/object/public/fotos/${path}`;
    if (bf !== mio) return borrarFotos([url]);
    if (mio.nueva) await borrarFotos([mio.nueva]);
    mio.nueva = url; mio.img = url; mio.px = 50; mio.py = 50; mio.iw = 0; mio.ih = 0; cargarDim();
  } catch (x) { toast("No se pudo subir la foto: " + x.message, true); }
  mio.subiendo = false; $("#bDrop").classList.remove("sub"); if (bf === mio) $("#bGuardar").disabled = false;
}
$("#bFoto").onchange = e => { subirBan(e.target.files[0]); e.target.value = ""; };
const bDrop = $("#bDrop");
["dragover", "dragenter"].forEach(n => bDrop.addEventListener(n, e => { e.preventDefault(); bDrop.classList.add("over"); }));
["dragleave", "drop"].forEach(n => bDrop.addEventListener(n, e => { e.preventDefault(); bDrop.classList.remove("over"); }));
bDrop.addEventListener("drop", e => subirBan(e.dataTransfer.files[0]));

// ---------- guardar / cancelar ----------
async function cerrarBan(descartar) {
  const mio = bf; $("#mBan").hidden = true; bf = null;
  if (descartar && mio && mio.nueva) await borrarFotos([mio.nueva]);
}
$("#bCan").onclick = () => cerrarBan(true); $("#bX").onclick = () => cerrarBan(true);
$("#fBan").onsubmit = async e => {
  e.preventDefault(); $("#bErr").textContent = "";
  if (bf.subiendo) return $("#bErr").textContent = "Espera a que termine de subir la foto.";
  if (!bf.img) return $("#bErr").textContent = "Elige una foto para el banner.";
  const boton = $("#bBoton").value.trim();
  let href = $("#bDest").value === "__otro" ? $("#bOtro").value.trim() : $("#bDest").value;
  if (boton && !href) return $("#bErr").textContent = "Escribe a dónde lleva el botón.";
  if (href && !/^(#|https:\/\/)/.test(href)) return $("#bErr").textContent = "El enlace debe empezar con # o con https://";
  if (!boton) href = "";
  const d = { img: bf.img, pos: `${bf.px}% ${bf.py}%`, titulo: $("#bTitulo").value.trim(), texto: $("#bTexto").value.trim(), boton, href, activo: $("#bActivo").checked };
  $("#bGuardar").disabled = true;
  try {
    if (bf.id) await api(`/rest/v1/banners?id=eq.${bf.id}`, { method: "PATCH", json: d });
    else await api("/rest/v1/banners", { method: "POST", json: { ...d, orden: bans.reduce((m, x) => Math.max(m, x.orden), -1) + 1 } });
    if (bf.original && bf.original !== bf.img) await borrarFotos([bf.original]);
    bf.nueva = ""; await cargarBan(); cerrarBan(false); toast("Banner guardado");
  } catch (x) { $("#bErr").textContent = "No se pudo guardar: " + x.message; $("#bGuardar").disabled = false; }
};
$("#bNuevoBan").onclick = () => abrirBan(null);
