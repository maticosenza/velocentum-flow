# Velocentum Flow

Proyecto: sitio de marca de Velocentum (velocentum.com). Agencia de marketing de performance en Argentina.

Este primer mensaje es SOLO la fundación: tokens, tipografía, utilities de animación, motor de scroll y rutas vacías. NO crear contenido, secciones, ni componentes de landing todavía. No inventes copy ni secciones de ejemplo.

## 1. Tokens de color

En el CSS global, definir estas variables exactas:

Escala clara (heredada del sitio hermano):
--background: #FFFFFF
--surface: #F7F7FB
--surface-2: #F0EFFC
--ink: #0F0A2E
--ink-2: #6B6880
--border: #E8E7F2
--border-hairline: rgba(15,10,46,0.08)

Escala oscura (nueva, es la dominante en este sitio):
--ink-deep: #0B0722
--ink-deep-2: #151034
--on-dark: #F7F7FB
--on-dark-2: #9A96B4
--border-dark: rgba(255,255,255,0.10)

Marca:
--brand: #2A1EC9
--violet: #7B5CFF

El fondo por defecto del sitio es --ink-deep (#0B0722), no blanco.

Radius: 6, 10, 12, 14, 20, 28, 9999.

## 2. Tipografía

Tres familias con roles distintos:
- Display: "Satoshi" (cargar desde https://api.fontshare.com/v2/css?f[]=satoshi@500,600,700,800&display=swap), fallback Inter
- Body: "Inter" (Google Fonts, pesos 400/500/600)
- Utility/mono: "Geist Mono" (Google Fonts, pesos 400/500)

Escala de display (IMPORTANTE, es distinta de lo habitual):
- Display XL: clamp(2.75rem, 7vw, 6.5rem), peso 500, letter-spacing -0.03em, line-height 0.98
- Display L: clamp(2rem, 4.5vw, 4rem), peso 500, letter-spacing -0.028em, line-height 1.02
- Display M: clamp(1.5rem, 2.6vw, 2.25rem), peso 600, letter-spacing -0.02em, line-height 1.1
- Cifra/dato: clamp(3rem, 6vw, 5.5rem), peso 800, letter-spacing -0.04em

El peso 800 se reserva EXCLUSIVAMENTE para cifras y datos numéricos. Los títulos grandes van en peso 500. Esto es deliberado, no lo "corrijas" a peso bold.

Body: 1rem/1.5. Body L: 1.125rem.
Eyebrow (mono): 0.75rem, peso 500, letter-spacing 0.12em, uppercase.
Label (mono): 0.6875rem, peso 500, letter-spacing 0.1em, uppercase.

## 3. Spacing y grid

Escala: 4 8 12 16 24 32 48 64 96 128 192.
Contenedor: max-width 1440px, padding lateral clamp(20px, 5vw, 80px).
Separación entre secciones: 128px desktop / 80px mobile.

## 4. Motor de scroll (importante para performance)

Crear un hook `useScrollEngine` que sea la ÚNICA fuente de scroll del sitio. Requisitos estrictos:
- Un solo requestAnimationFrame loop global.
- El listener de 'scroll' es passive y solo marca un flag booleano. Nunca hace lecturas de layout.
- Las medidas de layout (offsetTop, scrollHeight, clientWidth, scrollWidth) se cachean al montar y en resize, NUNCA se leen dentro del scroll ni del rAF.
- Solo se animan propiedades transform y opacity. Nunca height, width, top o left.
- Exponer progreso global de scroll (0 a 1) y permitir registrar elementos que necesiten progreso propio dentro de un rango.
- Incluir una función de lerp para suavizado (factor 0.12) para elementos que se desplazan con el scroll.
- Respetar prefers-reduced-motion: sin lerp, sin parallax.

## 5. Utilities de animación

- Reveal por IntersectionObserver: opacity 0→1 y translate3d(0,16px,0)→0, duración 600ms, easing cubic-bezier(0.22,1,0.36,1), threshold 0.15, rootMargin "0px 0px -60px 0px", se dispara una sola vez.
- Marquee horizontal infinito con transform translate3d, pausa en hover, con variante de dirección invertida.
- Curvas nombradas: ease-out-soft cubic-bezier(0.22,1,0.36,1), ease-in-out-firm cubic-bezier(0.65,0,0.35,1).
- Duraciones: micro-interacción 150ms, reveal 600ms, transición de sección 800ms, stagger 60ms.

## 6. Componente ScrollAxis (eje de medición)

Componente reutilizable, es el elemento visual característico del sitio:
- Línea vertical de 1px fija en el margen izquierdo (left 26px), altura 100vh, color rgba(123,92,255,0.18).
- El tramo recorrido se pinta en #7B5CFF usando transform scaleY con transform-origin top (NO cambiar height).
- Marcas de graduación con labels en Geist Mono, 9px, uppercase, letter-spacing 0.1em, color rgba(154,150,180,0.55). Los labels se pasan por props.
- En viewport menor a 900px: colapsa a una barra de 2px pegada al borde izquierdo, sin ticks ni labels.
- Con prefers-reduced-motion se pinta completo sin animar.

## 7. Rutas

Crear tres rutas vacías, solo con el layout base y un h1 placeholder cada una:
- / (home)
- /metodo
- /casos

## 8. Head

En el root: cargar las tres fuentes con preconnect, e instalar el pixel de Meta con ID 2805656409567924 (script estándar de Meta Pixel con PageView).

## 9. Calidad base

- Responsive desde 320px. Breakpoints 640 / 768 / 1024 / 1280 / 1536.
- Focus visible en todo elemento interactivo: outline 2px #7B5CFF, offset 2px.
- prefers-reduced-motion respetado en todas las animaciones.

No agregues librerías de animación externas (GSAP, Framer Motion, Lenis) en este paso. El motor propio cubre lo que necesitamos por ahora.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aabf2ced-4641-4894-b1ba-8cfde6497a44).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
