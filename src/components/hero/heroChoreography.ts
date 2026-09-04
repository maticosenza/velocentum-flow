// Sección 01 — Hero. Coreografía del Crystal 5 (estados A a D del plan),
// expresada como FUNCIONES PURAS del progreso local del beat (0 a 1).
//
// Contrato de reversibilidad del sistema narrativo (ver narrativeMotion.ts):
// el mismo progreso produce siempre la misma pose, sin estado interno. El
// scroll hacia arriba retrae exactamente los mismos estados. No hay una
// reconstrucción acá: eso es la Sección 09.
//
// Salida: un `CrystalFiveControl` para la API por faceta de
// CrystalFiveApproved (poses por pieza + FACTORES de opacidad de las capas,
// nunca valores absolutos) más una capa liviana de polvo en píxeles del
// lienzo de referencia 1440 × 900.
//
// Unidades: las poses de las piezas van en unidades del viewBox del Crystal 5
// (0 0 240 184). El stage mide 500 px de referencia, así que 1 unidad =
// 500 / 240 px. Como el SVG escala con `--u`, las trayectorias escalan solas.

import {
  CRYSTAL_PIECE_POSE_IDENTITY,
  FACETS,
  GUIDE_FACET_INDEX,
  GUIDE_INCLUSION_INDEX,
  INCLUSIONS,
  type CrystalFiveControl,
  type CrystalPiecePose,
  type FacetIndex,
  type InclusionIndex,
} from "@/components/brand/CrystalFiveApproved";
import { HERO_CANVAS, HERO_EXPLOSION_ORIGIN, HERO_GUIDE_PATH, HERO_STAGE } from "./heroContent";

// ---------------------------------------------------------------------------
// Geometría en unidades del viewBox
// ---------------------------------------------------------------------------

export const PX_PER_UNIT = HERO_STAGE.width / 240;
const toUnits = (px: number) => px / PX_PER_UNIT;

/** Bordes del lienzo de referencia, en coordenadas del viewBox del Crystal 5. */
export const VIEW_UNITS = {
  left: toUnits(-HERO_STAGE.left),
  top: toUnits(-HERO_STAGE.top),
  right: toUnits(HERO_CANVAS.width - HERO_STAGE.left),
  bottom: toUnits(HERO_CANVAS.height - HERO_STAGE.top),
} as const;

/** Origen de la explosión (≈ 720, 662 del lienzo) en unidades del viewBox. */
const ORIGIN = {
  x: toUnits(HERO_EXPLOSION_ORIGIN.x - HERO_STAGE.left),
  y: toUnits(HERO_EXPLOSION_ORIGIN.y - HERO_STAGE.top),
};

type Point = { x: number; y: number };

function parsePoints(points: string): Point[] {
  const values = points.split(/[ ,]+/).map(Number);
  const out: Point[] = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    out.push({ x: values[index] ?? 0, y: values[index + 1] ?? 0 });
  }
  return out;
}

function centroidOf(points: string): Point {
  const vertices = parsePoints(points);
  const sum = vertices.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }), { x: 0, y: 0 });
  return { x: sum.x / vertices.length, y: sum.y / vertices.length };
}

/** Radio del círculo envolvente alrededor del centroide, en unidades. */
function boundingRadius(points: string, centroid: Point): number {
  return parsePoints(points).reduce(
    (max, v) => Math.max(max, Math.hypot(v.x - centroid.x, v.y - centroid.y)),
    0,
  );
}

// ---------------------------------------------------------------------------
// Línea de tiempo (progreso local del Hero, 0 a 1)
// ---------------------------------------------------------------------------

