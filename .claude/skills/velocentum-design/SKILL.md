---
name: velocentum-design
description: Design system y reglas de construcción del sitio velocentum.com. Usar SIEMPRE que se cree o modifique cualquier componente, sección, página o estilo de este repositorio. Cubre tokens de color, tipografía Manrope y Geist Mono, spacing, reglas de animación y performance, el objeto narrativo CrystalFiveApproved, la identidad BrandLogoMark, y las decisiones de marca que no se deben romper. Complementa a docs/PLAN_MAIN_HOME.txt, que es la fuente de verdad; no lo reemplaza.
---

# Velocentum — design system

Sitio de marca de Velocentum, **equipo de crecimiento** (Argentina). Stack: TanStack Start +
React + TypeScript + Tailwind v4. Sincroniza con Lovable.

> **Jerarquía.** `docs/PLAN_MAIN_HOME.txt` es la fuente de verdad de composición, copy, CTA,
> tipografía, geometría, narrativa y movimiento. `AGENTS.md` tiene las reglas operativas.
> Este skill es **complementario**: aporta el detalle técnico y no reemplaza al plan. Si algo
> de acá contradice al plan, manda el plan.

Performance, pauta, contenido, diseño, web, tecnología, análisis y estrategia son **capacidades
del equipo**, no el posicionamiento de la empresa. No presentar a Velocentum como agencia de
performance ni encerrar la marca en un solo servicio.

Rol de este sitio: vitrina de marca y trabajos, para tráfico orgánico, directo y referidos.
`velocentum.agency` es otra propiedad: la landing de conversión para tráfico pago. No confundir.

Dirección de diseño: **instrumento de medición**. Los elementos no "entran", se calibran.
Líneas que se trazan, ejes que se gradúan, valores que se revelan. Todo lo que se construya
tiene que responder a esa idea.

---

## Color

Los tokens ya están en `src/styles.css`. **No los redefinas ni los dupliques.**

### Escala oscura (dominante)

| Token | Hex | Uso |
|---|---|---|
| `--ink-deep` | `#0E0E13` | Fondo por defecto del sitio |
| `--ink-deep-2` | `#1A1A23` | Cards y bloques sobre fondo oscuro |
| `--on-dark` | `#FFFFFF` | Texto principal sobre oscuro |
| `--on-dark-2` | `rgba(255,255,255,0.62)` | Texto secundario sobre oscuro |
| `--border-dark` | `rgba(255,255,255,0.10)` | Bordes sobre oscuro |

### Escala clara

| Token | Hex | Uso |
|---|---|---|
| `--surface` | `#FFFFFF` | Cards claras |
| `--surface-2` | `#FFF0F6` | Secciones claras |
| `--ink` | `#0E0E13` | Texto sobre claro |
| `--ink-2` | `#5C5964` | Texto secundario sobre claro |
| `--border` | `#ECE8EF` | Bordes sobre claro |

### Marca

| Token | Hex | Uso |
|---|---|---|
| `--pink` | `#FF4B8D` | Acento principal, CTAs sólidos, focus ring, elementos activos |
| `--pink-soft` | `#FF85B8` | Luz, facetas claras del Crystal 5 |
| `--pink-deep` | `#D92F6E` | Profundidad, facetas oscuras, acentos secundarios |
| `--gradient-brand` | `linear-gradient(135deg, #FFB4CF 0%, #F77FA8 28%, #D32D68 62%, #7A193C 100%)` | Único gradiente decorativo permitido, reservado al Crystal 5 y tratamientos de marca |

`--violet` y `--brand` siguen existiendo como **alias temporales** (`--violet: var(--pink)`,
`--brand: var(--pink-deep)`) para las secciones todavía no reconstruidas contra el nuevo sistema
(Trabajos, Servicios, Clientes). No los uses en código nuevo — referenciá `--pink` / `--pink-deep`
directamente. Se limpian en Fase 2.

### Reglas de color

- El fondo por defecto es `--ink-deep`, no blanco.
- `--pink` aparece en: flechas de CTA, links, eje de medición, labels de sección, elementos activos.
- **Botones sólidos: fondo `--pink`, texto e ícono `--ink`. Nunca texto blanco sobre rosa.**
- **Nada de gradientes decorativos de fondo.** El único gradiente permitido es
  `--gradient-brand`, reservado al Crystal 5 y a los tratamientos de marca.
