// Sección 02 — El problema. Copy y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/02-problema-mockup-final.html.
//
// Fuente única: los consumen el beat pinned (Dolor1Beat) y el fallback estático
// (sections/Dolores.tsx) a través de ProblemaUnoComposition.
//
// Todas las medidas están en píxeles del lienzo de referencia 1440 × 900 y en
// render se multiplican por `--u` (ver .scene-canvas en styles.css).

import type { ScenePillDef, ScenePlane } from "@/components/scene/ScenePill";

export const PROBLEMA_UNO_COPY = {
  eyebrow: "El problema",
  headlineBefore: "Una sola persona no puede cargar ",
  /** Va en --pink. */
  headlineAccent: "todo el crecimiento",
  headlineAfter: " de un negocio.",
  subtitle:
    "Estrategia, contenido, pauta, web, diseño y medición. Cada una es un oficio distinto. Juntas, no entran en una sola agenda.",
  /** Medida de lectura aprobada del subtítulo. */
  subtitleMeasureCh: 46,
} as const;

/**
 * Copy alineado a la IZQUIERDA. Rompe deliberadamente el centrado simétrico del
 * Hero: es el primer cambio de registro del recorrido.
 */
export const PROBLEMA_UNO_COPY_BOX = { left: 72, top: 214, width: 560 } as const;

/** Zona protegida del copy. Ni las píldoras ni el fragmento guía la cruzan. */
export const PROBLEMA_UNO_COPY_ZONE = { left: 72, top: 196, right: 652, bottom: 526 } as const;

/** Campo donde se dispersan las capacidades. */
export const PROBLEMA_UNO_FIELD = { left: 646, right: 1244 } as const;

/** Carril derecho reservado, heredado del Hero. */
export const PROBLEMA_UNO_LANE = { left: 1150, right: 1370 } as const;

/**
 * Opacidad por plano. El plano lejano queda en 1: su profundidad la resuelve el
 * tratamiento de capas separadas (cuerpo desenfocado, etiqueta nítida), no una
 * opacidad global, porque acá las píldoras SON la escena y ninguna puede quedar
 * muda.
 */
export const PROBLEMA_UNO_PLANE_OPACITY: Record<ScenePlane, number> = {
  far: 1,
  mid: 0.52,
  near: 0.92,
};

/**
 * Seis capacidades dispersas: sin centro, sin eje y sin agrupamiento. Ninguna se
 * relaciona con otra — los clusters y las conexiones son de la Sección 03.
 *
 * Las rotaciones van de -22° a +21°, bastante más fuertes que el ±7° del Hero, y
 * ningún par comparte ángulo ni altura.
 */
export const PROBLEMA_UNO_PILLS: readonly ScenePillDef[] = [
  { id: "strategy", plane: "far", left: 706, top: 104, width: 198, rotate: -19 },
  { id: "web", plane: "far", left: 1016, top: 452, width: 178, rotate: 21 },
  { id: "analysis", plane: "mid", left: 690, top: 394, width: 206, rotate: 13 },
  { id: "design", plane: "mid", left: 944, top: 700, width: 196, rotate: -9 },
  { id: "content", plane: "near", left: 806, top: 560, width: 240, rotate: -22 },
  { id: "acquisition", plane: "near", left: 646, top: 726, width: 228, rotate: 8 },
];

/**
 * Polvo residual: ocho motas en el cuadrante superior derecho, estela de la
 * explosión del Hero. Sólo vive en la transición; no acompaña a la sección.
 */
export const PROBLEMA_UNO_DUST: ReadonlyArray<{
  x: number;
  y: number;
  r: number;
  opacity: number;
}> = [
  { x: 1276, y: 150, r: 1.6, opacity: 0.5 },
  { x: 1180, y: 196, r: 1.1, opacity: 0.34 },
  { x: 1330, y: 214, r: 1.3, opacity: 0.4 },
  { x: 1120, y: 128, r: 1, opacity: 0.26 },
  { x: 1264, y: 330, r: 1.2, opacity: 0.3 },
  { x: 1352, y: 286, r: 1, opacity: 0.22 },
  { x: 1042, y: 176, r: 1.1, opacity: 0.2 },
  { x: 1210, y: 392, r: 1, opacity: 0.18 },
];

/**
 * Pose aprobada del fragmento guía en esta escena. Se mantiene en la zona
 * SUPERIOR derecha: su altura comunica que acaba de entrar como consecuencia de
 * la explosión del Hero.
 */
export const PROBLEMA_UNO_GUIDE_POSE = {
  left: 1214,
  top: 250,
  width: 104,
  rotate: -24,
} as const;
