// Sequence B ("Reveal -> Motores -> Servicios") timing. A separate,
// independent pin from Sequence A — see the V3 plan's own note that the
// two sequences are deliberately not one continuous mega-pin (scroll
// budget, and each is already its own named sequence). Continuity with
// Sequence A is visual only: this sequence's own crystal starts already
// assembled, matching exactly the pose Sequence A's Reveal beat ends on.
import { CRYSTAL_V_FACET_COUNT } from "@/components/brand/CrystalV";
import { CRYSTAL_V_SCATTER } from "@/components/brand/crystalVMotion";
import {
  IDENTITY_POSE,
  type Pose,
  type PoseKeyframe,
} from "@/components/narrative/narrativeMotion";

export const BEATS = {
  motores: { start: 0, end: 0.5 },
  servicios: { start: 0.5, end: 1 },
};

export const ASSEMBLED: Pose[] = Array.from({ length: CRYSTAL_V_FACET_COUNT }, () => ({
  ...IDENTITY_POSE,
}));

// The same disassembly Hero/Reveal use, amplified — a release, not a
// controlled disassembly: the crystal is giving up its cohesion here, not
// preparing to reassemble.
const FRACTURE: Pose[] = CRYSTAL_V_SCATTER.map((t) => ({
  x: t.x * 2.4,
  y: t.y * 2.4,
  rotate: t.rotate * 1.8,
  scale: 0.85,
  opacity: 0,
}));

/**
 * Holds assembled through the opening of the Motores beat (so it visibly
 * *is* the crystal Sequence A ended on, not a fresh shape), fractures and
 * fades in the same stroke — by the time the four motor objects crossfade
 * in (see MotoresBeat), the crystal is gone. Never comes back: Sequence B
 * only spends the V once, it doesn't reassemble mid-sequence.
 */
export const CRYSTAL_KEYFRAMES: PoseKeyframe[] = [
  { t: 0, poses: ASSEMBLED },
  { t: 0.12, poses: ASSEMBLED },
  { t: 0.32, poses: FRACTURE },
  { t: 1, poses: FRACTURE },
];

export const EDGE_OPACITY_KEYFRAMES: Array<{ t: number; value: number }> = [
  { t: 0, value: 1 },
  { t: 0.12, value: 1 },
  { t: 0.28, value: 0 },
  { t: 1, value: 0 },
];
