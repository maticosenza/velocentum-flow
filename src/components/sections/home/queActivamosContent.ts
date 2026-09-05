// Sección 06 — Qué activamos. Copy y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/06-que-activamos-mockup-final.html.
//
// CONTRADICCIÓN VIVA, PENDIENTE DE RESOLVER EN UN BLOQUE POSTERIOR:
// los NOMBRES de las seis capacidades venían de
// src/components/sections/Servicios.tsx. Ese archivo ya pasó a los cuatro
// motores, porque el plan fusiona esta sección dentro de la 05 «Cómo
// trabajamos»: Branding se absorbe en Creatividad e Influencer Marketing sale
// del sitio. Las seis capacidades de acá abajo son las de ANTES de esa
// fusión, y hoy ya no tienen fuente funcional que las respalde.
// Este archivo y QueActivamos.tsx se eliminan cuando se implemente la fusión.
// Hasta entonces NO tomar esta lista como referencia. El resto del copy es
// del plan.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import type { FacetIndex } from "@/components/brand/CrystalFiveApproved";
import {
  easeInCubic,
  easeLinear,
  easeOutCubic,
  type ScenePath,
} from "@/components/scene/scenePath";

export const QUE_ACTIVAMOS_COPY = {
  eyebrow: "Qué activamos",
  headlineBefore: "Activamos lo que tu negocio ",
  /** Va en --pink. */
  headlineAccent: "necesita para crecer",
  headlineAfter: ".",
  /**
   * OBLIGATORIO: es lo que impide que la sección se lea como un menú de
   * servicios. Sin este subtítulo la lista pierde su razón de ser.
   */
  subtitle:
    "No activamos todo porque sí. Elegimos la combinación que destraba el crecimiento y prepara el siguiente paso.",
  subtitleMeasureCh: 58,
} as const;

export const QUE_ACTIVAMOS_COPY_BOX = { top: 96, paddingInline: 72 } as const;

/**
 * Canal de ~100 px entre el copy y el carrusel. NO SE REDUCE: es aire de
 * composición y el canal narrativo por donde pasa el fragmento guía.
 */
export const QUE_ACTIVAMOS_CHANNEL = { top: 286, bottom: 392 } as const;

export type CapacidadDef = {
  numero: string;
  titulo: string;
  texto: string;
  /**
   * Pieza volumétrica del Crystal 5. Las seis facetas se eligieron por tener
   * siluetas y cantidad de vértices bien distintos entre sí.
   * FACETS[15] no está: sigue reservada como fragmento guía.
   */
  facet: FacetIndex;
  left: number;
};

/**
 * Carrusel de seis capacidades: y=396, alto 316, módulo 280, gap 20.
 * El primero y el último quedan parcialmente fuera de cuadro.
 */
export const QUE_ACTIVAMOS_CAPACIDADES: readonly CapacidadDef[] = [
  {
    numero: "01",
    titulo: "Estrategia & Growth",
    texto: "Dónde crecer, con qué prioridad y en qué orden.",
    facet: 2,
    left: -90,
  },
  {
    numero: "02",
    titulo: "Contenido & Creatividad",
    texto: "Piezas pensadas para competir, no para llenar el feed.",
    facet: 17,
    left: 210,
  },
  {
    numero: "03",
    titulo: "Paid Media",
    texto: "Inversión que se optimiza sobre venta real.",
    facet: 10,
    left: 510,
  },
  {
    numero: "04",
    titulo: "Web & Conversión",
    texto: "Lo que pasa después del clic, ordenado.",
    facet: 7,
    left: 810,
  },
  {
    numero: "05",
    titulo: "Branding",
    texto: "Una identidad que sostiene todo lo demás.",
    facet: 11,
    left: 1110,
  },
  {
    numero: "06",
    titulo: "Influencer Marketing",
    texto: "Colaboraciones con seguimiento, no canjes sueltos.",
    facet: 5,
    left: 1410,
  },
];

export const QUE_ACTIVAMOS_RAIL = {
  top: 396,
  height: 316,
  module: 280,
  gap: 20,
  /** Máscara de degradado a cada lado: la lista se lee como que continúa. */
  fade: 120,
  fadeTop: 386,
  fadeHeight: 336,
} as const;

