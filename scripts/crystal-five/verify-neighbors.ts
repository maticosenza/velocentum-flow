/**
 * Los dos componentes vecinos (CrystalFiveFragmentsApproved y CrystalFragments) comparten
 * los helpers que este trabajo retipa. No están bajo el contrato de la API por faceta, pero
 * su DOM tampoco debe moverse: este chequeo lo demuestra contra 49fc3dc.
 */
import { CrystalFiveFragmentsApproved } from "../../src/components/brand/CrystalFiveApproved.tsx";
import { CrystalFragments } from "../../src/components/brand/CrystalFragments.tsx";
import { importBaselineCrystal, importBaselineFragments, renderMarkup, sha256 } from "./lib.ts";

const baselineFive = await importBaselineCrystal();
const baselineFragments = await importBaselineFragments();

const cases: Array<{ name: string; base: () => string; now: () => string }> = [
  {
    name: "CrystalFiveFragmentsApproved",
    base: () => renderMarkup(baselineFive.CrystalFiveFragmentsApproved),
    now: () => renderMarkup(CrystalFiveFragmentsApproved),
  },
];
for (const layout of ["cluster", "burst", "flow-a", "flow-b"] as const) {
  cases.push({
    name: `CrystalFragments layout=${layout}`,
    base: () => renderMarkup(baselineFragments.CrystalFragments, { layout }),
    now: () => renderMarkup(CrystalFragments, { layout }),
  });
}

let failures = 0;
for (const testCase of cases) {
  const base = testCase.base();
  const now = testCase.now();
  const ok = base === now;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "OK  " : "FAIL"}  ${testCase.name}  ${base.length}b sha256 ${sha256(base).slice(0, 16)}${ok ? "" : ` != ${sha256(now).slice(0, 16)}`}`,
  );
}

console.log(`\n${cases.length - failures}/${cases.length} componentes vecinos sin cambios`);
if (failures > 0) process.exit(1);
