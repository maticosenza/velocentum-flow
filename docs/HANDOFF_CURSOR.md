# Handoff para Cursor — velocentum.com HOME

## Cómo abrir

Abrir la carpeta `/Users/maticosenza/velocentum-flow-integracion`.
No clonar de nuevo ni crear otro worktree.

Rama: `integracion/home-desktop`. Dependencias ya instaladas con
`bun install --frozen-lockfile`. Usar siempre `bun`, nunca npm ni npx.

## Estado

- Rama `integracion/home-desktop`, nacida de `origin/main`, con el material
  aprobado de la HOME desktop integrado por merge `3f31093`.
- `main` permanece en `a2dc171` y no se toca.
- `rebuild/home-cinematic` permanece congelado en `b77ce29` como respaldo. No se
  trabaja ahí y su material no trackeado no viaja.
- Los nueve mockups desktop están aprobados y cerrados: PNG y HTML en
  `docs/home-mockups/`, uno por sección 01–09.
- La fase de diseño desktop está cerrada. **La implementación NO empezó.**

## Qué leer, en este orden

1. `AGENTS.md` — jerarquía de fuentes y reglas operativas. Es lo primero.
2. `docs/PLAN_MAIN_HOME.txt` — completo. Fuente de verdad visual y narrativa.
3. `.claude/skills/velocentum-design/SKILL.md` — reglas técnicas detalladas de
   animación, motor de scroll, quality floor, dependencias y accesibilidad.
   **Es Markdown y hay que abrirlo y leerlo como tal:** Cursor no carga skills
   de Claude automáticamente, así que nadie lo va a inyectar por vos.
4. `docs/DESIGN_SYSTEM_CRYSTAL.txt` — antes de tocar cualquier SVG.
5. `public/brand-approved/ASSET_MANIFEST.txt` y
   `public/brand-approved/official/ASSETS_CONFIRMADOS.txt`
6. El PNG y el HTML de la sección a trabajar. El HTML tiene capas de anotación
   que el PNG no muestra: se abren en el navegador y se prenden los botones.
7. `docs/REPOSITORY_HANDOFF.txt` — relación entre ramas y worktrees.

NO leer `docs/AUDITORIA_WORKTREES.txt` como estado actual: es histórico, su
sección de Git ya no es válida.

## BASELINE CONOCIDO DE TYPESCRIPT — 49fc3dc

`bun x tsc --noEmit` falla hoy con **22 errores**. Son errores REALES de
TypeScript, PREEXISTENTES, heredados del código V3 y no introducidos por el
trabajo actual:

- **11** en `src/components/brand/CrystalFiveApproved.tsx`
- **8** en `src/components/brand/CrystalFragments.tsx`
- **3** en `src/routes/crystal-review.tsx`

Criterio: ningún trabajo debe SUMAR errores nuevos ni distintos respecto de
estos 22. Si aparece uno nuevo, es del cambio en curso.

**EL BASELINE ESTÁ ASOCIADO AL COMMIT `49fc3dc`.** Cuando un trabajo aprobado
reduzca intencionalmente estos errores, `AGENTS.md` y `docs/HANDOFF_CURSOR.md`
deben actualizarse EN EL MISMO COMMIT con el nuevo conteo. Nunca dejar un
baseline obsoleto.

Los 19 de `CrystalFiveApproved` y `CrystalFragments` se resuelven JUNTO CON la
API por faceta, no antes ni por separado, porque son índices posiblemente
`undefined` bajo tipado estricto en las mismas estructuras que la API va a
exponer. Los 3 de `crystal-review` no se tocan, salvo que la API obligue a
actualizar únicamente su consumo.

## Primer trabajo: infraestructura del Crystal 5

ANTES de implementar cualquier sección.

**Objetivo:** agregar de forma ADITIVA una API por faceta a
`CrystalFiveApproved.tsx` que permita animar cada polígono por separado, y
resolver en el mismo trabajo los 19 errores de tipado de ese archivo y de
`CrystalFragments.tsx`.

