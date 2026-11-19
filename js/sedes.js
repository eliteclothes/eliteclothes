/* MAPA DE SEDES: botón en el pie + ventana para elegir sede (o la más cercana). Los datos se editan en js/datos/sedes.js */
(function () {
  if (typeof SEDES === "undefined" || !SEDES.length) return;
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 12 3a7 7 0 0 1 7 6.8C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.6"/></svg>';
  const rs = document.querySelector("#oscuro .rs");
  if (rs) rs.insertAdjacentHTML("beforeend", `<button type="button" class="mapa-btn" aria-label="Cómo llegar a nuestras sedes" title="Nuestras sedes">${PIN}</button>`);
  const dlg = document.createElement("dialog");
  dlg.className = "sd"; dlg.setAttribute("aria-labelledby", "sd-t");
  document.body.appendChild(dlg);

  const tiene = s => typeof s.lat === "number" && typeof s.lng === "number";
  const ruta = s => tiene(s) ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
    : s.enlace || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.direccion)}`;
  const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371, h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const fmt = k => k < 1 ? Math.round(k * 1000) + " m" : k.toFixed(1).replace(".", ",") + " km";
  const geo = "geolocation" in navigator && SEDES.some(tiene);

  const tarjeta = (s, i) => `<li data-i="${i}"><div class="sd-info"><b>${s.nombre}</b><span>${s.direccion}</span>${s.horario ? `<small>${s.horario}</small>` : ""}<em class="sd-d" hidden></em></div>
    <div class="sd-acc"><a class="sd-ir" href="${ruta(s)}" target="_blank" rel="noopener">Cómo llegar</a>${s.enlace ? `<a class="sd-ver" href="${s.enlace}" target="_blank" rel="noopener">Ver en Maps</a>` : ""}</div></li>`;

  function abrir() {
    dlg.innerHTML = `<div class="sd-in"><button type="button" class="sd-x" data-x aria-label="Cerrar">✕</button>
      <h2 id="sd-t">¿A cuál sede quieres ir?</h2><p class="sd-sub">Elige una y te abrimos Google Maps con la ruta.</p>
      ${geo ? `<button type="button" class="sd-cerca" data-cerca>${PIN}<span>Encontrar la sede más cercana</span></button>` : ""}
      <p class="sd-msg" aria-live="polite"></p><ul class="sd-lista">${SEDES.map(tarjeta).join("")}</ul></div>`;
    dlg.showModal();
  }
  function ubicar(btn) {
    const msg = dlg.querySelector(".sd-msg");
    btn.disabled = true; msg.textContent = "Buscando tu ubicación…";
    navigator.geolocation.getCurrentPosition(p => {
      const lista = dlg.querySelector(".sd-lista");
      const orden = SEDES.map((s, i) => ({ i, d: tiene(s) ? km(p.coords.latitude, p.coords.longitude, s.lat, s.lng) : null })).filter(x => x.d != null).sort((a, b) => a.d - b.d);
      orden.slice().reverse().forEach(x => {                 // la más cercana queda de primera
        const li = lista.querySelector(`[data-i="${x.i}"]`), em = li.querySelector(".sd-d");
        em.hidden = false; em.textContent = "a " + fmt(x.d); lista.prepend(li);
      });
      lista.firstElementChild.classList.add("cerca");
      msg.innerHTML = `La sede más cercana a ti es <b>${SEDES[orden[0].i].nombre}</b> (a ${fmt(orden[0].d)}). Toca "Cómo llegar" para abrir la ruta.`;
      btn.remove();
    }, () => { msg.textContent = "No pudimos acceder a tu ubicación. Elige una sede de la lista."; btn.disabled = false; },
    { enableHighAccuracy: false, timeout: 9000, maximumAge: 120000 });
  }
  document.addEventListener("click", e => { if (e.target.closest(".mapa-btn, a[href=\"#sedes\"]")) abrir(); });  // el botón del pie y cualquier enlace "#sedes"
  dlg.addEventListener("click", e => {
    if (e.target === dlg || e.target.closest("[data-x]")) return dlg.close();
    const c = e.target.closest("[data-cerca]"); if (c) ubicar(c);
  });
})();
