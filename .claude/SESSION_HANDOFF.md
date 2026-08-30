# Session handoff — Velocentum Flow

Última actualización: 2026-08-30. Último commit: `c6d4311` (`main`, pusheado a
`origin/main`). Esta sesión ejecutó **V3 — Narrative Interaction System**
completo (los 11 commits del plan aprobado), sobre la base de HOME V2 (ver
sección propia más abajo).

## Estado actual de HOME (post V3)

```
SequenceA (Intro->Hero->Dolor1->Dolor2->Reveal, un pin, 12 facetas
compartidas de CrystalV)
  -> SequenceB (Reveal->Motores->Servicios, otro pin, cristal propio)
  -> ServiciosToTrabajosHandoff (corto, sin pin)
  -> Trabajos (sin cambios)
  -> Clientes (sin cambios)
  -> ClientesToContactoHandoff (corto, sin pin)
  -> Contacto (settle de cristal + formulario nuevo)
```

`/metodo` y `/casos` **no se tocaron** — siguen siendo skeletons. El sistema
(`NarrativeSequence` + `narrativeMotion` + vocabulario de facetas/shards)
queda explícitamente preparado para que /metodo lo reutilice con su propio
set de beats/keyframes, sin implementarlo todavía.

## Commits de V3 (más reciente arriba)

- `c6d4311` — **Commit 10, formulario**: Contacto reemplaza el botón único
  por el formulario aprobado (Nombre, Empresa/Marca, Web o Instagram, ¿Qué
  querés hacer crecer?, Email o WhatsApp; CTA "Quiero analizar mi negocio").
  `onSubmit` con `preventDefault()` + `TODO(contacto)`, sin backend/endpoint.
- `1488ad4` — **Commit 9, handoff Clientes->Contacto**: bloque normal-flow de
  60vh (sin pin), wipe claro->oscuro solo por `opacity` (nunca
  `background-color`), 4 shards del fragment-cluster vocabulary como
  "vuelven las facetas". Clientes y Contacto sin tocar.
- `677386f` — **Commit 8, handoff Servicios->Trabajos**: bloque normal-flow
  de 70vh (sin pin), una superficie escala 0.4x->1x mientras el poster del
  primer video de Trabajos hace crossfade encima.
- `eef70d3` — **Commits 6+7, Sequence B**: Reveal->Motores->Servicios como
  un solo pin de 2 beats. `SequenceBStage` (cristal propio, arranca YA
  ensamblado) se fractura una vez y desvanece; los 4 objetos de motor
  (Prism/FragmentCluster/Lightning/Target) hacen crossfade-in (relevo
  espacial, no morph — son objetos incompatibles con las facetas de la V);
  los 6 objetos de Servicios hacen crossfade con los 4 de Motores al pasar
  de beat. Motores/Servicios pre-V3 quedan intactos como `staticFallback`.
- `fb2fab4` — **Commit 5**: Sequence A completa — Reveal gana su propio slot
  medido (antes usaba el de Hero como placeholder).
- `e225bdf` — **Commit 4**: Dolor1Beat/Dolor2Beat (headline + Mira +
  `AmbientShards`, 6 shards reales del fragment-cluster-board como
  ambientación, no parte del morph principal).
- `103621d` — **Commit 3**: Sequence A Intro->Hero. `CrystalStage` (las 12
  facetas compartidas, auto-play de intro sobre las mismas), `HeroBeat`.
  Fix real de `NarrativeSequence`: el efecto de scroll-range no se
  re-ejecutaba al pasar de "static" a "pinned" (identidad de ref estable
  aunque `.current` cambie) — resuelto con un efecto propio dependiendo de
  `mode`. `start:0/end:1` es el mapeo exacto de un pin, no el default.
- `dbb0040` — **Commit 2**: scaffold `NarrativeSequence` (progreso
  compartido sin re-render, fallback mobile/reduced-motion con un solo
  criterio).
- `b91f45d` — **Commit 1**: `narrativeMotion.ts` (Pose/Keyframe/
  interpolatePoses/interpolateScalar/beatVisibility), section-agnostic.

## Decisiones de identidad y alcance tomadas durante la ejecución

1. **Vocabulario canónico de Sequence A = las 12 facetas reales de
   CrystalV**, no los 16 shards del fragment-cluster-board (aprobado
   explícitamente antes de ejecutar). El fragment-cluster-board se preservó
   como **ambientación secundaria** (`AmbientShards`, y los shards de
   `ClientesToContactoHandoff`), nunca como parte del morph principal.
2. **Sequence A y Sequence B son dos pines independientes**, no uno solo —
   la continuidad entre ellas es visual (el cristal de `SequenceBStage`
   arranca en la misma pose en la que termina Sequence A), no DOM
   compartido. Evita un mega-pin que sería scroll-jacking real.