- **Glows: solo donde `PLAN_MAIN_HOME.txt` los especifica.** No se agregan por criterio propio.
  Los casos aprobados hoy son:
  · las **atmósferas aprobadas** de `public/brand-approved/official/atmosphere/`
    (`pink-glow`, `dark-glass`, `orbit`, `network`), donde el plan las pide;
  · el **glow final del cierre T5** de la Sección 09 — Empecemos, que aparece recién después
    de las aristas;
  · el halo del nodo 01 activo de la Sección 05, documentado en el plan.
  Fuera de eso, nada de glows difusos. Las Secciones 07 y 08 los prohíben explícitamente.
- **Nada de paletas multicolor.** Un color de acento por sección, siempre de la paleta.

---

## Tipografía

### Familias

| Rol | Familia | Dónde |
|---|---|---|
| Display | **Manrope** | Headlines, wordmark, cifras |
| Body | **Manrope** | Texto corrido, subtítulos, etiquetas de píldoras, CTA |
| Utility | **Geist Mono** | Eyebrows, labels, links de nav, contadores, cotas, unidades |

Son las dos únicas familias del sitio. **Satoshi e Inter ya no se usan**: los nueve mockups
aprobados de la HOME están tipografiados en Manrope + Geist Mono.

Pesos cargados: Manrope 400, 700 y 800; Geist Mono 400 y 500.

### Escala — regla crítica

**Los headlines van en Manrope 800.** Valores del plan, por familia de sección:

| Nivel | Dónde | Tamaño | Peso | Line-height | Tracking |
|---|---|---|---|---|---|
| Display XL | Hero (Sección 01) | 72 px | **800** | 1 | `-0.035em` |
| Display L | Narrativas (02, 03, 04) | 58–60 px | **800** | 1.02–1.04 | `-0.03 / -0.032em` |
| Display M | Comerciales (05, 06, 07) | 44–48 px | **800** | 1.05 | `-0.03em` |
| Cifra / dato | Datos y contadores | `clamp(3rem, 6vw, 5.5rem)` | **800** | 1 | `-0.04em` |

En las secciones comerciales el headline baja de tamaño porque el protagonista son las cards,
no el copy. El peso no baja: sigue en 800.

La mono lleva todas las lecturas técnicas: coordenadas, contadores, unidades, estados, labels.
Es lo que da la textura de instrumento.

- Eyebrow: Geist Mono 500, `0.7rem`, `letter-spacing .22em`, uppercase, color `--pink`.
  Excepción documentada: en la Sección 07 va en `--on-dark-2`, y en la 08 en `--ink-2`.
- Links de nav: Geist Mono, `0.66rem`, `letter-spacing .13em`, uppercase.
- Label: `0.6875rem`, peso 500, `letter-spacing 0.1em`, uppercase.
- Subtítulo / body: Manrope 400, `1.02rem`, line-height 1.5–1.55. Body L: `1.125rem`.
- Wordmark "velocentum": Manrope 800, `1.22rem`, en minúscula.
- Etiquetas de píldoras y CTA: Manrope 700.
- Medida de lectura: 44–54ch en los subtítulos del plan; nunca párrafos a todo el ancho
  del viewport.
- Mayúsculas solo en eyebrows y labels.

**Nada de texto tipografiado dentro de un SVG en producción.** Si la fuente no carga a tiempo,
el SVG cae a Arial y rompe la tipografía del sitio. Los SVG maestros con texto embebido
(por ejemplo los CTA de `official/cta/`) son referencia visual; el render va en HTML/CSS.

---

## Spacing y layout

Escala: `4 8 12 16 24 32 48 64 96 128 192`.

- Contenedor: `max-width 1440px`, padding lateral `clamp(20px, 5vw, 80px)`.
- Entre secciones: `128px` desktop / `80px` mobile.
- Radius disponibles: `6 10 12 14 20 28 9999`. Cards grandes `28px`, botones `9999px`, inputs `12px`.
- Breakpoints: `640 / 768 / 1024 / 1280 / 1536`. El corte desktop/mobile de las animaciones es `900px`.

---

## Principio de animación

