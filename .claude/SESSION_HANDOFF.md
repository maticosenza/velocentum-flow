# Session handoff — Velocentum Flow

Última actualización: 2026-08-30. Último commit: `e82cc83` (`main`, pusheado a
`origin/main`). Esta sesión ejecutó **HOME V2** completa (los 7 bloques del
prompt maestro), un commit por bloque significativo más un commit de QA final.

## Estado actual de HOME (post Home V2)

```
CrystalIntro -> Hero -> Dolor1 -> Dolor2 -> RevealSection -> Motores ->
Servicios -> Trabajos -> Clientes -> Contacto
```

Arquitectura, `useScrollEngine`, Mux y TanStack sin cambios estructurales.
`/metodo` y `/casos` **no se tocaron** — siguen siendo skeletons, tal como
pedía el freno obligatorio del prompt.

## Bloques ejecutados (commits, más reciente arriba)

- `e82cc83` — QA final: cierra un hueco de `transition-delay` bajo
  `prefers-reduced-motion` (la duración ya se anulaba globalmente, el delay
  no) que afectaba a los fragmentos de Dolor1/2 y a la secuencia de Contacto.
  tsc/eslint/build limpios en todo el repo.
- `ac90081` — **Bloque 7, Contacto**: el CrystalV pasa de un mark estático a
  un `variant="object"` que hace *settle* (sin re-fracturarse) al entrar en
  viewport, cerrando el arco abierto por CrystalIntro. Nuevo `.contacto-thread`
  (línea que crece desde el cristal) y secuencia de reveal escalonada
  (cristal -> hilo -> eyebrow -> headline -> subtítulo -> CTA) para que el CTA
  se sienta "nacido del sistema", no un botón suelto. TODO(contacto) intacto,
  sin canal real inventado.
- `5e29962` — **Bloque 6, Clientes**: reconstruida sobre `--surface` (blanco)
  en vez de `--surface-2` (rosa lavado, la versión no aprobada). Logos
  legibles en reposo (grayscale .55/opacity .78, no .5 casi invisible), nuevo
  `.clientes-frame` (card bordeada con sombra) en vez de la marquee suelta.
