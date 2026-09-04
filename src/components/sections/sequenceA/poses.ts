// Ventanas de los beats de la Secuencia A.
//
// El pin cubre cuatro beats — Hero, El problema, El otro problema y Un mismo
// objetivo —, cada uno un cuarto del progreso compartido. Cada beat lee su
// ventana para su propia visibilidad y para su progreso local.
//
// Las poses del Crystal V que vivían acá se retiraron junto con su rama en
// CrystalStage: ninguna de las cuatro secciones aprobadas usa ese objeto. La
// Secuencia B mantiene su propio `poses.ts`, intacto.

export type BeatWindow = { start: number; end: number };

export const BEATS = {
  hero: { start: 0, end: 0.25 } satisfies BeatWindow,
  dolor1: { start: 0.25, end: 0.5 } satisfies BeatWindow,
  dolor2: { start: 0.5, end: 0.75 } satisfies BeatWindow,
  reveal: { start: 0.75, end: 1 } satisfies BeatWindow,
};
