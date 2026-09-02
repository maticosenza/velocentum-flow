/**
 * Regenera los artefactos de baseline desde el componente tal como está en 49fc3dc.
 *
 * No lee el working tree: materializa el .tsx del commit, verifica su blob sha y lo
 * renderiza. Correr esto después de modificar src/ vuelve a producir exactamente los
 * mismos bytes, porque la fuente es el commit y no el archivo actual.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import {
  ARTIFACTS_DIR,
  ARTIFACT_FILES,
  BASELINE_BLOB,
  BASELINE_COMMIT,
  canonicalJson,
  extractVisualData,
  materializeBaselineComponent,
  renderMarkup,
  sha256,
  visualFixtureHtml,
} from "./lib.ts";

const baselineFile = materializeBaselineComponent();
const mod = (await import(baselineFile)) as { CrystalFiveApproved: React.ComponentType<object> };

const markup = renderMarkup(mod.CrystalFiveApproved);
const visual = extractVisualData(markup);
const geometryJson = canonicalJson(visual);

mkdirSync(ARTIFACTS_DIR, { recursive: true });
writeFileSync(ARTIFACT_FILES.commit, `${BASELINE_COMMIT}\n`);
writeFileSync(ARTIFACT_FILES.dom, markup);
writeFileSync(ARTIFACT_FILES.domHash, `${sha256(markup)}\n`);
writeFileSync(ARTIFACT_FILES.geometry, geometryJson);
writeFileSync(ARTIFACT_FILES.geometryHash, `${sha256(geometryJson)}\n`);
writeFileSync(ARTIFACT_FILES.fixture, visualFixtureHtml(markup));

console.log(`baseline commit : ${BASELINE_COMMIT}`);
console.log(`baseline blob   : ${BASELINE_BLOB}`);
console.log(`dom bytes       : ${markup.length}`);
console.log(`dom sha256      : ${sha256(markup)}   (= sha256 del archivo baseline-dom.html)`);
console.log(`geometry sha256 : ${sha256(geometryJson)}   (= sha256 del archivo baseline-geometry.json)`);
console.log(`facetas         : ${visual.facets.length}`);
console.log(`inclusiones     : ${visual.inclusions.length}`);
console.log(`edge paths      : ${visual.edgePaths.length}`);
console.log(`defs            : ${visual.defs.length} nodos, ${visual.defs.reduce((n, d) => n + d.children.length, 0)} hijos`);
console.log(`orden de pintura: ${visual.paintOrder.join(" ")}`);
