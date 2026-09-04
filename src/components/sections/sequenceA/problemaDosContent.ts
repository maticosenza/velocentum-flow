// Sección 03 — El otro problema. Copy y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/03-problema-mockup-final.html.
//
// Fuente única: los consumen el beat pinned (Dolor2Beat) y el fallback estático
// (sections/Dolores.tsx) a través de ProblemaDosComposition.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import type { ScenePillDef, ScenePlane } from "@/components/scene/ScenePill";

export const PROBLEMA_DOS_COPY = {
  eyebrow: "El otro problema",
  headlineBefore: "Y muchos proveedores sueltos ",
  /** Va en --pink. */
  headlineAccent: "tampoco forman un equipo",
  headlineAfter: ".",
  subtitle:
    "Cada uno hace bien su parte. Nadie mira el conjunto. Las decisiones quedan sin dueño y el negocio avanza a pedazos.",
  subtitleMeasureCh: 44,
} as const;

/**
 * Copy a la DERECHA y alineado a la derecha. Invierte el eje de la Sección 02,
 * que lo tiene a la izquierda: es el cambio de composición que pide el plan.
 */
export const PROBLEMA_DOS_COPY_BOX = { right: 72, top: 200, width: 560 } as const;

/** Zona protegida del copy. El fragmento guía nunca la pisa. */
export const PROBLEMA_DOS_COPY_ZONE = { left: 808, top: 176, right: 1368, bottom: 544 } as const;

/** Campo donde viven los tres clusters. */
export const PROBLEMA_DOS_FIELD = { left: 76, right: 736 } as const;

/** Carril izquierdo: destino del cruce. */
export const PROBLEMA_DOS_LANE = { left: 70, right: 290 } as const;

/**
 * Opacidad por plano. Cambian respecto de la Sección 02 (allá medio .52 y
 * cercano .92): acá la profundidad refuerza el agrupamiento, no la dispersión.
 * El plano lejano queda en 1 porque su profundidad la resuelve el tratamiento
 * de capas separadas, no una opacidad global.
 */
export const PROBLEMA_DOS_PLANE_OPACITY: Record<ScenePlane, number> = {
  far: 1,
  mid: 0.6,
  near: 0.94,
};

/**
 * Tres clusters de dos píldoras, uno por plano de profundidad.
 *
 * Es la diferencia con la Sección 02: allá no había ninguna relación, acá hay
 * grupos. Lo que sigue faltando es el sistema.
 */
export const PROBLEMA_DOS_PILLS: readonly ScenePillDef[] = [
  // Cluster A — lejano
  { id: "strategy", plane: "far", left: 96, top: 186, width: 196, rotate: -8 },
  { id: "analysis", plane: "far", left: 214, top: 274, width: 182, rotate: 5 },
  // Cluster B — cercano
  { id: "content", plane: "near", left: 352, top: 396, width: 238, rotate: -6 },
  { id: "design", plane: "near", left: 498, top: 476, width: 214, rotate: 9 },
  // Cluster C — medio
  { id: "web", plane: "mid", left: 128, top: 556, width: 210, rotate: 7 },
  { id: "acquisition", plane: "mid", left: 300, top: 624, width: 224, rotate: -4 },
];

export type SceneLink = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity: number;
  width: number;
};

/**
 * Una conexión DENTRO de cada cluster y NINGUNA entre clusters: nunca se forma
 * una red completa.
 */
export const PROBLEMA_DOS_LINKS: readonly SceneLink[] = [
  { from: { x: 196, y: 236 }, to: { x: 306, y: 318 }, opacity: 0.3, width: 1.1 },
  { from: { x: 470, y: 452 }, to: { x: 604, y: 522 }, opacity: 0.42, width: 1.3 },
  { from: { x: 232, y: 604 }, to: { x: 406, y: 668 }, opacity: 0.34, width: 1.2 },
];

/**
 * La conexión INCOMPLETA: sale de DISEÑO y se corta en el vacío, sin llegar a
 * ningún destino. Es el elemento que justifica el destello del fragmento.
 */
export const PROBLEMA_DOS_BROKEN_LINK = {
  from: { x: 604, y: 522 },
  to: { x: 676, y: 604 },
  opacity: 0.26,
  width: 1.1,
  dash: "5 7",
  /** Punto tenue del extremo, donde se produce el destello. */
  endpointRadius: 2.6,
  endpointOpacity: 0.5,
} as const;

/** Pose aprobada del fragmento guía en pleno cruce. */
export const PROBLEMA_DOS_GUIDE_POSE = {
  left: 598,
  top: 686,
  width: 98,
  rotate: -58,
} as const;
