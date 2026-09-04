// La unidad del lienzo aprobado.
//
// Todos los mockups de la HOME están cotados sobre un viewport de referencia de
// 1440 × 900. `--u` vale UN píxel de ese lienzo: a 1440 × 900 mide exactamente
// 1 px y por encima escala en proporción, así que las coordenadas del plan se
// escriben tal cual y nunca hacen falta breakpoints propios.
//
// La define la clase `.scene-canvas` en styles.css (y, para la Sección 01,
// `.hero-canvas`).

/** `calc(n * var(--u))` — n en píxeles del lienzo de referencia. */
export function u(px: number): string {
  return `calc(${px} * var(--u))`;
}

/** Lienzo de referencia de todos los mockups aprobados. */
export const SCENE_CANVAS = { width: 1440, height: 900 } as const;
