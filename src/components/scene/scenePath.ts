// Trayectorias de escena: la matemática que comparten todos los recorridos del
// fragmento guía a lo largo de la HOME.
//
// Un recorrido es una polibézier con un parámetro `s` de 0 a 1, más una línea de
// tiempo que mapea el progreso local de la sección a ese `s`, más una rampa de
// rotación sobre `s`. Todo son FUNCIONES PURAS: el mismo progreso devuelve
// siempre la misma pose, así que scrollear hacia arriba retrae exactamente los
// mismos estados (mismo contrato de reversibilidad que narrativeMotion.ts).
//
// Coordenadas en píxeles del lienzo de referencia 1440 × 900, referidas al
// CENTRO de la pieza.

export type Point = { x: number; y: number };

export type Cubic = {
  from: Point;
  c1: Point;
  c2: Point;
  to: Point;
  /** Tramo de `s` que cubre este segmento. */
  sFrom: number;
  sTo: number;
};

export type Easing = (t: number) => number;

/** Tramo de la línea de tiempo: progreso local → parámetro `s` del recorrido. */
export type TimingStop = { from: number; to: number; sFrom: number; sTo: number; ease: Easing };

/** Rampa de rotación en grados, por tramos sobre `s`. */
export type RotationStop = { s: number; deg: number };

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeInCubic: Easing = (t) => t * t * t;
export const easeInOutCubic: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeInOutSine: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeLinear: Easing = (t) => t;

/** Progreso 0..1 de una ventana [start, end], recortado. */
export function window01(p: number, start: number, end: number): number {
  return clamp01((p - start) / (end - start));
}

export function cubicAt(segment: Cubic, t: number): Point {
  const q = 1 - t;
  const { from, c1, c2, to } = segment;
  return {
    x: q * q * q * from.x + 3 * q * q * t * c1.x + 3 * q * t * t * c2.x + t * t * t * to.x,
    y: q * q * q * from.y + 3 * q * q * t * c1.y + 3 * q * t * t * c2.y + t * t * t * to.y,
  };
}

export function pointAtS(path: readonly Cubic[], s: number): Point {
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

export function sAtLocal(timing: readonly TimingStop[], local: number): number {
  for (const stop of timing) {
    if (local <= stop.to || stop === timing[timing.length - 1]) {
      const t = window01(local, stop.from, stop.to);
      return stop.sFrom + (stop.sTo - stop.sFrom) * stop.ease(t);
    }
  }
  return 0;
}

export function rotationAtS(stops: readonly RotationStop[], s: number): number {
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

/** Un recorrido completo: geometría, línea de tiempo y rotación. */
export type ScenePath = {
  /** Ancho de la pieza en esta escena, en unidades del lienzo. */
  width: number;
  path: readonly Cubic[];
  timing: readonly TimingStop[];
  rotation: readonly RotationStop[];
};

export type ScenePose = { x: number; y: number; rotate: number; width: number };

/** Pose de la pieza para un progreso local 0..1 de la sección. */
export function scenePoseAt(spec: ScenePath, local: number): ScenePose {
  const s = sAtLocal(spec.timing, clamp01(local));
  const point = pointAtS(spec.path, s);
  return { x: point.x, y: point.y, rotate: rotationAtS(spec.rotation, s), width: spec.width };
}

/** Parámetro `s` del recorrido para un progreso local. Útil para derivar pulsos. */
export function sceneSAt(spec: ScenePath, local: number): number {
  return sAtLocal(spec.timing, clamp01(local));
}