Todo motion debe **explicar, guiar o transformar una idea**. Un gesto principal + un apoyo
secundario por escena, máximo. Nada de loops infinitos de flotación o giro decorativos.

## Motor de scroll

Existe `src/hooks/useScrollEngine.ts`. **Es la única fuente de scroll del sitio.**
Nunca agregues un listener de `scroll` propio.

Exporta: `getScrollEngine`, `useScrollSubscription`, `useScrollRange`, `lerp`, `LERP_FACTOR`.

### Reglas no negociables

1. **Ninguna lectura de layout dentro del scroll ni del rAF.** `offsetTop`, `scrollHeight`,
   `clientWidth`, `scrollWidth`, `getBoundingClientRect` se leen al montar y en resize, y se cachean en un ref.
2. **Solo se animan `transform` y `opacity`.** Nunca `height`, `width`, `top`, `left`.
   Para barras de progreso: `transform: scaleX()` con `transform-origin: left`.
3. **Nada de `setState` de React durante el scroll.** Aplicá cambios por DOM directo:
   `element.style.transform`, `classList.toggle`, `textContent`. Un `setState` por frame
   re-renderiza el árbol 60 veces por segundo.
4. **Todo rAF propio debe dormirse.** Cuando el valor llega a destino, cancelá el loop y ponelo
   en `null`. Al despertar, chequeá que no haya otro corriendo.
5. **`useScrollRange` en elementos visibles al cargar** (como el hero) necesita
   `{ start: 0, end: 0 }`, porque el rango por defecto asume que el elemento entra desde abajo
   del viewport y arranca en un progreso distinto de cero.
6. **Lerp con factor `0.12`** para todo lo que se desplace con el scroll. Es lo que da la
   sensación de peso. Excepción: las transformaciones narrativas de ensamble interpolan directo
   desde el progreso, sin lerp. El ensamble aprobado es la reconstrucción del **Crystal 5** en la
   Sección 09 — Empecemos; el plan exige que ocurra **una sola vez** y que no se repita al
   scrollear hacia arriba, así que el estado final se retiene en vez de revertirse.

### prefers-reduced-motion

Siempre respetado. Ojo: un bloque global de `prefers-reduced-motion` que anula
`transition-duration` **no anula `transition-delay`**. Si usás delays en una secuencia de carga,
necesitás un override específico que los ponga en cero, o el usuario ve elementos invisibles
hasta que vencen los delays.

---

## Objeto narrativo e identidad

**Son dos cosas distintas y no se mezclan.** La regla vive en `docs/DESIGN_SYSTEM_CRYSTAL.txt`,
sección 2.

### CrystalFiveApproved — el objeto narrativo

`src/components/brand/CrystalFiveApproved.tsx`. **Es el objeto narrativo de la HOME nueva** y el
único que explota, se desplaza y se reconstruye.

- viewBox `0 0 240 184`. Silueta ancha, dos cuerpos cristalinos conectados.
- 18 facetas (`FACETS`) + 7 inclusiones (`INCLUSIONS`), con sus aristas y su glow.
- Materiales LIGHT / HOT / ROSE / GRAPHITE / DEEP / GLASS, definidos en
  `docs/DESIGN_SYSTEM_CRYSTAL.txt` sección 3.
- Maestros estáticos: `official/narrative/crystal-five-approved.svg` y
  `official/narrative/crystal-five-fragments-volumetric-approved.svg`.
- **Fragmento guía: `FACETS[15]` con `INCLUSIONS[6]` adherida.** Recorre la HOME entera de forma
  continua y nunca se teletransporta entre secciones.
- **Nunca reemplaza al isotipo del logotipo.** No se aproxima su silueta a la V, no se cambian
  facetas y no se modifican proporciones.
- Gap conocido: todavía no expone API por faceta. Cuando se resuelva, tiene que ser una
  extensión **aditiva**, sin tocar geometría ni materiales.

### BrandLogoMark — la identidad

`src/components/brand/BrandLogoMark.tsx`, que sirve
`official/identity/isotipo-approved.svg`. Es el isotipo vertical aprobado.

- Uso: navegación, firma, lockup y avatar.
- **No explota, no se fragmenta y no recorre la HOME.**
- En el nav va a 36 px de alto. Pendiente conocido: probar su legibilidad a 16, 24 y 32 px antes
  de que el nav entre a producción, posiblemente con una variante simplificada.

