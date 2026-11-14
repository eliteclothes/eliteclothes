/* PANEL DE ADMINISTRACIÓN: login, lista de productos, formulario, fotos. Habla con Supabase por HTTP. */
const $ = s => document.querySelector(s);
const U = SUPABASE.url.replace(/\/$/, ""), K = SUPABASE.key;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cop = n => "$" + Number(n || 0).toLocaleString("es-CO");
const ORDEN = ["XXS","XS","S","M","L","XL","XXL","XXXL","Única"];
const PRESETS = [...ORDEN.slice(1, 7), "Única", ...Array.from({ length: 9 }, (_, i) => String(36 + i))];
let ses = null, prods = [], f = null; // f = estado del formulario abierto
try { ses = JSON.parse(localStorage.getItem("adm_ses")); } catch (e) {}

// ---------- utilidades ----------
function toast(t, mal) { const e = $("#toast"); e.textContent = t; e.className = "toast" + (mal ? " mal" : ""); e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => e.hidden = true, 3200); }
const guardarSes = d => { ses = { access_token: d.access_token, refresh_token: d.refresh_token, exp: Math.floor(Date.now() / 1000) + (d.expires_in || 3600) }; localStorage.setItem("adm_ses", JSON.stringify(ses)); };
function salir() { ses = null; localStorage.removeItem("adm_ses"); $("#app").hidden = true; $("#modal").hidden = true; $("#login").hidden = false; }
async function auth(tipo, cuerpo) {
  const r = await fetch(`${U}/auth/v1/token?grant_type=${tipo}`, { method: "POST", headers: { apikey: K, "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error_description || d.msg || "Error de acceso"); guardarSes(d);
}
async function token() {
  if (!ses) throw new Error("sin sesión");
  if (ses.exp - Date.now() / 1000 < 60) { try { await auth("refresh_token", { refresh_token: ses.refresh_token }); } catch (e) { salir(); throw e; } }
  return ses.access_token;
}
async function api(ruta, op = {}) {
  const t = await token();
  const r = await fetch(U + ruta, { ...op, headers: { apikey: K, Authorization: "Bearer " + t, ...(op.json ? { "Content-Type": "application/json" } : {}), ...(op.headers || {}) }, body: op.json ? JSON.stringify(op.json) : op.body });
  if (r.status === 401) { salir(); throw new Error("Tu sesión venció, entra de nuevo."); }
  if (!r.ok) { let m = r.status; try { const d = await r.json(); m = d.message || d.error || m; } catch (e) {} throw new Error(m); }
  return r.status === 204 ? null : r.json().catch(() => null);
}
const rutaFoto = url => (url.split("/object/public/fotos/")[1] || "");
const borrarFotos = urls => { const p = urls.map(rutaFoto).filter(Boolean); return p.length ? api("/storage/v1/object/fotos", { method: "DELETE", json: { prefixes: p } }).catch(() => {}) : Promise.resolve(); };

// ---------- arranque / login ----------
$("#tNombre").textContent = TIENDA.nombre;
async function iniciar() {
  if (!U || !K) { $("#login").hidden = false; $("#fLogin").innerHTML = "<h1>Falta configurar</h1><p>Abre <b>js/datos/config.js</b> y pega la URL y la clave de Supabase. Los pasos están en GUIA-ADMIN.md.</p>"; return; }
  if (!ses) { $("#login").hidden = false; return; }
  try { await cargar(); $("#login").hidden = true; $("#app").hidden = false; } catch (e) { if (!ses) $("#login").hidden = false; else { $("#login").hidden = true; $("#app").hidden = false; toast(e.message, true); } }
}
$("#fLogin").onsubmit = async e => {
  e.preventDefault(); $("#lErr").textContent = "";
  try { await auth("password", { email: $("#lMail").value.trim(), password: $("#lPass").value }); $("#lPass").value = ""; await cargar(); $("#login").hidden = true; $("#app").hidden = false; }
  catch (x) { $("#lErr").textContent = /invalid/i.test(x.message) ? "Correo o contraseña incorrectos." : x.message; }
};
$("#bSalir").onclick = salir;

// ---------- lista ----------
async function cargar() { prods = await api("/rest/v1/productos?select=*&order=orden.asc,id.desc"); pintar(); }
function pintar() {
  const q = $("#fBus").value.trim().toLowerCase(), g = $("#fGrupo").value;
  const l = prods.filter(p => (!g || p.grupo === g) && (!q || `${p.nombre} ${p.marca} ${p.cat}`.toLowerCase().includes(q)));
  $("#cuenta").textContent = `${l.length} producto${l.length === 1 ? "" : "s"}`;
  $("#lista").innerHTML = l.length ? l.map(p => `<div class="it ${p.activo ? "" : "off"}" data-id="${p.id}">
    ${p.imgs[0] ? `<img src="${esc(p.imgs[0])}" alt="">` : `<div class="ph0"></div>`}
    <div><h3>${esc(p.nombre)}</h3><div class="m">${esc(p.grupo)} · ${esc(p.cat)}${p.marca ? " · " + esc(p.marca) : ""}${p.activo ? "" : " · <b>OCULTO</b>"}</div>
    <div class="pr">${cop(p.precio)}</div><div>${p.tallas.map(t => `<span class="tg ${p.agotadas.includes(t) ? "ag" : ""}">${esc(t)}</span>`).join("")}</div></div>
    <div class="acc"><button class="b" data-a="ed">Editar</button><button class="b" data-a="dup">Duplicar</button><button class="b del" data-a="del">Eliminar</button></div></div>`).join("")
    : `<p class="mut">${prods.length ? "No hay resultados." : "Aún no tienes productos. Toca “+ Nuevo producto”."}</p>`;
}
$("#fBus").oninput = pintar; $("#fGrupo").onchange = pintar;
$("#lista").onclick = async e => {
  const a = e.target.dataset.a, id = e.target.closest(".it")?.dataset.id; if (!a) return;
  const p = prods.find(x => x.id == id);
  if (a === "ed") abrir(p);
  if (a === "dup") abrir({ ...p, id: null, nombre: p.nombre + " (copia)", imgs: [] });
  if (a === "del" && confirm(`¿Eliminar “${p.nombre}”? No se puede deshacer.`)) {
    try { await api(`/rest/v1/productos?id=eq.${p.id}`, { method: "DELETE" }); await borrarFotos(p.imgs); prods = prods.filter(x => x.id !== p.id); pintar(); toast("Producto eliminado"); } catch (x) { toast(x.message, true); }
  }
};

// ---------- formulario ----------
function abrir(p) {
  f = { id: p?.id || null, tallas: [...(p?.tallas || [])], agotadas: [...(p?.agotadas || [])], imgs: [...(p?.imgs || [])], originales: p?.id ? [...p.imgs] : [], nuevas: [], subiendo: 0 };
  $("#mTit").textContent = p?.id ? "Editar producto" : "Nuevo producto";
  $("#pGrupo").value = p?.grupo || "hombre"; $("#pCat").value = p?.cat || ""; $("#pNombre").value = p?.nombre || ""; $("#pMarca").value = p?.marca || "";
  $("#pPrecio").value = p?.precio ?? ""; $("#pActivo").checked = p?.activo ?? true; $("#pErr").textContent = ""; $("#mGuardar").disabled = false;
  catList(); precioF(); pintarTallas(); pintarFotos(); $("#modal").hidden = false; $("#pNombre").focus();
}
function catList() {
  const g = $("#pGrupo").value, c = new Set([...(SECCIONES[g]?.cats || []), ...prods.filter(p => p.grupo === g).map(p => p.cat)]);
  $("#dCat").innerHTML = [...c].map(x => `<option value="${esc(x)}">`).join("");
}
$("#pGrupo").onchange = catList;
const precioF = () => $("#pPrecioF").textContent = $("#pPrecio").value ? cop($("#pPrecio").value) + " COP" : "";
$("#pPrecio").oninput = precioF;
function pintarTallas() {
  $("#presets").innerHTML = PRESETS.map(t => `<button type="button" data-t="${t}" class="${f.tallas.includes(t) ? "on" : ""}">${t}</button>`).join("");
  f.tallas.sort((a, b) => { const i = ORDEN.indexOf(a), j = ORDEN.indexOf(b); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j) || a.localeCompare(b, "es", { numeric: true }); });
  $("#selT").innerHTML = f.tallas.length ? f.tallas.map(t => `<span class="${f.agotadas.includes(t) ? "ag" : ""}"><b data-t="${esc(t)}" title="Marcar agotada / disponible">${esc(t)}</b><i data-q="${esc(t)}" title="Quitar">×</i></span>`).join("") : '<small class="mut">Aún no has elegido tallas.</small>';
}
function quitarT(t) { f.tallas = f.tallas.filter(x => x !== t); f.agotadas = f.agotadas.filter(x => x !== t); }
$("#presets").onclick = e => { const t = e.target.dataset.t; if (!t) return; f.tallas.includes(t) ? quitarT(t) : f.tallas.push(t); pintarTallas(); };
$("#selT").onclick = e => {
  if (e.target.dataset.q) { quitarT(e.target.dataset.q); return pintarTallas(); }
  const t = e.target.dataset.t; if (!t) return;
  f.agotadas.includes(t) ? f.agotadas = f.agotadas.filter(x => x !== t) : f.agotadas.push(t); pintarTallas();
};
const addT = () => { const t = $("#pTallaX").value.trim(); if (t && !f.tallas.includes(t)) f.tallas.push(t); $("#pTallaX").value = ""; pintarTallas(); };
$("#bTalla").onclick = addT; $("#pTallaX").onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); addT(); } };