export const HERO_TIMELINE = {
  /** Estado A: armado, respiración mínima. */
  holdEnd: 0.1,
  /** Las aristas desaparecen apenas las caras se separan. */
  edgesGone: 0.145,
  groundGone: 0.26,
  /** El halo se apaga antes de que las piezas lleguen lejos: sin silueta fantasma. */
  glowGone: 0.3,
  /** Estado B: la última pieza termina su recorrido. */
  explosionEnd: 0.68,
  /** Las piezas que quedan adentro del cuadro se desvanecen. */
  restFadeStart: 0.58,
  restFadeEnd: 0.8,
  inclusionFadeStart: 0.4,
  inclusionFadeEnd: 0.62,
  /** Estado C: polvo residual breve. */
  dustStart: 0.12,
  dustEnd: 0.64,
  /** Estado D: el fragmento guía recibe el empujón de la explosión y después viaja. */
  guideKickStart: 0.12,
  guideKickEnd: 0.22,
  guideTravelStart: 0.18,
  guideTravelEnd: 0.96,
} as const;

// ---------------------------------------------------------------------------
// Easings (puros)
// ---------------------------------------------------------------------------

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Progreso 0..1 de una ventana [start, end], recortado. */
function window01(p: number, start: number, end: number): number {
  return clamp01((p - start) / (end - start));
}

// ---------------------------------------------------------------------------
// Estado B — explosión radial, tres planos, timings distintos por pieza
// ---------------------------------------------------------------------------

export type HeroPlane = "near" | "mid" | "far";

export type HeroPieceSpec = {
  plane: HeroPlane;
  /** Desvío en grados sobre la dirección radial (centroide − origen): rompe el círculo perfecto. */
  angleOffset: number;
  /** Múltiplo de la distancia de salida: ≥ 1 sale de cuadro, < 1 se detiene adentro. */
  travel: number;
  /** Escala final. Cercano > 1 (pasa cerca de cámara), lejano < 1 (se aleja). */
  scale: number;
  rotate: number;
  /** Ventana de progreso local en la que la pieza se mueve. */
  start: number;
  duration: number;
};

const PLANE_EASE: Record<HeroPlane, (t: number) => number> = {
  near: easeOutQuart,
  mid: easeOutCubic,
  far: easeOutQuad,
};

/** Lo que una pieza lejana pierde de opacidad al alejarse. */
const FAR_RECEDE = 0.45;

/**
 * Las 17 facetas que explotan (FACETS[15] es la guía y no está acá).
 *
 * Cercano: 1, 7, 10, 11, 17 — las cinco caras grandes; salen todas.
 * Medio:   0, 2, 9, 12, 14, 16 salen; 4 y 6 quedan cerca del borde izquierdo.
 * Lejano:  13 sale a la derecha; 3, 5 y 8 quedan, más chicas y más tenues.
 * Salen 12 de 17 ≈ 71 %, dentro del 65–75 % que pide el plan.
 */
export const HERO_FACET_SPECS: Readonly<
  Record<Exclude<FacetIndex, typeof GUIDE_FACET_INDEX>, HeroPieceSpec>