3. **Motores→Servicios se resuelve por crossfade ("relevo espacial"), no
   por tracking de facetas 1:1** — un prisma/rayo/mira no son facetas de la
   V, y 4 objetos no mapean 1:1 a 6. Es la aplicación literal de la regla
   "relevo cuando los objetos son incompatibles" del plan aprobado.
4. **Servicios→Trabajos y Clientes→Contacto son transiciones cortas sin
   pin** (bloques normal-flow con un solo `useScrollRange` sobre sí
   mismos), tal como exigía la corrección del mapa — no hay una tercera
   `NarrativeSequence`.
5. **Fallback mobile/reduced-motion**: un solo criterio (`useNarrativeMode`,
   ancho <900px O `prefers-reduced-motion`) decide entre el árbol pineado y
   un `staticFallback` que reutiliza **sin modificar** los componentes
   pre-V3 (`Hero`, `Dolor1`, `Dolor2`, `RevealSection`, `Motores`,
   `Servicios`) — no hay una segunda implementación de ese contenido que
   mantener.

## Bug real encontrado y corregido durante Commit 3

`NarrativeSequence` usaba `useScrollRange(outerRef, ...)`, cuyo efecto
depende de `[elementRef, ...]`. Un objeto ref tiene identidad estable aunque
`.current` cambie — con el fallback `static`→`pinned` (el wrapper con el
ref recién se renderiza en modo `pinned`), el efecto corría una vez con
`outerRef.current === null` y **nunca se volvía a ejecutar**, dejando el
cristal congelado en su pose inicial sin importar cuánto se scrolleara.
Se reemplazó por un efecto propio con `[mode]` en las deps (dispara en el
render exacto donde el ref se adjunta) y se corrigió de paso el mapeo
`start`/`end`: `0/1` es el mapeo exacto de un pin (progreso 0 al enganchar,
1 al soltar), no el default `1/0` ("cruza todo el viewport") que
`useScrollRange` usa sin opciones.

## Puntos abiertos / requieren revisión humana

1. **1440px+ real y mobile físico**: mismo límite de sandbox que en V2 (tope
   de ventana ~1600px). Verificado con certeza en ~390px, ~1024px, ~1600px
   vía iframe interno + resize del tab.
2. **Timing/coreografía de las transformaciones** (cuándo exactamente
   fractura el cristal, cuándo entran los íconos de Motores/Servicios, qué
   tan grande es el "campo" de Dolor1/Dolor2) se resolvió a ojo durante la
   implementación y se ajustó una vez visualmente (ver commits 3 y 4) — es
   un punto natural para pulir con feedback humano en pantalla real, no
   solo en el sandbox.
3. **Logos de Clientes** sobre fondo blanco: sigue sin poder verse en
   localhost (CDN de Lovable, 404) — mismo pendiente que en V2.
4. **Contacto sigue sin canal real** (email/WhatsApp/Calendly/endpoint).
   `TODO(contacto)` documentado, formulario nuevo sin destino real.
5. **`ScrollAxis` (labels laterales)** no se recalibró — sigue siendo una
   distribución pareja de 7 labels sobre el scroll total, ya aproximada
   antes de V3 (no depende de posiciones reales de sección). El total de
   scroll de la página creció bastante con los dos pines nuevos; no se
   verificó si las proporciones siguen "sintiéndose" bien.
6. **`prefers-reduced-motion`** verificado por revisión de código (todos los
   componentes nuevos chequean `matchMedia` explícitamente o dependen de
   `useNarrativeMode`), no por emulación visual en vivo — mismo límite de
   sandbox que en V2.

## `/metodo`

**No implementado.** Arquitectónicamente preparado: `NarrativeSequence`,
`narrativeMotion.ts` y el patrón de `CrystalStage` (facetas compartidas +
auto-play + slots medidos) son directamente reutilizables para el arco de 7
etapas (negocio -> diagnóstico -> oportunidad -> proyección -> plan de
acción -> ejecución -> medición/iteración) con un set de keyframes propio.
El contenido/tratamiento visual de cada etapa es una decisión de diseño
para cuando arranque esa fase, no algo definido en esta sesión.

**No continuar automáticamente con Método ni Casos hasta nueva instrucción
explícita** — freno obligatorio del prompt de V3, respetado.

---

## Historial: Home V2 (sesión anterior a V3)

Home V2 ejecutó los 7 bloques del prompt maestro de esa sesión (intro,
Dolor1/2 con geometría real del fragment-cluster-board, Motores con 4
motores reales, sección Servicios nueva, fix de pixelado de Mux en
Trabajos, Clientes sobre fondo neutro, Contacto con cierre del arco). V3
construyó directamente sobre esa base — Hero/Dolores/RevealSection/
Motores/Servicios de V2 siguen existiendo tal cual, ahora como
`staticFallback` de las nuevas secuencias en vez de como secciones
independientes en `routes/index.tsx`.
