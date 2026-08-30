import { CRYSTAL_V_FACET_COUNT } from "./CrystalV";

export type FacetTransform = { x: number; y: number; rotate: number };

// Fixed, deterministic scatter used by the Hero's assembly gesture: each
// facet starts translated (-60..60px on each axis) and rotated (-25..25deg)
// away from its assembled position. Reveal reuses this same base, amplified
// ~1.6x on position only (see scaleFacetPosition) — the Plan Maestro is
// explicit that Reveal's dispersed state is the Hero's, just wider.
export const CRYSTAL_V_SCATTER: FacetTransform[] = [
  { x: -45, y: -50, rotate: -18 },
  { x: 50, y: -35, rotate: 15 },
  { x: -60, y: 20, rotate: 22 },
  { x: 35, y: 55, rotate: -20 },
  { x: -30, y: -60, rotate: 10 },
  { x: 55, y: -15, rotate: -25 },
  { x: -55, y: 45, rotate: 8 },
  { x: 20, y: -55, rotate: 20 },
  { x: -20, y: 60, rotate: -12 },
  { x: 60, y: 30, rotate: -8 },
  { x: -40, y: 10, rotate: 25 },
  { x: 25, y: -40, rotate: -15 },
];

if (CRYSTAL_V_SCATTER.length !== CRYSTAL_V_FACET_COUNT) {
  throw new Error("CRYSTAL_V_SCATTER must have one entry per CrystalV facet");
}

/** Scales only the translation, keeping rotation as-is ("posiciones amplificadas"). */
export function scaleFacetPosition(t: FacetTransform, factor: number): FacetTransform {
  return { x: t.x * factor, y: t.y * factor, rotate: t.rotate };
}

export function facetTransformString(t: FacetTransform) {
  return `translate(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px) rotate(${t.rotate.toFixed(2)}deg)`;
}

export function mix(from: number, to: number, t: number) {
  return from + (to - from) * t;
}
