// Sección 07 — Trabajos. GEOMETRÍA de la escena, aprobada en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/07-trabajos-mockup-final.html.
//
// El CONTENIDO no vive acá: los trece videos con su playbackId, las tres cards
// de texto y los once tags siguen en src/components/sections/Trabajos.tsx, que
// AGENTS.md fija como fuente funcional de esos datos.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import { easeInCubic, easeOutCubic, type ScenePath } from "@/components/scene/scenePath";

export const TRABAJOS_COPY = {
  eyebrow: "Trabajos",
  headlineLine1: "Trabajo real,",
  headlineLine2: "pensado para hacer crecer marcas.",
  cta: "Ver casos",
} as const;

/**
 * Copy centrado arriba. El eyebrow va en --on-dark-2, NO en --pink: es la única
 * sección de la HOME donde el sistema gráfico baja su intensidad y el rosa queda
 * reservado a las cards de texto y al CTA.
 */
export const TRABAJOS_COPY_BOX = { top: 64, paddingInline: 72 } as const;

/**
 * FRANJA EXTERIOR SUPERIOR DEL TRACK: la única zona donde puede estar el
 * fragmento guía.
 */
export const TRABAJOS_STRIP = { top: 196, bottom: 292 } as const;

/**
 * El track. Todo su rectángulo es ZONA PROHIBIDA para el fragmento: no cruza
 * videos, controles ni modal.
 */
export const TRABAJOS_TRACK = {
  top: 300,
  height: 356,
  videoWidth: 200,
  textWidth: 268,
  gap: 20,
  radius: 16,
  /** Corte en ambos bordes con máscara de degradado. */
  fade: 96,
  fadeTop: 292,
  fadeHeight: 372,
} as const;

export const TRABAJOS_MARQUEE_TOP = 696;
export const TRABAJOS_CTA_TOP = 766;

/** Pose aprobada del fragmento guía, dentro de la franja exterior superior. */
export const TRABAJOS_GUIDE_BOX = { left: 1302, top: 204, width: 78 } as const;
export const TRABAJOS_GUIDE_ROTATION = -16;
export const TRABAJOS_GUIDE_OPACITY = 0.9;

const KEY = {
  x: TRABAJOS_GUIDE_BOX.left + TRABAJOS_GUIDE_BOX.width / 2,
  y: TRABAJOS_GUIDE_BOX.top + (TRABAJOS_GUIDE_BOX.width * 90) / 88 / 2,
};

/**
 * Entra por el borde exterior con el que cerró la Sección 06 y PERMANECE en la
 * franja superior. No cruza el track. Empieza y termina fuera del lienzo.
 */
export const TRABAJOS_GUIDE_PATH: ScenePath = {
  width: TRABAJOS_GUIDE_BOX.width,
  path: [
    {
      from: { x: -140, y: 248 },
      c1: { x: 400, y: 250 },
      c2: { x: 900, y: 246 },
      to: KEY,
      sFrom: 0,
      sTo: 0.8,
    },
    {
      from: KEY,
      c1: { x: 1430, y: 245 },
      c2: { x: 1520, y: 247 },
      to: { x: 1620, y: 250 },
      sFrom: 0.8,
      sTo: 1,
    },
  ],
  timing: [
    { from: 0, to: 0.62, sFrom: 0, sTo: 0.8, ease: easeOutCubic },
    { from: 0.62, to: 1, sFrom: 0.8, sTo: 1, ease: easeInCubic },
  ],
  rotation: [
    { s: 0, deg: -24 },
    { s: 0.8, deg: TRABAJOS_GUIDE_ROTATION },
    { s: 1, deg: -10 },
  ],
};

export const TRABAJOS_GUIDE_REST = 0.62;

/**
 * Posición x de cada item del track, derivada de la secuencia real: videos de
 * 200 px, cards de texto de 268 y gap de 20. El primero arranca cortado por el
 * borde izquierdo, como en el mockup.
 */
export function trabajosTrackPositions(kinds: ReadonlyArray<"video" | "text">): number[] {
  const out: number[] = [];
  let x = -64;
  for (const kind of kinds) {
    out.push(x);
    x +=
      (kind === "video" ? TRABAJOS_TRACK.videoWidth : TRABAJOS_TRACK.textWidth) +
      TRABAJOS_TRACK.gap;
  }
  return out;
}