> = {
  0: {
    plane: "mid",
    angleOffset: -12,
    travel: 1.2,
    scale: 1.3,
    rotate: -70,
    start: 0.13,
    duration: 0.42,
  },
  1: {
    plane: "near",
    angleOffset: 8,
    travel: 1.3,
    scale: 2.4,
    rotate: -55,
    start: 0.1,
    duration: 0.36,
  },
  2: {
    plane: "mid",
    angleOffset: 14,
    travel: 1.2,
    scale: 1.25,
    rotate: 60,
    start: 0.15,
    duration: 0.4,
  },
  3: {
    plane: "far",
    angleOffset: -16,
    travel: 0.62,
    scale: 0.62,
    rotate: -26,
    start: 0.16,
    duration: 0.46,
  },
  4: {
    plane: "mid",
    angleOffset: 6,
    travel: 0.62,
    scale: 1.1,
    rotate: -34,
    start: 0.14,
    duration: 0.44,
  },
  5: {
    plane: "far",
    angleOffset: -8,
    travel: 0.55,
    scale: 0.68,
    rotate: 22,
    start: 0.2,
    duration: 0.44,
  },
  6: {
    plane: "mid",
    angleOffset: 0,
    travel: 0.7,
    scale: 1.2,
    rotate: 28,
    start: 0.17,
    duration: 0.42,
  },
  7: {
    plane: "near",
    angleOffset: -6,
    travel: 1.35,
    scale: 2.6,
    rotate: 40,
    start: 0.11,
    duration: 0.34,
  },
  8: {
    plane: "far",
    angleOffset: 10,
    travel: 0.75,
    scale: 0.6,
    rotate: 35,
    start: 0.19,
    duration: 0.4,
  },
  9: {
    plane: "mid",
    angleOffset: 10,
    travel: 1.2,
    scale: 1.2,
    rotate: -64,
    start: 0.14,
    duration: 0.44,
  },
  10: {
    plane: "near",
    angleOffset: -4,
    travel: 1.3,
    scale: 2.3,
    rotate: 48,
    start: 0.1,
    duration: 0.38,
  },
  11: {
    plane: "near",
    angleOffset: -10,
    travel: 1.25,
    scale: 2.1,
    rotate: -38,
    start: 0.13,
    duration: 0.4,
  },
  12: {
    plane: "mid",
    angleOffset: -18,
    travel: 1.2,
    scale: 1.15,
    rotate: 75,
    start: 0.18,
    duration: 0.4,
  },
  13: {
    plane: "far",
    angleOffset: 14,
    travel: 1.15,
    scale: 0.7,
    rotate: -58,
    start: 0.21,
    duration: 0.46,
  },
  14: {
    plane: "mid",
    angleOffset: 9,
    travel: 1.25,
    scale: 1.35,
    rotate: 42,
    start: 0.12,
    duration: 0.4,
  },
  16: {
    plane: "mid",
    angleOffset: 8,
    travel: 1.2,
    scale: 1.3,
    rotate: -46,
    start: 0.16,
    duration: 0.38,
  },
  17: {
    plane: "near",
    angleOffset: 12,
    travel: 1.4,
    scale: 2.5,
    rotate: -30,
    start: 0.12,
    duration: 0.33,
  },
};

/**
 * Las seis inclusiones sueltas (INCLUSIONS[6] viaja con la guía). Son el polvo
 * secundario de las caras: viajan poco, se achican y se apagan temprano.
 */
export const HERO_INCLUSION_SPECS: Readonly<
  Record<Exclude<InclusionIndex, typeof GUIDE_INCLUSION_INDEX>, HeroPieceSpec>
> = {
  0: {
    plane: "far",
    angleOffset: -20,
    travel: 0.5,
    scale: 0.7,
    rotate: -40,
    start: 0.14,
    duration: 0.34,
  },
  1: {
    plane: "far",
    angleOffset: 6,
    travel: 0.6,
    scale: 0.72,
    rotate: 36,
    start: 0.18,
    duration: 0.32,
  },
  2: {
    plane: "far",
    angleOffset: -34,
    travel: 0.55,
    scale: 0.66,
    rotate: -48,
    start: 0.16,
    duration: 0.36,
  },
  3: {
    plane: "far",
    angleOffset: 12,
    travel: 0.7,
    scale: 0.7,
    rotate: 44,
    start: 0.2,
    duration: 0.3,
  },
  4: {
    plane: "far",
    angleOffset: 0,
    travel: 0.5,
    scale: 0.68,
    rotate: 30,
    start: 0.15,
    duration: 0.34,
  },
  5: {
    plane: "far",
    angleOffset: 12,
    travel: 0.55,
    scale: 0.72,
    rotate: -32,
    start: 0.22,
    duration: 0.32,
  },
};

type PieceMotion = {
  spec: HeroPieceSpec;
  centroid: Point;
  dir: Point;
  /** Distancia (unidades) para que el círculo envolvente quede fuera del lienzo. */
  exitDistance: number;
  exits: boolean;
};

