import { useId, useMemo, type CSSProperties } from "react";
import type { FacetIndex } from "./CrystalFiveApproved";
import { CrystalPieceDefs } from "./CrystalPieceDefs";
import { BACK_FACE_OFFSET, facetPieceGeometry, safePieceId } from "./facetPieceGeometry";

/**
 * Una faceta suelta del Crystal 5, en estado volumétrico.
 *
 * Es la misma pieza que dibuja `CrystalFiveFragmentsApproved` para ese índice,
 * aislada: se le quita el transform de layout del board original y se reencuadra
 * el viewBox al bounding box de la cara más 6 px de margen. LA GEOMETRÍA NO SE
 * TOCA — sale de `FACETS` (ver facetPieceGeometry.ts).
 *
 * La usa la Sección 06 para dar una pieza distinta a cada capacidad.
 * `FACETS[15]` no se pinta con este componente: es el fragmento guía y tiene el
 * suyo, con su inclusión adherida (ver GuideFragment).
 */
export function CrystalFacetPiece({
  index,
  className,
  style,
}: {
  index: FacetIndex;
  className?: string;
  style?: CSSProperties;
}) {
  const uid = safePieceId(useId());
  const geometry = useMemo(() => facetPieceGeometry(index), [index]);
  const fill = (material: string) => `url(#gf-${material}-${uid})`;
  const { x, y, width, height } = geometry.viewBox;

  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <CrystalPieceDefs uid={uid} />

      {/* Espesor: cara posterior desplazada, en material DEEP al 50 %. */}
      <polygon
        points={geometry.points}
        fill={fill("deep")}
        fillOpacity=".5"
        stroke="#4E1830"
        strokeOpacity=".5"
        strokeWidth=".7"
        transform={`translate(${BACK_FACE_OFFSET.x} ${BACK_FACE_OFFSET.y})`}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Cara principal. Las piezas de contorno llevan el relleno oscuro del asset. */}
      <polygon
        points={geometry.points}
        fill={geometry.outlineOnly ? "rgba(20,17,25,.34)" : fill(geometry.material)}
        fillOpacity={geometry.outlineOnly ? 0.42 : geometry.opacity}
        stroke={`url(#gf-edge-${uid})`}
        strokeWidth=".82"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {geometry.innerFaces.map((face) => (
        <polygon
          key={face.points}
          points={face.points}
          fill={fill(face.material)}
          fillOpacity={face.opacity}
          stroke="rgba(255,222,233,.34)"
          strokeWidth=".36"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {geometry.highlight && (
        <path
          d={geometry.highlight}
          fill="none"
          stroke="rgba(255,240,245,.62)"
          strokeWidth=".48"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
