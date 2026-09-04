// Geometría de UNA faceta del Crystal 5 en su estado VOLUMÉTRICO.
//
// Es la misma construcción que aplica `CrystalFiveFragmentsApproved` a cada
// pieza, documentada en docs/DESIGN_SYSTEM_CRYSTAL.txt sección 4: cara posterior
// desplazada 3 / 3.5 en material DEEP al 50 %, cara frontal con el material y la
// opacidad base de la faceta, cuatro o cinco caras internas trianguladas desde
// el centroide, y un reflejo fino. Algunas piezas quedan en tratamiento de
// contorno.
//
// Nada de esto se copia del asset: sale de `FACETS`, que `CrystalFiveApproved`
// exporta, y las reglas de material se derivan igual que en el componente
// vecino. Lo comprueba `scripts/crystal-five/verify-guide-fragment.ts`.

import { FACETS, type FacetIndex } from "./CrystalFiveApproved";

export type Point = [number, number];

export function parsePoints(points: string): Point[] {
  const values = points.split(/[ ,]+/).map(Number);
  const out: Point[] = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    out.push([values[index] ?? 0, values[index + 1] ?? 0]);
  }
  return out;
}

export function centroidOf(vertices: readonly Point[]): Point {
  const sum = vertices.reduce<Point>((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0, 0]);
  return [sum[0] / vertices.length, sum[1] / vertices.length];
}

/** Desplazamiento de la cara posterior que da el espesor. */
export const BACK_FACE_OFFSET = { x: 3, y: 3.5 } as const;

/**
 * Las cuatro piezas que el asset deja en TRATAMIENTO DE CONTORNO: sin caras
 * internas ni reflejo, con un relleno oscuro casi transparente.
 */
const OUTLINE_ONLY = new Set<number>([0, 5, 9, 14]);

// Alternancia de materiales de las caras internas, tal como la define el asset.
const FACE_MATERIALS = ["light", "graphite", "hot", "deep"] as const;

export type InnerFace = { points: string; material: string; opacity: number };

export type FacetPieceGeometry = {
  index: number;
  /** Puntos de la cara, tal cual los exporta el asset. */
  points: string;
  material: string;
  opacity: number;
  outlineOnly: boolean;
  vertices: Point[];
  centroid: Point;
  innerFaces: InnerFace[];
  /** Reflejo desde el centroide hacia el primer vértice. Vacío si es contorno. */
  highlight: string;
  /** Encuadre: bounding box de la cara más 6 px de margen. */
  viewBox: { x: number; y: number; width: number; height: number };
};

/** Bounding box de la cara, más `margin` de margen en los cuatro lados. */
export function facetViewBox(vertices: readonly Point[], margin = 6) {
  const xs = vertices.map((v) => v[0]);
  const ys = vertices.map((v) => v[1]);
  const x = Math.min(...xs) - margin;
  const y = Math.min(...ys) - margin;
  return {
    x,
    y,
    width: Math.max(...xs) + margin - x,
    height: Math.max(...ys) + margin - y,
  };
}

export function facetPieceGeometry(index: FacetIndex): FacetPieceGeometry {
  const facet = FACETS[index];
  const vertices = parsePoints(facet.points);
  const centroid = centroidOf(vertices);
  const outlineOnly = OUTLINE_ONLY.has(index);

  const innerFaces: InnerFace[] = outlineOnly
    ? []
    : vertices.map((vertex, faceIndex) => {
        const next = vertices[(faceIndex + 1) % vertices.length] ?? vertex;
        const step = index + faceIndex;
        return {
          points: `${centroid[0]},${centroid[1]} ${vertex[0]},${vertex[1]} ${next[0]},${next[1]}`,
          material: FACE_MATERIALS[step % FACE_MATERIALS.length] ?? "light",
          opacity: 0.22 + (step % 3) * 0.09,
        };
      });

  const first = vertices[0];
  return {
    index,
    points: facet.points,
    material: facet.material,
    opacity: facet.opacity,
    outlineOnly,
    vertices,
    centroid,
    innerFaces,
    highlight:
      outlineOnly || !first ? "" : `M${centroid[0]} ${centroid[1]}L${first[0]} ${first[1]}`,
    viewBox: facetViewBox(vertices),
  };
}

/** Sanea el `useId()` de React para poder usarlo dentro de `url(#...)`. */
export function safePieceId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}