**Restricciones:**

- Preservar EXACTAMENTE geometría, materiales, facetas, inclusiones, orden
  visual y estado renderizado por defecto.
- **LA API ADITIVA NO DEBE AGREGAR WRAPPERS, ATRIBUTOS NI ESTILOS AL DOM POR
  DEFECTO SI NO SE PASAN LAS PROPS NUEVAS.** El componente sin props nuevas debe
  producir un DOM idéntico, byte a byte, al de `49fc3dc`.
- `FACETS[15]` con `INCLUSIONS[6]` sigue siendo el fragmento guía.
- NO implementar todavía la explosión, el Hero ni la Sección 09.
- NO tocar los 3 errores de `crystal-review` salvo que la API exija actualizar
  solo su consumo.

**Procedimiento obligatorio:**

1. **PROPONER PRIMERO el contrato de la API:** qué props se agregan, cómo se
   identifica cada faceta e inclusión, cómo se pasa una pose, y qué pasa cuando
   no se pasa nada.
2. **PROPONER las TRES VERIFICACIONES OBLIGATORIAS del render por defecto.** Las
   tres son requeridas; el DOM serializado solo no alcanza:
   a. **DOM SERIALIZADO** del componente aislado, sin props nuevas, comparado
      byte a byte contra la versión de `49fc3dc`, usando el mismo harness en
      ambos lados.
   b. **COMPARACIÓN O HASH** de `FACETS`, `INCLUSIONS`, materiales, opacidades
      base, paths de aristas y `defs`, para demostrar que ningún dato visual
      cambió.
   c. **CAPTURA VISUAL FIJA** del estado por defecto antes y después, con pixel
      diff cero, o explicación auditada de cualquier diferencia.
3. **Esperar aprobación explícita** del contrato y de las tres verificaciones.
4. **RECIÉN ENTONCES implementar.**

## Frentes abiertos, con su tipo de bloqueo

- **API por faceta de `CrystalFiveApproved`** — BLOQUEA LA IMPLEMENTACIÓN
  DESKTOP. Es el primer trabajo.
- **Destino real del formulario** — BLOQUEA PUBLICACIÓN. `handleSubmit` es hoy
  un `preventDefault()` vacío; no hay backend, endpoint, email, WhatsApp ni
  agenda. Es decisión del dueño del proyecto, no de un agente.
- **Verificación de los 13 playback IDs de Mux** contra categoría, acción,
  poster real, orden y posición de las cards editoriales — BLOQUEA PUBLICACIÓN.
  Detalle en la Sección 07 del plan.
- **Responsive y mobile:** mockups y especificación de las nueve secciones —
  BLOQUEA PUBLICACIÓN. No bloquea la implementación desktop.
- **Variante simplificada del isotipo para tamaños chicos** — GATE DE
  ACEPTACIÓN PREVIO A PRODUCCIÓN: si el isotipo falla el test de legibilidad a
  16, 24 y 32 px, BLOQUEA LA PUBLICACIÓN DEL NAV.

## Cómo se trabaja

Una sección por vez, empezando por la que corresponda después de la
infraestructura. Cada bloque se entrega para auditoría antes de seguir.

Ante cualquier ambigüedad: preguntar, no completar con criterio propio.

## Referencias visuales no vinculantes

`docs/REFERENCIAS_VISUALES.md` registra tres sitios como material de
inspiración para las **futuras páginas Método y Casos**.

- **NO forma parte del orden obligatorio de lectura para la primera tarea.**
- **NO modifica la HOME aprobada:** `docs/PLAN_MAIN_HOME.txt` y sus nueve
  mockups desktop siguen siendo la autoridad, y las referencias no autorizan
  copiar diseño, código, contenido ni assets.
- Método y Casos necesitan planes y mockups propios antes de implementarse.

**La primera tarea de Cursor sigue siendo proponer el contrato de la API por
faceta y sus verificaciones antes de escribir código**, como se detalla más
arriba en "Primer trabajo: infraestructura del Crystal 5".
