// El recorrido del fragmento guía a través de la Secuencia A.
//
// FACETS[15] con INCLUSIONS[6] adherida sale del Hero por el carril inferior
// derecho y desde ahí recorre las Secciones 02, 03 y 04. Cada escena aporta un
// tramo, y todos los tramos EMPIEZAN Y TERMINAN FUERA DEL LIENZO: el empalme
// entre secciones nunca se ve, así que la pieza no se teletransporta en cámara.
//
// Todo son funciones puras del progreso global de la secuencia — el mismo
// contrato de reversibilidad que narrativeMotion.ts: scrollear hacia arriba
// retrae exactamente los mismos estados.
//
// Coordenadas en píxeles del lienzo de referencia 1440 × 900, referidas al
// CENTRO del fragmento.

import { beatLocalProgress } from "@/components/narrative/narrativeMotion";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { SCENE_CANVAS } from "@/components/scene/sceneUnits";
import { BEATS, type BeatWindow } from "./poses";
import { PROBLEMA_UNO_GUIDE_POSE } from "./problemaUnoContent";
import { PROBLEMA_DOS_GUIDE_POSE } from "./problemaDosContent";

export type Point = { x: number; y: number };

type Cubic = { from: Point; c1: Point; c2: Point; to: Point; sFrom: number; sTo: number };

type Easing = (t: number) => number;

/** Tramo de la línea de tiempo: progreso local → parámetro `s` del recorrido. */
type TimingStop = { from: number; to: number; sFrom: number; sTo: number; ease: Easing };

