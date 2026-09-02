/**
 * Verificaciones (a) DOM serializado y (b) hash de datos visuales.
 *
 * (a) El componente actual SIN control debe renderizar los mismos bytes que el
 *     componente de 49fc3dc. Mismo proceso, mismo React, mismo useId.
 * (b) Los datos visuales extraídos del DOM (facetas, inclusiones, defs, glow, suelo,
 *     aristas y opacidades base de stroke) deben hashear igual que el baseline.
 *
 * Además se comprueba, cuando el componente lo soporta, que el modo controlado con
 * poses identidad conserve exactamente los mismos datos visuales y el mismo orden de
 * pintura, con las 25 piezas presentes en el árbol.
 */
import { readFileSync } from "node:fs";
import { CrystalFiveApproved } from "../../src/components/brand/CrystalFiveApproved.tsx";
import {
  ARTIFACT_FILES,
  BASELINE_COMMIT,
  canonicalJson,
  extractVisualData,
  parseSvg,
  renderMarkup,
  sha256,
  walk,
} from "./lib.ts";

type Result = { name: string; ok: boolean; detail: string };
const results: Result[] = [];
const record = (name: string, ok: boolean, detail: string) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}\n      ${detail.split("\n").join("\n      ")}`);
};

// --- (a) DOM serializado -----------------------------------------------------
const baselineDom = readFileSync(ARTIFACT_FILES.dom, "utf8");
const currentDom = renderMarkup(CrystalFiveApproved);

let firstDiff = -1;
const limit = Math.max(baselineDom.length, currentDom.length);
for (let i = 0; i < limit; i += 1) {
  if (baselineDom[i] !== currentDom[i]) {
    firstDiff = i;
    break;
  }
}
record(
  `(a) DOM sin control idéntico a ${BASELINE_COMMIT.slice(0, 7)}`,
  firstDiff === -1,
  firstDiff === -1
    ? `${currentDom.length} bytes, sha256 ${sha256(currentDom)}`
    : `primera diferencia en el byte ${firstDiff}\n  baseline: ${JSON.stringify(baselineDom.slice(firstDiff - 40, firstDiff + 80))}\n  actual  : ${JSON.stringify(currentDom.slice(firstDiff - 40, firstDiff + 80))}`,
);

// Invariantes estructurales del modo sin control.
const svgSinControl = parseSvg(currentDom);
const nodos = walk(svgSinControl);
const gruposExtra = nodos.filter((n) => n.tag === "g").length;
const conData = nodos.filter((n) => Object.keys(n.attrs).some((k) => k.startsWith("data-"))).length;
const conStyle = nodos.filter((n) => n.attrs["style"] !== undefined).length;
const conTransform = nodos.filter((n) => n.attrs["transform"] !== undefined).length;
record(
  "(a) sin control: 2 grupos, cero data-*, cero style, cero transform",
  gruposExtra === 2 && conData === 0 && conStyle === 0 && conTransform === 0,
  `grupos=${gruposExtra} data-*=${conData} style=${conStyle} transform=${conTransform}`,
);

// --- (b) Hash de datos visuales ---------------------------------------------
const baselineGeometry = readFileSync(ARTIFACT_FILES.geometry, "utf8");
const baselineGeometryHash = readFileSync(ARTIFACT_FILES.geometryHash, "utf8").trim();
const currentGeometry = canonicalJson(extractVisualData(currentDom));
const currentGeometryHash = sha256(currentGeometry);

record(
  "(b) hash de datos visuales",
  currentGeometry === baselineGeometry && currentGeometryHash === baselineGeometryHash,
  currentGeometry === baselineGeometry
    ? `sha256 ${currentGeometryHash} == baseline`
    : `baseline ${baselineGeometryHash}\n  actual   ${currentGeometryHash}`,
);

// --- Modo controlado con poses identidad ------------------------------------
const controlledDom = renderMarkup(CrystalFiveApproved, { control: {} });

if (controlledDom !== currentDom) {
  const controlledVisual = extractVisualData(controlledDom);
  const baselineVisual = JSON.parse(baselineGeometry) as ReturnType<typeof extractVisualData>;
  const controlledSvg = parseSvg(controlledDom);
  const controlledNodes = walk(controlledSvg);
  const wrappers = controlledNodes.filter(
    (n) => n.tag === "g" && n.attrs["transform"] !== undefined,
  );

  record(
    "control identidad: 25 wrappers de pieza presentes",
    wrappers.length === 25,
    `wrappers con transform = ${wrappers.length}`,
  );
  record(
    "control identidad: mismo orden de pintura",
    canonicalJson(controlledVisual.paintOrder) === canonicalJson(baselineVisual.paintOrder),
    controlledVisual.paintOrder.join(" "),
  );
  const sameAsset =
    canonicalJson(controlledVisual.facets) === canonicalJson(baselineVisual.facets) &&
    canonicalJson(controlledVisual.inclusions) === canonicalJson(baselineVisual.inclusions) &&
    canonicalJson(controlledVisual.defs) === canonicalJson(baselineVisual.defs) &&
    canonicalJson(controlledVisual.edgePaths) === canonicalJson(baselineVisual.edgePaths) &&
    controlledVisual.glow["d"] === baselineVisual.glow["d"] &&
    controlledVisual.ground["rx"] === baselineVisual.ground["rx"];
  record(
    "control identidad: datos del asset intactos",
    sameAsset,
    sameAsset
      ? "facetas, inclusiones, defs, aristas, glow y suelo sin cambios"
      : "hay divergencia en los datos del asset",
  );
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} verificaciones OK`);
if (failed.length > 0) {
  process.exit(1);
}