function motionFor(points: string, spec: HeroPieceSpec): PieceMotion {
  const centroid = centroidOf(points);
  const radial = Math.atan2(centroid.y - ORIGIN.y, centroid.x - ORIGIN.x);
  const angle = radial + (spec.angleOffset * Math.PI) / 180;
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const radius = boundingRadius(points, centroid) * spec.scale;

  const candidates: number[] = [];
  if (dir.x > 1e-6) candidates.push((VIEW_UNITS.right + radius - centroid.x) / dir.x);
  if (dir.x < -1e-6) candidates.push((VIEW_UNITS.left - radius - centroid.x) / dir.x);
  if (dir.y > 1e-6) candidates.push((VIEW_UNITS.bottom + radius - centroid.y) / dir.y);
  if (dir.y < -1e-6) candidates.push((VIEW_UNITS.top - radius - centroid.y) / dir.y);
  const exitDistance = Math.min(...candidates);

  return { spec, centroid, dir, exitDistance, exits: spec.travel >= 1 };
}

const FACET_MOTIONS = new Map<number, PieceMotion>();
const INCLUSION_MOTIONS = new Map<number, PieceMotion>();
for (const [key, spec] of Object.entries(HERO_FACET_SPECS)) {
  const index = Number(key);
  const facet = FACETS[index as FacetIndex];
  FACET_MOTIONS.set(index, motionFor(facet.points, spec));
}
for (const [key, spec] of Object.entries(HERO_INCLUSION_SPECS)) {
  const index = Number(key);
  const inclusion = INCLUSIONS[index as InclusionIndex];
  INCLUSION_MOTIONS.set(index, motionFor(inclusion.points, spec));
}

/** Pose de una pieza que explota, a progreso local `p`. */
function piecePose(
  motion: PieceMotion,
  p: number,
  fadeStart: number,
  fadeEnd: number,
): CrystalPiecePose {
  const { spec, dir, exitDistance, exits } = motion;
  const t = window01(p, spec.start, spec.start + spec.duration);
  if (t === 0) return CRYSTAL_PIECE_POSE_IDENTITY;
  const e = PLANE_EASE[spec.plane](t);
  const distance = spec.travel * exitDistance * e;

  let opacity: number;
  if (exits) {
    // Sale de cuadro: se apaga recién en el último tramo, cuando ya está afuera del
    // lienzo de referencia (cubre viewports más anchos que 16:10).
    opacity = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
  } else {
    const recede = spec.plane === "far" ? 1 - FAR_RECEDE * e : 1;
    opacity = recede * (1 - smoothstep(window01(p, fadeStart, fadeEnd)));
  }

  return {
    x: dir.x * distance,
    y: dir.y * distance,
    rotate: spec.rotate * e,
    scale: 1 + (spec.scale - 1) * e,
    opacity,
  };
}

// ---------------------------------------------------------------------------
// Estado D — fragmento guía: FACETS[15] con INCLUSIONS[6] adherida
// ---------------------------------------------------------------------------

function cubicBezier(p0: Point, c1: Point, c2: Point, p3: Point, s: number): Point {
  const q = 1 - s;
  return {
    x: q * q * q * p0.x + 3 * q * q * s * c1.x + 3 * q * s * s * c2.x + s * s * s * p3.x,
    y: q * q * q * p0.y + 3 * q * q * s * c1.y + 3 * q * s * s * c2.y + s * s * s * p3.y,
  };
}

/** Reparto del parámetro entre la curva aprobada y su prolongación de salida, por longitud. */
const GUIDE_MAIN_SHARE = 0.77;

/** Punto de la trayectoria de la guía en píxeles del lienzo, para s en [0, 1]. */
export function guidePathPoint(s: number): Point {
  const path = HERO_GUIDE_PATH;
  if (s <= GUIDE_MAIN_SHARE) {
    return cubicBezier(path.start, path.control1, path.control2, path.end, s / GUIDE_MAIN_SHARE);
  }
  return cubicBezier(
    path.end,
    path.exitControl1,
    path.exitControl2,
    path.exit,
    (s - GUIDE_MAIN_SHARE) / (1 - GUIDE_MAIN_SHARE),
  );
}

type Segment = { from: number; to: number; s0: number; s1: number; ease: (t: number) => number };

/**
 * Avance sobre la trayectoria: deriva inicial por el empujón, casi pausa,
 * descenso, otra recuperación de flotación y aceleración final de salida.
 * "Pequeñas aceleraciones, pausas y recuperación de flotación."
 */