### CrystalV — legado

`src/components/brand/CrystalV.tsx`. **No se usa para implementar la HOME nueva.** Se conserva
por compatibilidad: las piezas V3 de main todavía dependen de él (`sequenceA/`, `sequenceB/`,
`Hero`, `RevealSection`, `Nav`, `Servicios`, `Contacto`, `crystalVMotion.ts`).

**No borrarlo ni modificarlo.** Su limpieza ocurre cuando esas piezas se retiren, no antes.

### Técnica de embebido de SVG (vale para los tres)

- **No aproximes ni redibujes los puntos de los polígonos.** Son los del asset aprobado, tal cual.
- Cada faceta va envuelta en su propio `<g>` para animarse individualmente sin tocar su `points`.
- Los gradientes usan `gradientUnits="userSpaceOnUse"` con coordenadas absolutas. Sin eso, cada
  mitad calcula su propio gradiente y se ve un salto de color en la costura.
- Los IDs de `defs` se generan con `useId()` y se sanitizan antes de usarse dentro de `url(#...)`
  (los dos puntos que agrega React en el id no son válidos ahí sin escapar).
- Al embeber varios SVG en la misma página, **renombrar únicamente los IDs de `defs` necesarios**
  para evitar colisiones (`glass`, `beam`, `g`, `gl`, `front`, `side`, `top`, `inner`, `core`,
  `glow`). No se toca nada más del asset.

---

## Copy y marca

- Español rioplatense, voseo. "Reservá", no "Reserva". "Agendá", no "Agenda".
- **Nunca uses la palabra "tienda".** El sitio habla de "negocio", que es más amplio.
- **No mostrar fotos del equipo por ahora.** La idea de "equipo completo" se comunica con el
  copy, la integración de capacidades (píldoras, fragmentos) y el sistema visual — no con
  fotografía.
- **Sin emojis** en interfaz ni en copy.
- Sin social proof de volumen ("más de X clientes").
- Sin escasez fabricada, countdowns ni urgencia inventada.
- Sin muletillas tipo "sin compromiso", "sin humo", "sin vueltas".
- No inventes copy. Si falta texto, pedilo; no lo completes con placeholders plausibles.
- No inventes cifras de resultados de clientes bajo ninguna circunstancia.

Posicionamiento: **"Estamos en el negocio de hacer crecer negocios."** Velocentum es un equipo
de crecimiento; el diferencial es medición y criterio integrando capacidades, no la venta de un
servicio puntual ni el volumen de gente o de producción.

---

## Quality floor

No se anuncia, se cumple, en todo lo que se construya:

- Responsive real desde 320px.
- Focus visible en todo elemento interactivo: `outline 2px --pink`, offset 2px.
- Navegación completa por teclado.
- `prefers-reduced-motion` respetado.
- Videos con `poster`, `preload="none"` y lazy loading por IntersectionObserver.
  **Solo uno reproduce a la vez.** Varios `<video>` decodificando en paralelo funden un teléfono de gama media.
- Imágenes en WebP con `width` y `height` declarados, para evitar layout shift.
- El LCP no debe depender de un video ni de una animación.
- Navegación entre rutas siempre con `<Link>` de TanStack Router, nunca `<a href>`
  (un `<a>` fuerza recarga completa de la página).
- Anclas a otra ruta: `<Link to="/" hash="seccion">`, no `<a href="/#seccion">`.

---

## Restricciones de dependencias

**No agregues librerías de animación.** Nada de GSAP, Framer Motion, Motion One, Lenis,
anime.js, react-spring. El motor propio cubre todo lo que necesitamos y mantiene el bundle chico.

Si una tarea parece necesitar una librería, primero explicá por qué el motor propio no alcanza
y esperá confirmación.

---

## Al terminar cualquier tarea

Reporte de 10 líneas o menos:
- Commit hash
- Archivos creados y modificados
- Qué se encontró y se corrigió, si algo
- Qué quedó pendiente o dudoso
- Si algo de la especificación no se pudo cumplir tal cual, y qué se hizo en su lugar

Verificá en el navegador antes de reportar, no solo por lectura de código.
`tsc` y `eslint` limpios en los archivos tocados.
