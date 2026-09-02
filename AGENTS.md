# AGENTS.md — Velocentum

Reglas operativas obligatorias del repositorio. Se leen antes de tocar cualquier
archivo.

Las reglas técnicas detalladas del design system están en
`.claude/skills/velocentum-design/SKILL.md`. Ese skill es **complementario** y no
reemplaza al plan.

---

## Jerarquía de fuentes

`docs/PLAN_MAIN_HOME.txt` es la **fuente de verdad** para:

- composición;
- copy aprobado;
- CTA;
- tipografía;
- geometría;
- narrativa;
- movimiento.

Las siguientes fuentes funcionales mandan **únicamente sobre los datos
enumerados**:

| Fuente funcional | Manda solamente sobre |
|---|---|
| `src/components/sections/Contacto.tsx` | campos, labels y `required` del formulario |
| `src/components/sections/Servicios.tsx` | capacidades y nombres |
| `src/components/sections/Clientes.tsx` | clientes y logos |
| `src/components/sections/Trabajos.tsx` | playback IDs, categorías, acciones y tags |

Fuera de esos datos enumerados manda PLAN_MAIN_HOME. Si existe una discrepancia
**dentro** de esos datos, conservar la fuente funcional y reportarla.

---

## Orden de lectura obligatorio

Este archivo, `AGENTS.md`, se lee primero. Después, en este orden:

1. `docs/HANDOFF_CURSOR.md` — estado, baseline y primer trabajo.
2. `docs/PLAN_MAIN_HOME.txt` — completo y fuente de verdad.
3. `.claude/skills/velocentum-design/SKILL.md` — reglas técnicas detalladas de
   animación, motor de scroll, quality floor, dependencias y accesibilidad.
   **Cursor debe leerlo como Markdown**, aunque no cargue skills de Claude
   automáticamente.
4. `docs/DESIGN_SYSTEM_CRYSTAL.txt`, antes de tocar cualquier SVG.
5. `public/brand-approved/ASSET_MANIFEST.txt` y
   `public/brand-approved/official/ASSETS_CONFIRMADOS.txt`.
6. PNG y HTML aprobados de la sección a implementar. **El HTML contiene capas de
   anotación ausentes en el PNG.**
7. `docs/REPOSITORY_HANDOFF.txt`.

`docs/AUDITORIA_WORKTREES.txt` es un documento **histórico** y no debe leerse
como estado Git actual.

---

## Reglas operativas

1. **El objeto narrativo de la HOME nueva es `CrystalFiveApproved.tsx`.**
   `CrystalV` no se usa para implementar la HOME nueva, pero se conserva
   temporalmente porque `sequenceA/` y otras piezas V3 de main todavía pueden
   depender de él: no borrarlo ni modificarlo durante el saneamiento.
   La identidad es `BrandLogoMark`. No explota, no se fragmenta y no recorre
   la HOME.

2. **No cambiar geometría, materiales, colores ni opacidades BASE de los SVG
   aprobados.** Sí está permitido animar `opacity` y `transform` de grupos o
   wrappers cuando el plan lo exige. Al embeber varios SVG, renombrar únicamente
   los IDs de `defs` necesarios para evitar colisiones.

3. **Implementar únicamente secciones con bloque `MOCKUP APROBADO`**, una por vez
   y con auditoría posterior.

4. **No rediseñar durante la implementación.** Ante una ambigüedad, preguntar.

5. Las rotaciones calculadas de **-138.3°** en la Sección 04 y **-46.5°** en la
   Sección 05 deben **recalcularse** si cambia posición, tamaño o destino.

6. **Una sola explosión, en el Hero. Una sola reconstrucción, en Empecemos.**
   El fragmento guía es `FACETS[15]` con `INCLUSIONS[6]` adherida. Su recorrido
   es continuo y nunca se teletransporta entre secciones.

7. **`useScrollEngine` es la única fuente de scroll.** Un solo rAF global, sin
   lecturas de layout durante el scroll y usando `transform` y `opacity` para
   el movimiento.

8. **No agregar GSAP, Framer Motion, Lenis, Motion One, anime.js ni
   react-spring.**

9. **La navegación INTERNA usa `Link` de TanStack Router, nunca un `<a href>`
   interno.** `BrandCTA` ya renderiza un `Link` internamente: se le pasan `to` y
   `hash` directamente y nunca se envuelve dentro de otro `Link`. Los enlaces
   externos reales pueden usar `<a>` con sus atributos de seguridad
   correspondientes.

10. **Respetar reduced motion en las nueve secciones.** Ningún contenido esencial
    puede depender de una animación.

11. **No inventar copy, cifras, clientes, endpoints ni assets.**

12. **El repositorio sincroniza con Lovable.** No hacer force push, rebase, amend
    ni squash sobre commits publicados.

---

## BASELINE CONOCIDO DE TYPESCRIPT — 49fc3dc

`bun x tsc --noEmit` falla con **22 errores REALES de TypeScript,
PREEXISTENTES**, heredados del código V3 y no introducidos por el trabajo
actual:

- **11** en `src/components/brand/CrystalFiveApproved.tsx`
- **8** en `src/components/brand/CrystalFragments.tsx`
- **3** en `src/routes/crystal-review.tsx`

Ningún cambio debe **SUMAR errores nuevos ni distintos** respecto de esos 22.
Si aparece uno nuevo, es del cambio en curso.

**EL BASELINE ESTÁ ASOCIADO AL COMMIT `49fc3dc`.** Cuando un trabajo aprobado
reduzca intencionalmente estos errores, `AGENTS.md` y `docs/HANDOFF_CURSOR.md`
deben actualizarse **EN EL MISMO COMMIT** con el nuevo conteo. Nunca dejar un
baseline obsoleto.

Los 19 de `CrystalFiveApproved` y `CrystalFragments` se resuelven **junto con la
API por faceta**, no antes ni por separado.

Detalle completo en `docs/HANDOFF_CURSOR.md`.

---

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
