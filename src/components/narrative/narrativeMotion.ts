// Generic motion primitives for the Narrative Interaction System (V3).
// Section-agnostic on purpose — Home's Sequence A/B and /metodo's future
// sequence both consume this file. Nothing here knows about Crystal V,
// Dolor, Motores, or any specific scene; it only knows "a pose is a
// transform+opacity" and "keyframes interpolate directly by progress".
//
// Direct interpolation only (no lerp/spring) is the reversibility
// contract: interpolatePoses(p, kf) must be a pure function of p, so
// scrolling up retraces exactly the same states as scrolling down. Lerped
// easing stays legal for supplementary camera/parallax motion (see
// Dolor2's existing scroll-driven pan) — never for the primary narrative
// transform.

export type Pose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
};

export const IDENTITY_POSE: Pose = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };

/** One keyframe: `poses[i]` is the i-th tracked object's pose at global progress `t`. */
export type PoseKeyframe = { t: number; poses: Pose[] };

function mixNum(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    x: mixNum(a.x, b.x, t),
    y: mixNum(a.y, b.y, t),
    rotate: mixNum(a.rotate, b.rotate, t),
    scale: mixNum(a.scale, b.scale, t),
    opacity: mixNum(a.opacity, b.opacity, t),
  };
}

/**
 * Direct interpolation across an ordered list of keyframes (ascending `t`,
 * first should be 0 and last 1 for a full-sequence timeline). Same
 * `progress` always yields the same output — no internal state, no
 * smoothing — which is what makes scroll-up reversibility free.
 */
export function interpolatePoses(progress: number, keyframes: PoseKeyframe[]): Pose[] {
  if (keyframes.length === 0) return [];
  if (keyframes.length === 1) return keyframes[0]!.poses;

  const first = keyframes[0]!;
  const last = keyframes[keyframes.length - 1]!;
  const p = Math.min(Math.max(progress, first.t), last.t);

  let i = 0;
  while (i < keyframes.length - 2 && p > keyframes[i + 1]!.t) i++;
  const a = keyframes[i]!;
  const b = keyframes[i + 1]!;
  const span = b.t - a.t || 1;
  const localT = (p - a.t) / span;

  return a.poses.map((pose, idx) => mixPose(pose, b.poses[idx] ?? pose, localT));
}

/** Same direct-interpolation contract as interpolatePoses, for a single scalar (camera zoom, wrapper scale, text opacity thresholds, etc). */
export function interpolateScalar(
  progress: number,
  keyframes: Array<{ t: number; value: number }>,
): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0]!.value;

  const first = keyframes[0]!;
  const last = keyframes[keyframes.length - 1]!;
  const p = Math.min(Math.max(progress, first.t), last.t);

  let i = 0;
  while (i < keyframes.length - 2 && p > keyframes[i + 1]!.t) i++;
  const a = keyframes[i]!;
  const b = keyframes[i + 1]!;
  const span = b.t - a.t || 1;
  const localT = (p - a.t) / span;

  return mixNum(a.value, b.value, localT);
}

export function poseTransform(pose: Pose): string {
  return `translate(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px) rotate(${pose.rotate.toFixed(2)}deg) scale(${pose.scale.toFixed(3)})`;
}

/** Writes poses straight to a list of facet/shard <g> elements — imperative DOM writes only, never React state (see useScrollEngine's rules). */
export function applyPoses(els: Array<SVGGElement | HTMLElement | null>, poses: Pose[]) {
  els.forEach((el, i) => {
    const pose = poses[i];
    if (!el || !pose) return;
    el.style.transform = poseTransform(pose);
    el.style.opacity = pose.opacity.toFixed(3);
  });
}

/**
 * Remaps a global progress (0..1 across a whole NarrativeSequence) into a
 * beat's own local progress (0..1 within [start,end]), clamped outside its
 * window. Beats use this to drive their own text/decoration visibility
 * independently of how the shared object's pose is computed.
 */
export function beatLocalProgress(globalProgress: number, start: number, end: number): number {
  const span = end - start || 1;
  return Math.min(Math.max((globalProgress - start) / span, 0), 1);
}

/**
 * A beat's content opacity as a function of global progress: fades in over
 * `fade` past `start`, holds at 1, fades out over `fade` before `end`. Used
 * for the crossfade between adjacent beats' text/decoration layers that
 * all share the same pinned viewport.
 */
export function beatVisibility(
  globalProgress: number,
  start: number,
  end: number,
  fade = 0.06,
): number {
  if (globalProgress <= start - fade || globalProgress >= end + fade) return 0;
  if (globalProgress < start) return (globalProgress - (start - fade)) / fade;
  if (globalProgress > end) return 1 - (globalProgress - end) / fade;
  return 1;
}
