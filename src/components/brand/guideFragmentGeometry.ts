// Geometría del fragmento guía: FACETS[15] con INCLUSIONS[6] adherida.
//
// Vive aparte del componente para que `GuideFragment.tsx` exporte SÓLO el
// componente (regla react-refresh/only-export-components) y para que la
// coreografía pueda importar las medidas sin arrastrar JSX.
//
// Nada de esto se copia del asset: sale de las constantes que
// `CrystalFiveApproved` exporta, y las caras internas se derivan con la misma
// regla que aplica `CrystalFiveFragmentsApproved`. Lo verifica
// `scripts/crystal-five/verify-guide-fragment.ts`.

import {
  FACETS,
  GUIDE_FACET_INDEX,
  GUIDE_INCLUSION_INDEX,
  INCLUSIONS,
} from "./CrystalFiveApproved";

export type Point = [number, number];

function parsePoints(points: string): Point[] {
  const values = points.split(/[ ,]+/).map(Number);
  const out: Point[] = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    out.push([values[index] ?? 0, values[index + 1] ?? 0]);
  }
  return out;
}

function centroidOf(vertices: Point[]): Point {
  const sum = vertices.reduce<Point>((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0, 0]);
  return [sum[0] / vertices.length, sum[1] / vertices.length];
}

export const GUIDE_FACET = FACETS[GUIDE_FACET_INDEX];
export const GUIDE_INCLUSION = INCLUSIONS[GUIDE_INCLUSION_INDEX];
export const GUIDE_VERTICES = parsePoints(GUIDE_FACET.points);
export const GUIDE_CENTROID = centroidOf(GUIDE_VERTICES);

/**
 * El vértice más agudo de FACETS[15]: 37.7° de ángulo interno, contra 136.4°
 * en (139,102), 109.6° en (164,89) y 76.3° en (193,116). Es la punta que la
 * Sección 04 orienta hacia el centro de la Mira.
 */
export const GUIDE_SHARP_VERTEX: Point = [117, 166];

/**
 * viewBox que encuadra la pieza completa — cara, espesor desplazado (3 / 3.5) e
 * inclusión — con un margen mínimo. Es el mismo de los tres mockups aprobados.
 */
export const GUIDE_FRAGMENT_VIEWBOX = { x: 112, y: 84, width: 88, height: 90 } as const;

/** Alto del elemento para un ancho dado, en las unidades del lienzo. */
export function guideFragmentHeight(width: number): number {
  return (width * GUIDE_FRAGMENT_VIEWBOX.height) / GUIDE_FRAGMENT_VIEWBOX.width;
}

// Misma regla de materiales que CrystalFiveFragmentsApproved aplica a la faceta
// de índice 15: alternancia LIGHT / GRAPHITE / HOT / DEEP y opacidad escalonada.
const FACE_MATERIALS = ["light", "graphite", "hot", "deep"] as const;

/** Las cuatro caras internas, trianguladas desde el centroide hacia cada arista. */
export const GUIDE_INNER_FACES = GUIDE_VERTICES.map((vertex, index) => {
  const next = GUIDE_VERTICES[(index + 1) % GUIDE_VERTICES.length] ?? vertex;
  const step = GUIDE_FACET_INDEX + index;
  return {
    points: `${GUIDE_CENTROID[0]},${GUIDE_CENTROID[1]} ${vertex[0]},${vertex[1]} ${next[0]},${next[1]}`,
    material: FACE_MATERIALS[step % FACE_MATERIALS.length] ?? "light",
    opacity: 0.22 + (step % 3) * 0.09,
  };
});

/** Reflejo fino desde el centroide hacia el primer vértice. */
export const GUIDE_HIGHLIGHT = `M${GUIDE_CENTROID[0]} ${GUIDE_CENTROID[1]}L${GUIDE_VERTICES[0]?.[0] ?? 0} ${GUIDE_VERTICES[0]?.[1] ?? 0}`;

/**
 * Rotación, en grados, que deja el VÉRTICE AGUDO del fragmento apuntando al
 * punto `target`.
 *
 * No es un valor estético ni una constante: es una relación espacial. Si cambia
 * la posición del fragmento, su tamaño o el destino, esta función devuelve el
 * ángulo nuevo sin que haya que recalcularlo a mano.
 *
 *   1. Vector desde el centro de rotación del elemento hasta el vértice agudo,
 *      sin rotar.
 *   2. Vector desde ese mismo centro hasta el destino.
 *   3. Rotación = ángulo(2) − ángulo(1).
 *
 * Todo en unidades del lienzo 1440 × 900.
 */
export function guideAimRotation(
  box: { left: number; top: number; width: number },
  target: { x: number; y: number },
): number {
  const scale = box.width / GUIDE_FRAGMENT_VIEWBOX.width;
  const height = guideFragmentHeight(box.width);
  const center = { x: box.left + box.width / 2, y: box.top + height / 2 };
  const vertex = {
    x: box.left + (GUIDE_SHARP_VERTEX[0] - GUIDE_FRAGMENT_VIEWBOX.x) * scale,
    y: box.top + (GUIDE_SHARP_VERTEX[1] - GUIDE_FRAGMENT_VIEWBOX.y) * scale,
  };
  const toVertex = Math.atan2(vertex.y - center.y, vertex.x - center.x);
  const toTarget = Math.atan2(target.y - center.y, target.x - center.x);
  return ((toTarget - toVertex) * 180) / Math.PI;
}
