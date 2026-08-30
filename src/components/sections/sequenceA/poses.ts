// Sequence A ("Intro -> Hero -> Dolor1 -> Dolor2 -> Reveal") pose data.
// Home-specific content sitting on top of the section-agnostic primitives
// in narrativeMotion.ts. The Intro itself isn't a scroll beat — see
// SequenceA.tsx for why — so the pinned timeline only spans four beats,
// each one quarter of the sequence's total progress.
import { CRYSTAL_V_FACET_COUNT } from "@/components/brand/CrystalV";
import {
  IDENTITY_POSE,
  interpolatePoses,
  type Pose,
  type PoseKeyframe,
} from "@/components/narrative/narrativeMotion";

export type BeatWindow = { start: number; end: number };

export const BEATS = {
  hero: { start: 0, end: 0.25 } satisfies BeatWindow,
  dolor1: { start: 0.25, end: 0.5 } satisfies BeatWindow,
  dolor2: { start: 0.5, end: 0.75 } satisfies BeatWindow,
  reveal: { start: 0.75, end: 1 } satisfies BeatWindow,
};

// Same x/y/rotate values as the pre-V3 CRYSTAL_V_SCATTER (Hero/Reveal's
// approved disassembly) — kept identical on purpose, this is the one part
// of the motion the team has already seen and approved. scale/opacity are
// new: per-facet depth variety so twelve facets read as glass at different
// depths instead of twelve flat coplanar polygons. Indices follow
// CrystalV's own FACETS order — 0/1 are the two main gradient halves
// (foreground, stay full), 3/7 are the dark facets (stay assertive), 10/11
// are the pale/highlight facets (recede: smaller, fainter).
const SCATTER_BASE: Array<{ x: number; y: number; rotate: number }> = [
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

const SCATTER_SCALE = [1, 1, 0.95, 1.08, 0.98, 1.04, 0.93, 1.06, 1.0, 1.05, 0.9, 0.92];
const SCATTER_OPACITY = [1, 1, 0.95, 1, 0.9, 1, 0.85, 1, 0.9, 1, 0.8, 0.85];

if (
  SCATTER_BASE.length !== CRYSTAL_V_FACET_COUNT ||
  SCATTER_SCALE.length !== CRYSTAL_V_FACET_COUNT ||
  SCATTER_OPACITY.length !== CRYSTAL_V_FACET_COUNT
) {
  throw new Error("Sequence A pose arrays must have one entry per CrystalV facet");
}

export const ASSEMBLED: Pose[] = Array.from({ length: CRYSTAL_V_FACET_COUNT }, () => ({
  ...IDENTITY_POSE,
}));

/** Hero's own disassembly — the state Dolor1 continues from. */
export const SCATTER_NARROW: Pose[] = SCATTER_BASE.map((t, i) => ({
  x: t.x,
  y: t.y,
  rotate: t.rotate,
  scale: SCATTER_SCALE[i]!,
  opacity: SCATTER_OPACITY[i]!,
}));

/** Dolor1's field — same shards, blown out wider (2.3x position, 1.3x rotation) so the dispersal reads as a scene, not just a bigger Hero disassembly. */
export const SCATTER_WIDE: Pose[] = SCATTER_NARROW.map((p) => ({
  ...p,
  x: p.x * 2.3,
  y: p.y * 2.3,
  rotate: p.rotate * 1.3,
}));

/** Dolor2's loose grouping — partway from SCATTER_WIDE back to ASSEMBLED, computed rather than hand-placed so it stays exactly consistent with both endpoints. Deliberately not closer than this: must not read as a V yet. */
export const GATHER_LOOSE: Pose[] = interpolatePoses(0.45, [
  { t: 0, poses: SCATTER_WIDE },
  { t: 1, poses: ASSEMBLED },
]);

/**
 * The shared crystal's pose across the whole pinned timeline. Holds at
 * ASSEMBLED through most of the Hero beat (so its copy has time to read
 * before anything moves), disperses into Dolor1, holds wide through it,
 * gathers loosely across Dolor2, then reassembles across Reveal.
 */
export const CRYSTAL_KEYFRAMES: PoseKeyframe[] = [
  { t: 0, poses: ASSEMBLED },
  { t: 0.2, poses: ASSEMBLED },
  { t: 0.3, poses: SCATTER_WIDE },
  { t: 0.5, poses: SCATTER_WIDE },
  { t: 0.7, poses: GATHER_LOOSE },
  { t: 0.75, poses: GATHER_LOOSE },
  { t: 0.95, poses: ASSEMBLED },
  { t: 1, poses: ASSEMBLED },
];

/** Edges/aristas only read as "complete" when the crystal actually is — hidden through the whole scattered/gathered stretch, back only once Reveal finishes reassembling. */
export const EDGE_OPACITY_KEYFRAMES: Array<{ t: number; value: number }> = [
  { t: 0, value: 1 },
  { t: 0.2, value: 1 },
  { t: 0.3, value: 0 },
  { t: 0.75, value: 0 },
  { t: 0.95, value: 1 },
  { t: 1, value: 1 },
];
