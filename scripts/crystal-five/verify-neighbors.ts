/**
 * Los dos componentes vecinos (CrystalFiveFragmentsApproved y CrystalFragments) comparten
 * los helpers que este trabajo retipa. No están bajo el contrato de la API por faceta, pero
 * su DOM tampoco debe moverse: este chequeo lo demuestra contra 49fc3dc.
 */
import { resolve } from "node:path";
import { REPO_ROOT, materializeFromBaseline, renderMarkup, sha256 } from "./lib.ts";

type AnyComponent = React.ComponentType<Record<string, unknown>>;

const baselineFive = await import(materializeFromBaseline("src/components/brand/CrystalFiveApproved.tsx", "CrystalFiveApproved.baseline.tsx"));
const baselineFragments = await import(materializeFromBaseline("src/components/brand/CrystalFragments.tsx", "CrystalFragments.baseline.tsx"));
const currentFive = await import(resolve(REPO_ROOT, "src/components/brand/CrystalFiveApproved.tsx"));
const currentFragments = await import(resolve(REPO_ROOT, "src/components/brand/CrystalFragments.tsx"));

const cases: Array<{ name: string; base: () => string; now: () => string }> = [
  {
    name: "CrystalFiveFragmentsApproved",
    base: () => renderMarkup(baselineFive.CrystalFiveFragmentsApproved as AnyComponent),
    now: () => renderMarkup(currentFive.CrystalFiveFragmentsApproved as AnyComponent),
  },
];
for (const layout of ["cluster", "burst", "flow-a", "flow-b"] as const) {
  cases.push({
    name: `CrystalFragments layout=${layout}`,
    base: () => renderMarkup(baselineFragments.CrystalFragments as AnyComponent, { layout }),
    now: () => renderMarkup(currentFragments.CrystalFragments as AnyComponent, { layout }),
  });
}

let failures = 0;
for (const testCase of cases) {
  const base = testCase.base();
  const now = testCase.now();
  const ok = base === now;
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"}  ${testCase.name}  ${base.length}b sha256 ${sha256(base).slice(0, 16)}${ok ? "" : ` != ${sha256(now).slice(0, 16)}`}`);
}

console.log(`\n${cases.length - failures}/${cases.length} componentes vecinos sin cambios`);
if (failures > 0) process.exit(1);