/** El módulo activo del mockup. La combinación se elige, no se muestra entera. */
export const QUE_ACTIVAMOS_ACTIVE_INDEX = 2;

/**
 * Deriva horizontal del carrusel a lo largo de la sección. En el centro de la
 * sección los seis módulos están exactamente en las posiciones aprobadas.
 */
export const QUE_ACTIVAMOS_RAIL_DRIFT = 600;

export function queActivamosRailOffset(local: number): number {
  return -QUE_ACTIVAMOS_RAIL_DRIFT * (local - 0.5);
}

/** Pose aprobada del fragmento guía, dentro del canal y por encima del rail. */
export const QUE_ACTIVAMOS_GUIDE_BOX = { left: 96, top: 292, width: 84 } as const;
export const QUE_ACTIVAMOS_GUIDE_ROTATION = -14;

const KEY = {
  x: QUE_ACTIVAMOS_GUIDE_BOX.left + QUE_ACTIVAMOS_GUIDE_BOX.width / 2,
  y: QUE_ACTIVAMOS_GUIDE_BOX.top + (QUE_ACTIVAMOS_GUIDE_BOX.width * 90) / 88 / 2,
};

/**
 * Entra por el MARGEN EXTERIOR IZQUIERDO, continuando el descenso y el canal
 * inferior con los que cerró la Sección 05. No reaparece del otro lado.
 *
 * Atraviesa el canal en deriva lenta y sigue hacia el borde exterior de la
 * Sección 07. Empieza y termina fuera del lienzo.
 */
export const QUE_ACTIVAMOS_GUIDE_PATH: ScenePath = {
  width: QUE_ACTIVAMOS_GUIDE_BOX.width,
  path: [
    {
      from: { x: -130, y: 268 },
      c1: { x: -50, y: 318 },
      c2: { x: 20, y: 338 },
      to: KEY,
      sFrom: 0,
      sTo: 0.34,
    },
    // Deriva lenta por el canal: recorre poco mientras el carrusel avanza mucho.
    {
      from: KEY,
      c1: { x: 200, y: 340 },
      c2: { x: 250, y: 340 },
      to: { x: 300, y: 338 },
      sFrom: 0.34,
      sTo: 0.62,
    },
    {
      from: { x: 300, y: 338 },
      c1: { x: 700, y: 344 },
      c2: { x: 1120, y: 342 },
      to: { x: 1360, y: 344 },
      sFrom: 0.62,
      sTo: 0.9,
    },
    {
      from: { x: 1360, y: 344 },
      c1: { x: 1450, y: 346 },
      c2: { x: 1540, y: 352 },
      to: { x: 1620, y: 368 },
      sFrom: 0.9,
      sTo: 1,
    },
  ],
  timing: [
    { from: 0, to: 0.42, sFrom: 0, sTo: 0.34, ease: easeOutCubic },
    // Deriva a paso constante: cualquier easing con pico haría que, en el medio,
    // el fragmento superara la velocidad del carrusel.
    { from: 0.42, to: 0.78, sFrom: 0.34, sTo: 0.62, ease: easeLinear },
    { from: 0.78, to: 1, sFrom: 0.62, sTo: 1, ease: easeInCubic },
  ],
  rotation: [
    { s: 0, deg: -30 },
    { s: 0.34, deg: QUE_ACTIVAMOS_GUIDE_ROTATION },
    { s: 0.62, deg: -6 },
    { s: 1, deg: 8 },
  ],
};

export const QUE_ACTIVAMOS_GUIDE_REST = 0.42;

/**
 * Ventana en la que el fragmento ATRAVIESA EL CANAL en deriva lenta.
 *
 * Es el tramo que el plan compara con el carrusel: durante toda esta ventana el
 * fragmento avanza menos que el rail. La entrada y la salida son transiciones
 * hacia y desde fuera de cuadro, no parte de la deriva.
 */
export const QUE_ACTIVAMOS_DRIFT_WINDOW = { from: 0.42, to: 0.78 } as const;
