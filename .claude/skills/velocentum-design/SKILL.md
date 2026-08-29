---
name: velocentum-design
description: Design system y reglas de construcción del sitio velocentum.com. Usar SIEMPRE que se cree o modifique cualquier componente, sección, página o estilo de este repositorio. Cubre tokens de color, escala tipográfica, spacing, reglas de animación y performance, geometría del isotipo, y las decisiones de marca que no se deben romper.
---

# Velocentum — design system

Sitio de marca de Velocentum, agencia de performance marketing en Argentina.
Stack: TanStack Start + React + TypeScript + Tailwind v4. Sincroniza con Lovable.

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
| `--ink-deep` | `#0B0722` | Fondo por defecto del sitio |
| `--ink-deep-2` | `#151034` | Cards y bloques sobre fondo oscuro |
| `--on-dark` | `#F7F7FB` | Texto principal sobre oscuro |
| `--on-dark-2` | `#9A96B4` | Texto secundario sobre oscuro |
| `--border-dark` | `rgba(255,255,255,0.10)` | Bordes sobre oscuro |

### Escala clara

| Token | Hex | Uso |
|---|---|---|
| `--surface` | `#F7F7FB` | Cards claras |
| `--surface-2` | `#F0EFFC` | Secciones claras |
| `--ink` | `#0F0A2E` | Texto sobre claro |
| `--ink-2` | `#6B6880` | Texto secundario sobre claro |
| `--border` | `#E8E7F2` | Bordes sobre claro |

### Marca

| Token | Hex | Uso |
|---|---|---|
| `--brand` | `#2A1EC9` | Botones sólidos, focus ring |
| `--violet` | `#7B5CFF` | Acento: flechas, links, eje de medición, labels |

### Reglas de color

- El fondo por defecto es `--ink-deep`, no blanco.
- `--violet` aparece solo en: flechas de CTA, links, eje de medición, labels de sección, elementos activos.
- `--brand` aparece solo en botones sólidos y focus ring.
- **Nada de gradientes decorativos de fondo ni glows difusos.** El único gradiente permitido es el del isotipo.
- **Nada de paletas multicolor.** Un color de acento por sección, siempre de la paleta.

---

## Tipografía

### Familias

| Rol | Familia | Dónde |
|---|---|---|
| Display | Satoshi | Títulos, cifras |
| Body | Inter | Texto corrido |
| Utility | Geist Mono | Eyebrows, labels, contadores, cotas, unidades |

### Escala — regla crítica

| Nivel | Tamaño | Peso | Tracking |
|---|---|---|---|
| Display XL | `clamp(2.75rem, 7vw, 6.5rem)` | **500** | `-0.03em` |
| Display L | `clamp(2rem, 4.5vw, 4rem)` | **500** | `-0.028em` |
| Display M | `clamp(1.5rem, 2.6vw, 2.25rem)` | **600** | `-0.02em` |
| Cifra / dato | `clamp(3rem, 6vw, 5.5rem)` | **800** | `-0.04em` |

**El peso 800 se usa EXCLUSIVAMENTE para cifras numéricas.** Los títulos grandes van en 500.
Esto es deliberado: el aire del sitio viene del peso liviano en tamaños grandes. Si te parece
que "falta contraste", está bien así. No lo cambies a bold.

La mono lleva todas las lecturas técnicas: coordenadas, contadores, unidades, estados, labels.
Es lo que da la textura de instrumento.

- Eyebrow: `0.75rem`, peso 500, `letter-spacing 0.12em`, uppercase.
- Label: `0.6875rem`, peso 500, `letter-spacing 0.1em`, uppercase.
- Body: `1rem`/1.5. Body L: `1.125rem`.
- Medida de lectura: 52–72 caracteres. Nunca párrafos a todo el ancho del viewport.
- Mayúsculas solo en eyebrows y labels.

---

## Spacing y layout

Escala: `4 8 12 16 24 32 48 64 96 128 192`.

- Contenedor: `max-width 1440px`, padding lateral `clamp(20px, 5vw, 80px)`.
- Entre secciones: `128px` desktop / `80px` mobile.
- Radius disponibles: `6 10 12 14 20 28 9999`. Cards grandes `28px`, botones `9999px`, inputs `12px`.
- Breakpoints: `640 / 768 / 1024 / 1280 / 1536`. El corte desktop/mobile de las animaciones es `900px`.

---

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
   sensación de peso.

### prefers-reduced-motion

Siempre respetado. Ojo: un bloque global de `prefers-reduced-motion` que anula
`transition-duration` **no anula `transition-delay`**. Si usás delays en una secuencia de carga,
necesitás un override específico que los ponga en cero, o el usuario ve elementos invisibles
hasta que vencen los delays.

---

## Isotipo

Un solo contorno continuo. La V interna es una entrada abierta desde el borde superior,
**no es un hueco cerrado**. No uses `fill-rule="evenodd"` con dos paths.

viewBox `0 0 100 87.6`:

```
M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 L 82.9 0 L 100 0 Z
```

Se parte en dos mitades por el eje `x = 49.8`:

```
Izquierda: M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 Z
Derecha:   M 49.65 58 L 82.9 0 L 100 0 L 49.65 87.6 Z
```

La derecha arranca en `49.65` y no en `49.8` para solapar 0.15 unidades y evitar una costura
de 1px por antialiasing.

Gradiente: `#F7F7FB` (0%) → `#7B5CFF` (55%) → `#2A1EC9` (100%), diagonal.
**Siempre con `gradientUnits="userSpaceOnUse"`** y coordenadas absolutas, para que sea continuo
a través de ambas mitades. Con el default (`objectBoundingBox`) cada mitad calcularía su propio
gradiente y se vería un salto de color.

---

## Copy y marca

- Español rioplatense, voseo. "Reservá", no "Reserva". "Agendá", no "Agenda".
- **Nunca uses la palabra "tienda".** El sitio habla de "negocio", que es más amplio.
- **Sin emojis** en interfaz ni en copy.
- Sin social proof de volumen ("más de X clientes").
- Sin escasez fabricada, countdowns ni urgencia inventada.
- Sin muletillas tipo "sin compromiso", "sin humo", "sin vueltas".
- No inventes copy. Si falta texto, pedilo; no lo completes con placeholders plausibles.
- No inventes cifras de resultados de clientes bajo ninguna circunstancia.

Posicionamiento: "crecimiento con control". El diferencial es medición y criterio, no cantidad
de gente ni volumen de producción.

---

## Quality floor

No se anuncia, se cumple, en todo lo que se construya:

- Responsive real desde 320px.
- Focus visible en todo elemento interactivo: `outline 2px --violet`, offset 2px.
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
