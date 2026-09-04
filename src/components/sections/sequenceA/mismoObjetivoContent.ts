// Sección 04 — Un mismo objetivo. Copy y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/04-mismo-objetivo-mockup-final.html.
//
// Fuente única: los consumen el beat pinned (RevealBeat) y el fallback estático
// (sections/RevealSection.tsx) a través de MismoObjetivoComposition.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import { guideAimRotation } from "@/components/brand/guideFragmentGeometry";

export const MISMO_OBJETIVO_COPY = {
  eyebrow: "Un mismo objetivo",
  headlineBefore: "El crecimiento aparece cuando cada parte trabaja sobre ",
  /** Va en --pink. */
  headlineAccent: "el mismo objetivo",
  headlineAfter: ".",
  subtitle: "No hace falta más gente. Hace falta que todo lo que ya se hace apunte al mismo lugar.",
  subtitleMeasureCh: 50,
  /** Medida máxima del headline, centrado. */
  headlineMaxWidth: 900,
} as const;

/**
 * Copy CENTRADO. La 02 lo tiene a la izquierda y la 03 a la derecha; el
 * centrado de la 04 cierra ese vaivén y detiene el movimiento lateral del
 * recorrido. Es parte de lo que comunica la pausa.
 */
export const MISMO_OBJETIVO_COPY_BOX = { top: 168, paddingInline: 72 } as const;

/**
 * La huella del Crystal 5: sólo aristas, centrada en el eje x=720.
 * Su alto sale del viewBox del asset (240 × 184).
 */
export const MISMO_OBJETIVO_FOOTPRINT = {
  centerX: 720,
  top: 452,
  width: 620,
  height: (620 * 184) / 240,
} as const;

/**
 * La Mira, en el NODO CENTRAL de la huella: el punto donde convergen las
 * aristas de los dos cuerpos del Crystal 5. NO es el vértice inferior, que
 * queda bastante más abajo.
 */
export const MISMO_OBJETIVO_TARGET = { x: 720, y: 592, size: 150 } as const;

/** Pose aprobada del fragmento guía, ya orientado. */
export const MISMO_OBJETIVO_GUIDE_BOX = { left: 330, top: 556, width: 92 } as const;

/**
 * ROTACIÓN CALCULADA, no una constante.
 *
 * Se deriva con `guideAimRotation` a partir de la posición y el tamaño reales
 * del fragmento y del centro real de la Mira, para que su VÉRTICE MÁS AGUDO
 * — (117,166), 37.7° de ángulo interno — apunte al objetivo. Con los valores
 * aprobados del mockup da -138.3°, el mismo número que documenta el plan.
 *
 * Si cambian la posición del fragmento, su tamaño o la posición de la Mira,
 * este valor se recalcula solo: no hay que volver a hacer la cuenta a mano.
 */
export const MISMO_OBJETIVO_GUIDE_ROTATION = guideAimRotation(
  MISMO_OBJETIVO_GUIDE_BOX,
  MISMO_OBJETIVO_TARGET,
);
