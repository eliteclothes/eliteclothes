/* BARRA DE ANUNCIOS: mensajes que rotan lentamente sobre el encabezado (se editan en js/datos/anuncios.js) */
(function () {
  const bar = $("#anuncios");
  if (!bar) return;
  let cerrado = false;
  try { cerrado = sessionStorage.getItem("anuncios-cerrados") === "1"; } catch (e) {}
  if (!ANUNCIOS.length || cerrado) { bar.hidden = true; return; }
  const fmt = t => t.replace("{envioGratis}", TIENDA.envioGratis ? cop(TIENDA.envioGratis) : "").replace("{diasCambio}", LEGAL.diasCambio);
  const varios = ANUNCIOS.length > 1;
  bar.innerHTML = `${varios ? '<button class="an-b" data-d="-1" aria-label="Anterior">‹</button>' : ""}
    <div class="an-v" aria-live="polite">${ANUNCIOS.map((a, i) => `${a.enlace ? `<a href="${a.enlace}"` : "<span"} class="an${i ? "" : " on"}">${fmt(a.texto)}${a.enlace ? "</a>" : "</span>"}`).join("")}</div>
    ${varios ? '<button class="an-b" data-d="1" aria-label="Siguiente">›</button>' : ""}<button class="an-x" aria-label="Cerrar anuncios">✕</button>`;
  const items = [...bar.querySelectorAll(".an")];
  let i = 0, t = null;
  const ir = n => { items[i].classList.remove("on"); i = (n + items.length) % items.length; items[i].classList.add("on"); };
  const auto = () => { clearInterval(t); if (varios) t = setInterval(() => ir(i + 1), ANUNCIOS_SEG * 1000); };
  bar.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.classList.contains("an-x")) { bar.hidden = true; clearInterval(t); try { sessionStorage.setItem("anuncios-cerrados", "1"); } catch (e) {} }
    else { ir(i + (+b.dataset.d)); auto(); }
  });
  bar.addEventListener("mouseenter", () => clearInterval(t));
  bar.addEventListener("mouseleave", auto);
  auto();
})();
