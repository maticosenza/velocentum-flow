/**
 * Genera los fixtures de la captura visual. Se corren en el mismo Chromium, mismo viewport
 * y mismo fondo; el markup se inyecta acá para que el test no tenga que transpilar TSX.
 *
 *   antes       -> componente de 49fc3dc, sin control
 *   despues     -> componente actual, sin control
 *   controlado  -> componente actual, control={{}} (25 wrappers en pose identidad)
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { CrystalFiveApproved } from "../../src/components/brand/CrystalFiveApproved.tsx";
import {
  ARTIFACTS_DIR,
  importBaselineCrystal,
  renderMarkup,
  sha256,
  visualFixtureHtml,
} from "./lib.ts";

const baseline = await importBaselineCrystal();

const targets = [
  { file: "fixture-antes.html", markup: renderMarkup(baseline.CrystalFiveApproved) },
  { file: "fixture-despues.html", markup: renderMarkup(CrystalFiveApproved) },
  { file: "fixture-controlado.html", markup: renderMarkup(CrystalFiveApproved, { control: {} }) },
  // Canario: una diferencia visual deliberada y mínima. Si el pixel diff no la detecta,
  // el cero de las otras comparaciones no significa nada.
  {
    file: "fixture-canario.html",
    markup: renderMarkup(CrystalFiveApproved, { control: { groundOpacity: 0.2258064516 } }),
  },
];

for (const target of targets) {
  const html = visualFixtureHtml(target.markup);
  writeFileSync(resolve(ARTIFACTS_DIR, target.file), html);
  console.log(`${target.file}  svg ${target.markup.length}b  sha256 ${sha256(target.markup)}`);
}
