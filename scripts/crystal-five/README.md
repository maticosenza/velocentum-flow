# Harness de verificación de CrystalFiveApproved

Prueba que la API por faceta es aditiva: sin `control`, el componente renderiza
exactamente lo mismo que en el commit `49fc3dc79a0a09761004fecaf5adfb676284e705`.

## Cómo correr todo

```bash
bun run scripts/crystal-five/verify.ts             # (a) DOM byte a byte + (b) hash de datos visuales
bun run scripts/crystal-five/verify-contract.ts    # contrato de la API en runtime
bun run scripts/crystal-five/verify-neighbors.ts   # los dos componentes vecinos no se movieron
bun x tsc --noEmit -p scripts/crystal-five/tsconfig.contract.json   # exclusión por tipo de las claves 15 y 6

bun run scripts/crystal-five/build-visual-fixtures.ts
bun x playwright test -c scripts/crystal-five/playwright.config.ts  # (c) pixel diff cero
```

Regenerar los artefactos de baseline (sale del commit, no del working tree):

```bash
bun run scripts/crystal-five/capture-baseline.ts
```

## Artefactos

| archivo                              | qué es                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `artifacts/baseline-commit.txt`      | el commit al que está anclado el baseline                               |
| `artifacts/baseline-dom.html`        | `renderToStaticMarkup` del componente de 49fc3dc, sin `control`         |
| `artifacts/baseline-dom.sha256`      | `shasum -a 256` del archivo anterior                                    |
| `artifacts/baseline-geometry.json`   | datos visuales canónicos extraídos de ese DOM                           |
| `artifacts/baseline-geometry.sha256` | `shasum -a 256` del archivo anterior                                    |
| `artifacts/visual-fixture.html`      | página de captura del baseline: viewport y fondo fijos, sin animaciones |

`baseline/` y `artifacts/fixture-*.html` son derivados regenerables y no se versionan.

## Auditoría del harness heredado

Los artefactos llegaron de otra herramienta sin trackear. De los ocho archivos:

**Reutilizados** (se demostró que corresponden a 49fc3dc): `baseline-commit.txt`,
`baseline-dom.html`, `baseline-dom.sha256` y `visual-fixture.html`. El DOM heredado
resultó byte a byte igual al render del componente materializado desde ese commit, y
su hash guardado reproduce el `shasum` del archivo.

**Regenerados**, con el motivo:

1. `capture-baseline.ts` y `lib.ts` — reescritos. Tres defectos:
   - El baseline salía del **working tree**, no del commit. Funcionó por casualidad
     (el archivo no había cambiado entre 49fc3dc y HEAD), pero correr ese script
     después de tocar `src/` producía un espejo del código nuevo, no una referencia.
   - Los datos visuales se extraían del **texto fuente** con regex más un parche
     JSON (`.replace(/(\w+):/g, '"$1":')`). Ese extractor depende de la sintaxis del
     `.tsx` (posición de `const FACETS`, el primer `fill="none"` del archivo, el
     formato exacto del JSX): al agregar tuplas, `as const` y la rama con control se
     rompe y reporta un fallo que no existe. Ahora los datos se extraen del **DOM
     renderizado**, con un parser que falla si queda un solo byte del markup sin
     cubrir.
   - `hashGeometry` hasheaba la serialización compacta en memoria mientras el archivo
     se escribía indentado, así que el `.sha256` **no correspondía al contenido** del
     `.json`. Comprobado: el archivo hashea `1c017222…` y el `.sha256` decía
     `e2089484…`. Hoy todo hash publicado es el del archivo tal como está en disco.
2. `baseline-geometry.json` y `baseline-geometry.sha256` — consecuencia de lo anterior.
   Los datos heredados eran correctos (18 facetas, 7 inclusiones, 25 stops, 4 aristas),
   pero no reproducibles tras el refactor y con el hash inconsistente.