const GUIDE_SEGMENTS: Segment[] = [
  { from: 0.18, to: 0.3, s0: 0, s1: 0.13, ease: easeOutCubic },
  { from: 0.3, to: 0.44, s0: 0.13, s1: 0.22, ease: easeInOutSine },
  { from: 0.44, to: 0.66, s0: 0.22, s1: 0.6, ease: easeInOutCubic },
  { from: 0.66, to: 0.8, s0: 0.6, s1: 0.78, ease: easeInOutSine },
  { from: 0.8, to: 0.96, s0: 0.78, s1: 1, ease: easeInCubic },
];

/** Parámetro de trayectoria s(p) de la guía, en [0, 1]. */
export function guidePathParam(p: number): number {
  if (p <= HERO_TIMELINE.guideTravelStart) return 0;
  if (p >= HERO_TIMELINE.guideTravelEnd) return 1;
  for (const segment of GUIDE_SEGMENTS) {
    if (p <= segment.to) {
      const t = window01(p, segment.from, segment.to);
      return segment.s0 + (segment.s1 - segment.s0) * segment.ease(t);
    }
  }
  return 1;
}

const GUIDE_START_UNITS = {
  x: toUnits(HERO_GUIDE_PATH.start.x - HERO_STAGE.left),
  y: toUnits(HERO_GUIDE_PATH.start.y - HERO_STAGE.top),
};

export function guidePose(p: number): CrystalPiecePose {
  const kick = easeOutCubic(window01(p, HERO_TIMELINE.guideKickStart, HERO_TIMELINE.guideKickEnd));
  const s = guidePathParam(p);
  const point = guidePathPoint(s);
  return {
    x: toUnits(point.x - HERO_GUIDE_PATH.start.x) + 3 * kick,
    y: toUnits(point.y - HERO_GUIDE_PATH.start.y) + 2 * kick,
    // Rotación en profundidad sugerida con giro 2D lento y un vaivén de escala:
    // nunca gira como ícono plano.
    rotate: -3 * kick - 31 * s + 3 * Math.sin(3 * Math.PI * s),
    scale: 1 + 0.05 * kick - 0.13 * Math.sin(Math.PI * s),
    opacity: 1,
  };
}

/** Centroide inicial de la guía en unidades del viewBox (≈ 789, 715 en pantalla). */
export const GUIDE_ORIGIN_UNITS = GUIDE_START_UNITS;

// ---------------------------------------------------------------------------
// Capas del asset — FACTORES multiplicadores, nunca absolutos
// ---------------------------------------------------------------------------

export function heroLayerFactors(p: number) {
  const { holdEnd, edgesGone, groundGone, glowGone } = HERO_TIMELINE;
  return {
    edgesOpacity: 1 - smoothstep(window01(p, holdEnd, edgesGone)),
    groundOpacity: 1 - smoothstep(window01(p, holdEnd, groundGone)),
    glowOpacity: 1 - smoothstep(window01(p, holdEnd, glowGone)),
  };
}

// ---------------------------------------------------------------------------
// Control completo para CrystalFiveApproved
// ---------------------------------------------------------------------------

export function heroCrystalControl(p: number): CrystalFiveControl {
  const facetPoses: NonNullable<CrystalFiveControl["facetPoses"]> = {};
  const inclusionPoses: NonNullable<CrystalFiveControl["inclusionPoses"]> = {};
  const { restFadeStart, restFadeEnd, inclusionFadeStart, inclusionFadeEnd } = HERO_TIMELINE;

  for (const [index, motion] of FACET_MOTIONS) {
    facetPoses[index as Exclude<FacetIndex, typeof GUIDE_FACET_INDEX>] = piecePose(
      motion,
      p,
      restFadeStart,
      restFadeEnd,
    );
  }
  for (const [index, motion] of INCLUSION_MOTIONS) {
    inclusionPoses[index as Exclude<InclusionIndex, typeof GUIDE_INCLUSION_INDEX>] = piecePose(
      motion,
      p,
      inclusionFadeStart,
      inclusionFadeEnd,
    );
  }

  return {
    facetPoses,
    inclusionPoses,
    guidePose: guidePose(p),
    ...heroLayerFactors(p),
  };
}

