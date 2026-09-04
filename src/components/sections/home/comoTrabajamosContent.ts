// Sección 05 — Cómo trabajamos. Copy y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/05-como-trabajamos-mockup-final.html.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import { guideAimRotation } from "@/components/brand/guideFragmentGeometry";
import {
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeLinear,
  easeOutCubic,
  type ScenePath,
} from "@/components/scene/scenePath";

export const COMO_TRABAJAMOS_COPY = {
  eyebrow: "Cómo trabajamos",
  headlineBefore: "Un equipo. ",
  /** Va en --pink. */
  headlineAccent: "Cuatro motores",
  headlineAfter: " funcionando juntos.",
  subtitle:
    "Cada motor tiene su oficio. La medición los atraviesa a todos: es lo que permite saber si el conjunto avanza.",
  subtitleMeasureCh: 56,
} as const;

/** Copy centrado arriba. Headline a 48 px: acá el protagonista son las cards. */
export const COMO_TRABAJAMOS_COPY_BOX = { top: 104, paddingInline: 72 } as const;

export type MotorId = "estrategia" | "creatividad" | "adquisicion" | "web";

export type MotorDef = {
  id: MotorId;
  numero: string;
  titulo: string;
  texto: string;
  /** Objeto del sistema asignado, según el mapeo definitivo del plan. */
  objeto: "mira" | "prisma" | "rayo" | "barras";
  left: number;
};

/**
 * Cuatro motores en fila: y=380, alto 340, ancho 306, gap 24, márgenes 72.
 *
 * Mapeo definitivo: los cuatro objetos del sistema van en las cards y la
 * medición se expresa como escala transversal. Si las Barras se reservaran para
 * la capa transversal quedarían tres objetos para cuatro cards.
 */
export const COMO_TRABAJAMOS_CARDS: readonly MotorDef[] = [
  {
    id: "estrategia",
    numero: "01",
    titulo: "Estrategia",
    texto: "Definimos a dónde vamos y con qué prioridad.",
    objeto: "mira",
    left: 72,
  },
  {
    id: "creatividad",
    numero: "02",
    titulo: "Creatividad",
    texto: "Convertimos una idea en muchas piezas que compiten.",
    objeto: "prisma",
    left: 402,
  },
  {
    id: "adquisicion",
    numero: "03",
    titulo: "Adquisición",
    texto: "Llevamos esas piezas al mercado y compramos atención.",
    objeto: "rayo",
    left: 732,
  },
  {
    id: "web",
    numero: "04",
    titulo: "Web & Conversión",
    texto: "Ordenamos lo que pasa después del clic.",
    objeto: "barras",
    left: 1062,
  },
];

export const COMO_TRABAJAMOS_ROW = { top: 380, height: 340, width: 306, gap: 24 } as const;

/**
 * MEDICIÓN — escala transversal derivada del ScrollAxis oficial, reorientado de
 * vertical a horizontal. NO es una quinta card: atraviesa y relaciona los cuatro
 * módulos, con una sola leyenda al inicio y sin etiqueta por nodo.
 */
export const COMO_TRABAJAMOS_SCALE = {
  y: 596,
  strokeOpacity: 0.26,
  strokeWidth: 1.1,
  tickFrom: 96,
  tickStep: 34,
  tickCount: 39,
  /** Un nodo por módulo, alineado al centro de cada card. */
  nodes: [225, 555, 885, 1215],
  /** El nodo que el fragmento activa a distancia. */
  activeNodeIndex: 0,
  legend: { text: "MEDICIÓN", x: 20, y: 582 },
} as const;

/** Ticks regulares cada 34 px, derivados y no escritos uno por uno. */
export const COMO_TRABAJAMOS_TICKS: readonly number[] = Array.from(
  { length: COMO_TRABAJAMOS_SCALE.tickCount },
  (_, index) => COMO_TRABAJAMOS_SCALE.tickFrom + index * COMO_TRABAJAMOS_SCALE.tickStep,
);

/**
 * Pose aprobada del fragmento guía: alineado en el canal superior, centrado
 * sobre la vertical del nodo 01. Su cuerpo termina en y=374 y las cards empiezan
 * en 380, así que nunca las toca.
 */
export const COMO_TRABAJAMOS_GUIDE_BOX = { left: 179, top: 280, width: 92 } as const;

/**
 * ROTACIÓN CALCULADA, no una constante.
 *
 * El fragmento tiene que apuntar VERTICAL HACIA ABAJO, al nodo 01. Se deriva con
 * `guideAimRotation` desde la caja real del fragmento hacia el nodo: el vector
 * centro-punta sin rotar mide 136.5° y el deseado 90°, así que la rotación es
 * 90 − 136.5 = −46.5°. Si cambian la posición del fragmento, su tamaño, las
 * cards o la altura de la escala, este valor se recalcula solo.
 */
export const COMO_TRABAJAMOS_GUIDE_ROTATION = guideAimRotation(COMO_TRABAJAMOS_GUIDE_BOX, {
  x: COMO_TRABAJAMOS_SCALE.nodes[COMO_TRABAJAMOS_SCALE.activeNodeIndex] ?? 225,
  y: COMO_TRABAJAMOS_SCALE.y,
});