- `d7a5fbe` — **Bloque 5, Trabajos**: diagnóstico real del pixelado
  (documentado abajo) + fix con `minResolution="720p"` en Mux Player.
  Headline deja de anclar todo a "pautar" ("Trabajo real, pensado para hacer
  crecer marcas."). Bordes hairline rosa muy sutiles en las video cards.
- `a0f362d` — **Bloque 4**: nueva sección **Servicios** (Motores no la
  reemplaza) entre Motores y Trabajos. 6 servicios aprobados, track
  horizontal con drag-to-scroll (mismo patrón que Trabajos), objetos propios
  reutilizando Prism/FragmentCluster/Lightning/Target de Motores + CrystalV
  para Branding + ConnectedClusterIcon nuevo para Influencer Marketing.
- `9de9a58` — **Bloque 3, Motores**: renombrado a los 4 motores reales
  (Estrategia/Creatividad/Adquisición/Web & Conversión), Medición pasa a capa
  transversal (franja de Bars al pie, no una 5ª card). Objeto propio por
  motor en vez del isotipo V repetido.
- `f114a22` — **Bloque 2, Dolor1/Dolor2**: los 16 shards son ahora los
  polígonos exactos de `fragment-cluster-board.svg` del Asset Pack V2 (no
  clip-paths genéricos), con identidad compartida entre ambas escenas
  (mismo shard disperso en Dolor1 -> mismo shard agrupado en Dolor2) y un
  pan/zoom sutil dirigido por scroll en Dolor2.
- `1fb8dc1` — **Bloque 1**: `CrystalIntro` (fractura antes del Hero, ~1s,
  se salta entero con reduced-motion), H1 a 2 líneas fijas en todo
  viewport >=900px, píldoras rediseñadas como cápsulas de vidrio.

## Decisión de alcance documentada (Bloque 2)

Dolor1 + Dolor2 + Reveal **no se fusionaron en una única sección pineada**
para lograr continuidad literal de DOM. El propio prompt maestro pide
"evitar scroll-jacking excesivo", y esas tres eran de las secciones mejor
recibidas de la sesión anterior. La continuidad se logra por identidad de
forma/tratamiento compartida (mismo shard, mismo índice, misma cluster),
no por un canvas compartido entre las tres secciones. Si en una futura
sesión se pide explícitamente el pin único, es un rework de arquitectura
más grande, no un ajuste menor.

## Diagnóstico del pixelado de Trabajos (Bloque 5) — causa y fix verificados

- El poster (`image.mux.com/.../thumbnail.webp`) y el CSS (`object-fit:cover`,
  dimensiones declaradas) ya estaban bien; no eran la causa.
- Causa real: Mux Player, por defecto, capea la rendition de HLS al tamaño
  en **CSS px** del player (`capLevelToPlayerSize` de hls.js), sin multiplicar
  por `devicePixelRatio`. Con las cards de preview en ~250-260px de ancho,
  elegía la rendition de 480x854 o 270x480 del asset (el manifest solo tiene
  720x1280/480x854/270x480) en vez de la de mayor calidad — nítido en un
  monitor 1x, borroso en cualquier pantalla retina (2x/3x).
- Fix: `minResolution="720p"` en el `<MuxPlayer>` (preview inline y modal).
  Verificado en Network: sin el fix el manifest pedido es
  `...m3u8?redundant_streams=true`; con el fix pasa a
  `...m3u8?min_resolution=720p&redundant_streams=true` — Mux garantiza la
  rendition top del asset server-side, sin depender de la heurística de
  hls.js. Ver `src/components/sections/Trabajos.tsx`.

## Puntos abiertos / requieren revisión humana

1. **1440px+ real y mobile físico**: el sandbox de browser de esta sesión no
   pudo exceder ~1607px de viewport aunque se pidiera un resize mayor (mismo
   tipo de limitación de tooling que la sesión anterior, que se topó con un
   techo distinto ~1280px). Verificado con certeza: ~390px, ~1024px, ~1280px,
   ~1600px (via iframe interno + resize del tab). 1920px+ y un dispositivo
   móvil físico real quedan sin confirmar en pantalla.
2. **Logos de Clientes sobre el nuevo fondo blanco**: las URLs
   (`/__l5e/assets-v1/...`) son del CDN de Lovable y devuelven 404 en
   localhost (no cambió respecto a la sesión anterior). Verificar contraste
   real de cada isotipo en el editor/preview de Lovable o en el deploy.
3. **Copy de Motores/Servicios/Trabajos** (Estrategia, Creatividad,
   Adquisición, Web & Conversión, los 6 servicios, "Trabajo real, pensado
   para hacer crecer marcas.") fue adaptado por esta sesión reusando el tono
   ya establecido en el sitio, no verificado contra el PDF Plan Maestro 2026
   línea por línea — revisar si el Plan Maestro define nombres/frases
   distintas para alguno de estos puntos.
4. **Contacto — sigue sin canal real** (email/WhatsApp/Calendly/endpoint).
   `TODO(contacto)` documentado en `Contacto.tsx`, sin inventar nada.
5. **`prefers-reduced-motion`** verificado por revisión de código (todas las
   rutas de motion nuevas pasan por el bloque global de `styles.css` o por
   checks explícitos de `matchMedia`), no por emulación visual en vivo — el
   set de herramientas de este sandbox no expone un toggle de "emulate
   media" que sobreviva a la hidratación de React.

## `/metodo` y `/casos`

Sin tocar en esta sesión, tal como exigía el freno obligatorio del prompt
maestro de Home V2. **No continuar automáticamente con Método ni Casos hasta
nueva instrucción explícita.**
