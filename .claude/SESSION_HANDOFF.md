# Session handoff — Velocentum Flow

Última actualización: 2026-08-30. Último commit: `9024c54` (`main`, pusheado a `origin/main`).

## Estado actual de HOME

HOME (`src/routes/index.tsx`) está completa en su primera pasada de contenido e implementación:

```
Hero -> Dolor1 -> Dolor2 -> RevealSection -> Motores -> Trabajos -> Clientes -> Contacto
```

Todo lo anterior a Motores (Hero, Dolores, Reveal) pasó por dos rondas de corrección visual
("Fase 1" y "Fase 1 — pasada visual 2"). Motores, Trabajos (ajustes), Clientes y Contacto son
nuevos de esta última sesión ("loop nocturno"). `/metodo` y `/casos` son solo skeletons, no
tocados en ninguna de estas sesiones.

**HOME requiere auditoría visual humana antes de avanzar.** El sandbox de browser de esta sesión
no permitió fijar anchos de ventana reales de forma confiable (los tabs nuevos devolvían
consistentemente 1280px); lo verificado con mediciones exactas (`getBoundingClientRect`,
`scrollTo` a offsets calculados) cubre ~500px y ~1280px. 1440px+ y mobile real (~390px) solo se
revisaron por código/CSS, no en pantalla.

## Qué quedó implementado esta sesión (commits, más reciente arriba)

- `9024c54` — QA final: limpieza de lint preexistente (`Reveal.tsx`, `useReveal.ts`), sin cambio
  de lógica.
- `32b280f` — Nueva sección **Contacto**: escena de cierre (mark de Crystal V, headline, CTA).
  Corrige que `hash="contacto"` (Nav, Hero) no apuntaba a ningún `id` existente.
- `1ff44db` — **Clientes** reconstruida sobre fondo claro (`--surface-2`), filtro de logos
  ajustado para fondo claro. Mismos 12 logos reales, ninguno inventado.
- `15171ab` — **Trabajos**: decoración de las text cards intercaladas reducida (título pasa a
  mono/uppercase chico), video sigue siendo el protagonista, Mux sin tocar.
- `617955f` — **Servicios eliminada, reemplazada por Motores**: 4 motores (Estrategia/
  Contenido/Pauta/Medición) conectados por una línea (`motores-spine`), no 7 cards sueltas.

Commits previos (misma sesión de trabajo, antes del loop nocturno, ver `70645ea` y anteriores)
cubren la Fase 1 del rebrand pink/ink y su pasada de corrección visual (Hero, Dolores, Reveal,
ScrollAxis).

## Arquitectura y decisiones que NO deben romperse

- **`useScrollEngine`** (`src/hooks/useScrollEngine.ts`) es la única fuente de scroll: un solo
  rAF global, `useScrollSubscription`, `useScrollRange(ref, cb, {start, end})`. No agregar un
  segundo listener de scroll en ningún componente nuevo.
- **No agregar GSAP, Framer Motion ni Lenis.** Todo el motion es `transform`/`opacity` vía la
  animación existente o transiciones CSS (`.reveal` + `useReveal` para fade-in on-scroll de un
  solo uso).
- Patrón de pin sticky (outer alto + inner `position:sticky`) usado en Servicios-ahora-Motores
  (ya no pinneado; Motores es una sección simple) y en `RevealSection`/`Dolores` donde aplica —
  no reinventar el mecanismo, reusar `useScrollRange`.
- Respetar `prefers-reduced-motion` en cualquier componente nuevo (patrón: `useState(false)` +
  corrección en `useEffect` vía `matchMedia`, con rama que "siembra" el estado final sin animar).
- `TanStack Router` para navegación; los CTAs internos usan `<Link to="/" hash="...">`, no
  `<a href="/#...">`.
- Mux (`@mux/mux-player-react`) para todo el video de Trabajos — no reemplazar ni reconstruir el
  sistema de preview/modal existente.
- Lazy loading (`loading="lazy"`) en imágenes/logos ya establecido, mantenerlo en contenido nuevo.

## Identidad visual vigente

- **Asset Pack V2** es la fuente de verdad visual (geometría exacta de Crystal V, paleta,
  tratamiento de facetas). Cualquier ícono/gráfico nuevo debe derivar de `CrystalV.tsx`
  (`variant="object"` para la pieza completa de 12 facetas, `variant="mark"` para el ícono plano
  reducido), no inventar geometría nueva.
- **Plan Maestro 2026** es la fuente de verdad narrativa/UX (el arco Hero -> Dolor1 -> Dolor2 ->
  Reveal -> "qué hacemos" -> prueba -> social proof -> CTA sigue esa lógica). El PDF en sí no
  estuvo accesible en esta sesión — ver nota de Motores abajo.
- Identidad de marca vigente: **Crystal V + pink/red (`--pink`, `--pink-deep`, `--pink-soft`) +
  ink (`--ink-deep`) + blanco**. `--violet`/`--brand` siguen existiendo como alias temporales
  (`var(--pink)`/`var(--pink-deep)`) en código legacy no reescrito todavía — no son un segundo
  sistema de color, son nomenclatura vieja a limpiar de a poco, no reintroducir violeta real en
  ningún diseño nuevo.
- Regla de composición mantenida: un gesto visual principal + un apoyo secundario por escena;
  evitar exceso de cards, glows genéricos, blobs, shapes random.

## Puntos abiertos / requieren decisión o revisión humana

1. **Motores — nombres y copy necesitan revisión humana.** El Plan Maestro 2026 (PDF) no estuvo
   accesible en esta sesión de loop nocturno. El copy actual (`src/components/sections/
   Motores.tsx`) reusa/adapta frases YA aprobadas en el sitio (subtítulo del Hero, headline de
   Trabajos, copy del viejo Servicios) en vez de inventar — pero si el Plan Maestro define los
   motores con nombres o descripciones distintos, hay que ajustar este archivo.
2. **Contacto — falta destino real.** No hay email, WhatsApp, teléfono, link de agenda ni
   endpoint de formulario en todo el repo (búsqueda explícita, cero resultados). El CTA final en
   `src/components/sections/Contacto.tsx` es un `<button>` con un `TODO(contacto)` documentado en
   el propio archivo — no se inventó ningún dato de contacto. Definir el canal real y conectar
   `handleContactCta` antes de producción.
3. **Logos de Clientes — verificar visualmente en Lovable.** Las URLs (`/__l5e/assets-v1/...`)
   apuntan al CDN de Lovable y no cargan en `localhost` (esperado). No se pudo confirmar
   visualmente que los 12 logos se vean bien sobre el nuevo fondo claro (`--surface-2`) fuera de
   este sandbox — verificar en el editor/preview de Lovable o en el deploy real.
4. **HOME requiere auditoría visual humana** antes de avanzar a cualquier fase siguiente,
   especialmente en 1440px+ y mobile real (~390px), que esta sesión no pudo confirmar en pantalla
   (ver limitación de tooling arriba).

## `/metodo` y `/casos`

Siguen siendo skeletons sin trabajo de diseño/contenido. **No continuar automáticamente con
Método ni Casos hasta nueva instrucción.**
