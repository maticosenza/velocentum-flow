// Geometría del fragmento guía: FACETS[15] con INCLUSIONS[6] adherida.
//
// Vive aparte del componente para que `GuideFragment.tsx` exporte SÓLO el
// componente (regla react-refresh/only-export-components) y para que la
// coreografía pueda importar las medidas sin arrastrar JSX.
//
// La construcción volumétrica es la genérica de `facetPieceGeometry.ts`, la
// misma que usan las piezas de capacidad de la Sección 06. Lo único propio del
// fragmento guía es la inclusión adherida y su encuadre, que es el de los
// mockups aprobados 02 a 07.

import { GUIDE_FACET_INDEX, GUIDE_INCLUSION_INDEX, INCLUSIONS } from "./CrystalFiveApproved";
import { facetPieceGeometry, type Point } from "./facetPieceGeometry";

export type { Point };

const GUIDE_GEOMETRY = facetPieceGeometry(GUIDE_FACET_INDEX);

export const GUIDE_FACET = {
  points: GUIDE_GEOMETRY.points,
  material: GUIDE_GEOMETRY.material,
  opacity: GUIDE_GEOMETRY.opacity,
};
export const GUIDE_INCLUSION = INCLUSIONS[GUIDE_INCLUSION_INDEX];
export const GUIDE_VERTICES = GUIDE_GEOMETRY.vertices;
export const GUIDE_CENTROID = GUIDE_GEOMETRY.centroid;

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

/** Las cuatro caras internas, trianguladas desde el centroide hacia cada arista. */
export const GUIDE_INNER_FACES = GUIDE_GEOMETRY.innerFaces;

/** Reflejo fino desde el centroide hacia el primer vértice. */
export const GUIDE_HIGHLIGHT = GUIDE_GEOMETRY.highlight;

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