type SceneGuide = {
  beat: BeatWindow;
  /** Ancho del fragmento en esta escena, en unidades del lienzo. */
  width: number;
  path: Cubic[];
  timing: TimingStop[];
  /** Rotación en grados, por tramos sobre `s`. */
  rotation: Array<{ s: number; deg: number }>;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic: Easing = (t) => t * t * t;
const easeInOutCubic: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function window01(p: number, start: number, end: number): number {
  return clamp01((p - start) / (end - start));
}

function cubicAt(segment: Cubic, t: number): Point {
  const q = 1 - t;
  const { from, c1, c2, to } = segment;
  return {
    x: q * q * q * from.x + 3 * q * q * t * c1.x + 3 * q * t * t * c2.x + t * t * t * to.x,
    y: q * q * q * from.y + 3 * q * q * t * c1.y + 3 * q * t * t * c2.y + t * t * t * to.y,
  };
}

function pointAtS(path: Cubic[], s: number): Point {
  const clamped = clamp01(s);
  for (const segment of path) {
    if (clamped <= segment.sTo || segment === path[path.length - 1]) {
      const span = segment.sTo - segment.sFrom || 1;
      return cubicAt(segment, clamp01((clamped - segment.sFrom) / span));
    }
  }
  const last = path[path.length - 1];
  return last ? last.to : { x: 0, y: 0 };
}

function sAtLocal(timing: TimingStop[], local: number): number {
  for (const stop of timing) {
    if (local <= stop.to || stop === timing[timing.length - 1]) {
      const t = window01(local, stop.from, stop.to);
      return stop.sFrom + (stop.sTo - stop.sFrom) * stop.ease(t);
    }
  }
  return 0;
}

function rotationAtS(stops: Array<{ s: number; deg: number }>, s: number): number {
  const clamped = clamp01(s);
  for (let index = 0; index < stops.length - 1; index += 1) {
    const a = stops[index];
    const b = stops[index + 1];
    if (!a || !b) break;
    if (clamped <= b.s || index === stops.length - 2) {
      const span = b.s - a.s || 1;
      const t = clamp01((clamped - a.s) / span);
      return a.deg + (b.deg - a.deg) * t;
    }
  }
  return stops[0]?.deg ?? 0;
}

// ---------------------------------------------------------------------------
// Sección 02 — El problema
// ---------------------------------------------------------------------------

/** Centro de la pose aprobada del mockup 02. */
const KEY_02: Point = {
  x: PROBLEMA_UNO_GUIDE_POSE.left + PROBLEMA_UNO_GUIDE_POSE.width / 2,
  y: PROBLEMA_UNO_GUIDE_POSE.top + guideFragmentHeight(PROBLEMA_UNO_GUIDE_POSE.width) / 2,
};

/**
 * Entra por el borde superior del carril derecho, cae lento hasta la pose
 * aprobada con un pequeño rebote y sigue bajando hasta salir por abajo.
 * Los puntos de control son los de la capa de anotación "Carril" del mockup.
 */
const GUIDE_02: SceneGuide = {
  beat: BEATS.dolor1,
  width: PROBLEMA_UNO_GUIDE_POSE.width,
  path: [
    {
      from: { x: 1300, y: -130 },
      c1: { x: 1292, y: 60 },
      c2: { x: 1268, y: 180 },
      to: KEY_02,
      sFrom: 0,
      sTo: 0.42,
    },
    {
      from: KEY_02,
      c1: { x: 1264, y: 430 },
      c2: { x: 1250, y: 560 },
      to: { x: 1238, y: 700 },
      sFrom: 0.42,
      sTo: 0.72,
    },
    {
      from: { x: 1238, y: 700 },
      c1: { x: 1232, y: 800 },
      c2: { x: 1228, y: 910 },
      to: { x: 1225, y: 1020 },
      sFrom: 0.72,
      sTo: 1,
    },
  ],
  // Caída lenta que desacelera, rebote corto y regreso a la pose aprobada, y
  // recién después la salida. "Primera caída lenta con giro y pequeño rebote."
  timing: [
    { from: 0, to: 0.34, sFrom: 0, sTo: 0.445, ease: easeOutCubic },
    { from: 0.34, to: 0.44, sFrom: 0.445, sTo: 0.404, ease: easeInOutSine },
    { from: 0.44, to: 0.52, sFrom: 0.404, sTo: 0.42, ease: easeInOutSine },
    { from: 0.52, to: 0.78, sFrom: 0.42, sTo: 0.72, ease: easeInOutCubic },
    { from: 0.78, to: 1, sFrom: 0.72, sTo: 1, ease: easeInCubic },
  ],
  rotation: [
    { s: 0, deg: -6 },
    { s: 0.42, deg: PROBLEMA_UNO_GUIDE_POSE.rotate },
    { s: 0.72, deg: -34 },
    { s: 1, deg: -44 },
  ],
};

// ---------------------------------------------------------------------------
// Sección 03 — El otro problema
// ---------------------------------------------------------------------------

/** Centro de la pose aprobada del mockup 03. */
const KEY_03: Point = {
  x: PROBLEMA_DOS_GUIDE_POSE.left + PROBLEMA_DOS_GUIDE_POSE.width / 2,
  y: PROBLEMA_DOS_GUIDE_POSE.top + guideFragmentHeight(PROBLEMA_DOS_GUIDE_POSE.width) / 2,
};

/**
 * Cruce hacia el carril izquierdo.
 *
 * El recorrido COMIENZA FUERA del borde derecho y entra ya a media altura baja
 * (≈ y 584), por debajo del copy. No desciende por el carril derecho: en esta
 * sección ese carril se superpone con la columna del copy. Cruza la franja
 * inferior con una curva amplia y sale por abajo a la izquierda.
 * Los puntos de control son los de la capa de anotación "Cruce" del mockup.
 */
const GUIDE_03: SceneGuide = {
  beat: BEATS.dolor2,
  width: PROBLEMA_DOS_GUIDE_POSE.width,
  path: [
    {
      from: { x: 1580, y: 576 },
      c1: { x: 1300, y: 604 },
      c2: { x: 1130, y: 660 },
      to: KEY_03,
      sFrom: 0,
      sTo: 0.55,
    },
    {
      from: KEY_03,
      c1: { x: 440, y: 786 },
      c2: { x: 260, y: 812 },
      to: { x: 150, y: 900 },
      sFrom: 0.55,
      sTo: 0.85,
    },
    {
      from: { x: 150, y: 900 },
      c1: { x: 110, y: 950 },
      c2: { x: 80, y: 1000 },
      to: { x: 50, y: 1070 },
      sFrom: 0.85,
      sTo: 1,
    },
  ],
  timing: [
    { from: 0, to: 0.5, sFrom: 0, sTo: 0.55, ease: easeInOutCubic },
    { from: 0.5, to: 0.82, sFrom: 0.55, sTo: 0.85, ease: easeInOutSine },
    { from: 0.82, to: 1, sFrom: 0.85, sTo: 1, ease: easeInCubic },
  ],
  // Giro parcial en profundidad durante el cruce: bastante más girado que los
  // -24° de la Sección 02, y continúa desde donde quedó allá.
  rotation: [
    { s: 0, deg: -44 },
    { s: 0.55, deg: PROBLEMA_DOS_GUIDE_POSE.rotate },
    { s: 0.85, deg: -70 },
    { s: 1, deg: -78 },
  ],
};

const SCENES: readonly SceneGuide[] = [GUIDE_02, GUIDE_03];

export type GuidePose = {
  /** Centro del fragmento, en unidades del lienzo. */
  x: number;
  y: number;
  rotate: number;
  width: number;
  /** false cuando ninguna escena implementada cubre este progreso. */
  active: boolean;
};

/** Pose del fragmento guía para el progreso GLOBAL de la Secuencia A. */
export function guideFragmentPose(progress: number): GuidePose {
  const scene = SCENES.find((s) => progress >= s.beat.start && progress < s.beat.end) ?? null;
  if (!scene) {
    const fallback = SCENES[0];
    return {
      x: 0,
      y: -1000,
      rotate: 0,
      width: fallback ? fallback.width : 100,
      active: false,
    };
  }
  const local = beatLocalProgress(progress, scene.beat.start, scene.beat.end);
  const s = sAtLocal(scene.timing, local);
  const point = pointAtS(scene.path, s);
  return {
    x: point.x,
    y: point.y,
    rotate: rotationAtS(scene.rotation, s),
    width: scene.width,
    active: true,
  };
}

/** Radio envolvente aproximado del fragmento, para verificar que sale de cuadro. */
export function guideFragmentRadius(width: number): number {
  return Math.hypot(width, guideFragmentHeight(width)) / 2;
}

/** true si el fragmento está completamente fuera del lienzo de referencia. */
export function guideFragmentIsOffCanvas(pose: GuidePose): boolean {
  const radius = guideFragmentRadius(pose.width);
  return (
    pose.x + radius < 0 ||
    pose.x - radius > SCENE_CANVAS.width ||
    pose.y + radius < 0 ||
    pose.y - radius > SCENE_CANVAS.height
  );
}

/**
 * Distancia, en unidades del lienzo, entre el fragmento guía y un punto de la
 * escena. La Sección 03 la usa para el destello del extremo de la conexión
 * incompleta: el destello ocurre "al pasar cerca", no en un progreso fijo, así
 * que se deriva de la propia trayectoria.
 */
export function guideDistanceTo(progress: number, point: Point): number {
  const pose = guideFragmentPose(progress);
  if (!pose.active) return Infinity;
  return Math.hypot(pose.x - point.x, pose.y - point.y);
}

/** Intensidad del destello, 0 a 1, según la cercanía al punto. */
export function guideProximityFlash(progress: number, point: Point, reach: number): number {
  const distance = guideDistanceTo(progress, point);
  if (!Number.isFinite(distance) || distance >= reach) return 0;
  const t = 1 - distance / reach;
  return t * t;
}
