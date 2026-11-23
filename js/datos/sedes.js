/* SEDES DE LA TIENDA: el botón del mapa (junto a Instagram y TikTok, en el pie de página) muestra estas sedes.
   Al presionarlo NO redirige de inmediato: abre una ventana para elegir la sede, o para buscar la más cercana.

   CÓMO EDITAR CADA SEDE
   - nombre, direccion, horario: lo que verá el cliente (si dejas el horario vacío, no se muestra).
   - lat y lng: las coordenadas de la sede. En Google Maps haz clic derecho sobre el lugar exacto;
     el primer renglón del menú muestra "6.244203, -75.581211": el primer número es lat y el segundo lng.
     Con ellas funciona la ruta exacta y el botón "Encontrar la sede más cercana".
   - enlace (opcional): el enlace de Google Maps de la sede (Compartir > Copiar enlace). Se muestra como "Ver en Maps".
   - Si una sede no tiene coordenadas ni enlace, se abre Google Maps buscando la dirección escrita.
   Para quitar el botón del mapa, deja la lista vacía (SEDES = []).
   Cualquier botón o enlace de la página con la dirección "#sedes" abre esta ventana. */
const SEDES = [
  {
    nombre: "Sede Medellín . Santander",
    direccion: "Medellín, Santander, Antioquia",           // EDITA AQUÍ: pon la dirección exacta (calle/carrera y barrio)
    horario: "",                                  // EDITA AQUÍ: ej. "Lunes a sábado, 10:00 a. m. – 8:00 p. m."
    lat: 6.308515587324212,
    lng: -75.57670885753377,
    enlace: "https://maps.app.goo.gl/nEZoW79j54ZNKHY19"
  },
  {
    nombre: "Sede Bello · Zamora",
    direccion: "Zamora, Bello, Antioquia",       // EDITA AQUÍ: pon la dirección exacta (calle/carrera y barrio)
    horario: "",                                  // EDITA AQUÍ
    lat: 6.308419889717015,
    lng: -75.55281551488153,
    enlace: "https://maps.app.goo.gl/9JFYTnQdUJK7Y3EB9"
  }
];