/**
 * Donde termina el cuerpo del fragmento: es donde arranca el haz del pulso.
 * Derivado de la caja, no escrito a mano — las cards empiezan en y=380, así que
 * este valor demuestra que el objeto nunca las toca.
 */
export const COMO_TRABAJAMOS_PULSE_FROM =
  COMO_TRABAJAMOS_GUIDE_BOX.top + (COMO_TRABAJAMOS_GUIDE_BOX.width * 90) / 88;

/** Las tres zonas por las que puede pasar el fragmento. Nunca sale de ellas. */
export const COMO_TRABAJAMOS_ZONES = {
  upperChannel: { top: 276, bottom: 376 },
  leftMargin: { left: 0, right: 72 },
  lowerChannel: { top: 736, bottom: 802 },
} as const;

/** Centro de la pose aprobada. */
const KEY = {
  x: COMO_TRABAJAMOS_GUIDE_BOX.left + COMO_TRABAJAMOS_GUIDE_BOX.width / 2,
  y: COMO_TRABAJAMOS_GUIDE_BOX.top + (COMO_TRABAJAMOS_GUIDE_BOX.width * 90) / 88 / 2,
};

/** `s` en el que el fragmento está exactamente en la pose aprobada. */
const S_ALIGNED = 0.34;

/**
 * Recorrido en cinco pasos: entra por el canal superior desde la derecha, se
 * alinea sobre el nodo 01 y lo activa a distancia, va al margen exterior
 * izquierdo, desciende por fuera de la fila y entra al canal inferior.
 *
 * Empieza y termina FUERA del lienzo: el empalme con las secciones vecinas no
 * se ve. Los puntos de control son los de la capa de anotación "Recorrido del
 * fragmento" del mockup.
 */
export const COMO_TRABAJAMOS_GUIDE_PATH: ScenePath = {
  width: COMO_TRABAJAMOS_GUIDE_BOX.width,
  path: [
    {
      from: { x: 1580, y: 326 },
      c1: { x: 1100, y: 332 },
      c2: { x: 640, y: 331 },
      to: KEY,
      sFrom: 0,
      sTo: S_ALIGNED,
    },
    // Cruza el canal a altura constante: la caja del fragmento mide 94 px y el
    // canal 100, así que cualquier desvío vertical la sacaría de la franja.
    {
      from: KEY,
      c1: { x: 150, y: 327 },
      c2: { x: 70, y: 327 },
      to: { x: 24, y: 327 },
      sFrom: S_ALIGNED,
      sTo: 0.5,
    },
    // Desciende pegado al margen: con el centro en x=24 la caja llega a x=70 y
    // las cards empiezan en 72, así que no las toca en ningún punto del descenso.
    {
      from: { x: 24, y: 327 },
      c1: { x: 22, y: 490 },
      c2: { x: 24, y: 655 },
      to: { x: 24, y: 772 },
      sFrom: 0.5,
      sTo: 0.82,
    },
    // Recién con la caja por debajo de la fila (y ≥ 725, fila hasta 720) se
    // permite avanzar hacia la derecha por el canal inferior.
    {
      from: { x: 24, y: 772 },
      c1: { x: 46, y: 790 },
      c2: { x: 170, y: 788 },
      to: { x: 300, y: 782 },
      sFrom: 0.82,
      sTo: 0.93,
    },
    {
      from: { x: 300, y: 782 },
      c1: { x: 292, y: 880 },
      c2: { x: 262, y: 970 },
      to: { x: 236, y: 1060 },
      sFrom: 0.93,
      sTo: 1,
    },
  ],
  // Se alinea, SE QUEDA QUIETO mientras el pulso hace el trabajo, y recién
  // después sigue. El tramo plano es lo que permite leer la activación.
  timing: [
    { from: 0, to: 0.32, sFrom: 0, sTo: S_ALIGNED, ease: easeOutCubic },
    { from: 0.32, to: 0.52, sFrom: S_ALIGNED, sTo: S_ALIGNED, ease: easeLinear },
    { from: 0.52, to: 0.68, sFrom: S_ALIGNED, sTo: 0.5, ease: easeInOutSine },
    { from: 0.68, to: 0.9, sFrom: 0.5, sTo: 0.82, ease: easeInOutCubic },
    { from: 0.9, to: 1, sFrom: 0.82, sTo: 1, ease: easeInCubic },
  ],
  rotation: [
    { s: 0, deg: -28 },
    { s: S_ALIGNED, deg: COMO_TRABAJAMOS_GUIDE_ROTATION },
    { s: 0.5, deg: -62 },
    { s: 0.82, deg: -84 },
    { s: 1, deg: -100 },
  ],
};

/** Progreso local en el que el fragmento está en la pose aprobada del mockup. */
export const COMO_TRABAJAMOS_GUIDE_REST = 0.42;

/**
 * Intensidad del pulso vertical de activación, 0 a 1.
 *
 * Sube cuando el fragmento ya está alineado y baja antes de que se vaya: cae
 * dentro del tramo quieto de la línea de tiempo, no en la entrada ni en la
 * salida. Es una función pura del progreso local.
 */
export function comoTrabajamosPulse(local: number): number {
  const start = 0.3;
  const end = 0.56;
  if (local <= start || local >= end) return 0;
  return Math.sin((Math.PI * (local - start)) / (end - start)) ** 2;
}