// ---------------------------------------------------------------------------
// Estado C — polvo residual (24–36 motas en desktop)
// ---------------------------------------------------------------------------

export const HERO_DUST_COUNT = 30;

type DustMote = {
  dir: Point;
  distance: number;
  size: number;
  start: number;
  duration: number;
  peak: number;
  gravity: number;
};

/** PRNG determinista (mulberry32): la misma nube de polvo en cada carga. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DUST: readonly DustMote[] = (() => {
  const random = mulberry32(20260831);
  const motes: DustMote[] = [];
  for (let index = 0; index < HERO_DUST_COUNT; index += 1) {
    const angle = (index / HERO_DUST_COUNT) * Math.PI * 2 + (random() - 0.5) * 0.5;
    motes.push({
      dir: { x: Math.cos(angle), y: Math.sin(angle) },
      distance: 140 + random() * 420,
      size: 1.6 + random() * 3.4,
      start: HERO_TIMELINE.dustStart + random() * 0.12,
      duration: 0.3 + random() * 0.12,
      peak: 0.45 + random() * 0.5,
      gravity: 10 + random() * 30,
    });
  }
  return motes;
})();

export type DustSample = { x: number; y: number; scale: number; opacity: number };

/** Muestras de polvo en píxeles del lienzo de referencia (el SVG de polvo usa viewBox 1440 × 900). */
export function heroDust(p: number): DustSample[] {
  return DUST.map((mote) => {
    const t = window01(p, mote.start, mote.start + mote.duration);
    if (t === 0) {
      return { x: HERO_EXPLOSION_ORIGIN.x, y: HERO_EXPLOSION_ORIGIN.y, scale: 0, opacity: 0 };
    }
    const e = easeOutCubic(t);
    const rise = t < 0.12 ? t / 0.12 : Math.pow(1 - (t - 0.12) / 0.88, 1.5);
    return {
      x: HERO_EXPLOSION_ORIGIN.x + mote.dir.x * mote.distance * e,
      y: HERO_EXPLOSION_ORIGIN.y + mote.dir.y * mote.distance * e + mote.gravity * t * t,
      scale: mote.size * (0.6 + 0.4 * (1 - t)),
      opacity: mote.peak * rise,
    };
  });
}

// ---------------------------------------------------------------------------
// Helpers para verificación (no se usan en render)
// ---------------------------------------------------------------------------

/** Posición y radio envolvente (píxeles del lienzo) de una pieza a progreso `p`. */
export function facetFootprintAt(
  index: Exclude<FacetIndex, typeof GUIDE_FACET_INDEX>,
  p: number,
): { x: number; y: number; radius: number; opacity: number; exits: boolean } {
  const motion = FACET_MOTIONS.get(index);
  if (!motion) throw new RangeError(`sin coreografía para la faceta ${index}`);
  const pose = piecePose(motion, p, HERO_TIMELINE.restFadeStart, HERO_TIMELINE.restFadeEnd);
  const radius = boundingRadius(FACETS[index].points, motion.centroid) * pose.scale;
  return {
    x: HERO_STAGE.left + (motion.centroid.x + pose.x) * PX_PER_UNIT,
    y: HERO_STAGE.top + (motion.centroid.y + pose.y) * PX_PER_UNIT,
    radius: radius * PX_PER_UNIT,
    opacity: pose.opacity,
    exits: motion.exits,
  };
}

/** Ídem para la guía (FACETS[15]), centrada en su centroide desplazado. */
export function guideFootprintAt(p: number): { x: number; y: number; radius: number } {
  const pose = guidePose(p);
  const guide = FACETS[GUIDE_FACET_INDEX];
  const centroid = centroidOf(guide.points);
  return {
    x: HERO_STAGE.left + (centroid.x + pose.x) * PX_PER_UNIT,
    y: HERO_STAGE.top + (centroid.y + pose.y) * PX_PER_UNIT,
    radius: boundingRadius(guide.points, centroid) * pose.scale * PX_PER_UNIT,
  };
}