// ---------- fotos (se reducen en el navegador y se suben a Supabase Storage) ----------
async function reducir(file) {
  const bmp = await createImageBitmap(file), k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  let b = await new Promise(r => c.toBlob(r, "image/webp", .82)), ext = "webp";
  if (!b || b.type !== "image/webp") { b = await new Promise(r => c.toBlob(r, "image/jpeg", .85)); ext = "jpg"; }
  return { b, ext };
}
async function subir(files) {
  for (const file of [...files]) {
    if (!file.type.startsWith("image/")) { toast(`“${file.name}” no es una imagen`, true); continue; }
    const marca = { url: URL.createObjectURL(file), sub: true }; f.imgs.push(marca.url); f.subiendo++; pintarFotos(f.imgs.length - 1);
    try {
      const { b, ext } = await reducir(file), path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await api(`/storage/v1/object/fotos/${path}`, { method: "POST", body: b, headers: { "Content-Type": b.type, "x-upsert": "false" } });
      const url = `${U}/storage/v1/object/public/fotos/${path}`, i = f.imgs.indexOf(marca.url);
      if (i >= 0) { f.imgs[i] = url; f.nuevas.push(url); } else await borrarFotos([url]);
    } catch (x) { f.imgs = f.imgs.filter(u => u !== marca.url); toast("No se pudo subir la foto: " + x.message, true); }
    f.subiendo--; pintarFotos();
  }
}
function pintarFotos() {
  $("#fotos").innerHTML = f.imgs.map((u, i) => `<div class="f ${u.startsWith("blob:") ? "sub" : ""}"><img src="${esc(u)}" alt="">${u.startsWith("blob:") ? "" : `<button type="button" class="q" data-q="${i}">×</button>${i ? `<button type="button" class="p" data-p="${i}">Hacer principal</button>` : `<span class="pri">Principal</span>`}`}</div>`).join("");
}
$("#fotos").onclick = e => {
  if (e.target.dataset.q != null) f.imgs.splice(+e.target.dataset.q, 1);
  else if (e.target.dataset.p != null) f.imgs.unshift(f.imgs.splice(+e.target.dataset.p, 1)[0]);
  else return; pintarFotos();
};
$("#pFotos").onchange = e => { subir(e.target.files); e.target.value = ""; };
const drop = $("#drop");
["dragover", "dragenter"].forEach(n => drop.addEventListener(n, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(n => drop.addEventListener(n, e => { e.preventDefault(); drop.classList.remove("over"); }));
drop.addEventListener("drop", e => subir(e.dataTransfer.files));

// ---------- guardar / cancelar ----------
async function cerrar(descartar) {
  if (descartar && f) await borrarFotos(f.nuevas);
  $("#modal").hidden = true; f = null;
}
$("#mCan").onclick = () => cerrar(true); $("#mX").onclick = () => cerrar(true);
$("#fProd").onsubmit = async e => {
  e.preventDefault(); $("#pErr").textContent = "";
  if (f.subiendo) return $("#pErr").textContent = "Espera a que terminen de subir las fotos.";
  if (!f.tallas.length && !confirm("No elegiste ninguna talla. ¿Guardar así?")) return;
  const d = { grupo: $("#pGrupo").value, nombre: $("#pNombre").value.trim(), marca: $("#pMarca").value.trim(), cat: $("#pCat").value.trim(), precio: Math.max(0, Math.round(+$("#pPrecio").value || 0)),
    imgs: f.imgs, tallas: f.tallas, agotadas: f.agotadas.filter(t => f.tallas.includes(t)), activo: $("#pActivo").checked };
  $("#mGuardar").disabled = true;
  try {
    if (f.id) await api(`/rest/v1/productos?id=eq.${f.id}`, { method: "PATCH", json: d }); else await api("/rest/v1/productos", { method: "POST", json: d });
    await borrarFotos([...f.originales, ...f.nuevas].filter(u => !d.imgs.includes(u)));
    f.nuevas = []; await cargar(); cerrar(false); toast("Producto guardado");
  } catch (x) { $("#pErr").textContent = "No se pudo guardar: " + x.message; $("#mGuardar").disabled = false; }
};
$("#bNuevo").onclick = () => abrir(null);
iniciar();
