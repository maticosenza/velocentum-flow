import { useId, type CSSProperties } from "react";
import { CrystalPieceDefs } from "./CrystalPieceDefs";
import { safePieceId } from "./facetPieceGeometry";
import {
  GUIDE_FACET,
  GUIDE_FRAGMENT_VIEWBOX,
  GUIDE_HIGHLIGHT,
  GUIDE_INCLUSION,
  GUIDE_INNER_FACES,
} from "./guideFragmentGeometry";

/**
 * El fragmento guía: FACETS[15] con INCLUSIONS[6] adherida, en su estado
 * VOLUMÉTRICO.
 *
 * Es la misma pieza que sale del Hero, ahora con el tratamiento de
 * `official/narrative/crystal-five-fragments-volumetric-approved.svg`, que es
 * lo que muestran los mockups aprobados de las Secciones 02, 03 y 04: cara
 * principal rosa, espesor oscuro desplazado y cuatro caras internas
 * trianguladas desde el centroide. No hay que construir volumen a mano — la
 * construcción está en docs/DESIGN_SYSTEM_CRYSTAL.txt, sección 4, y es la misma
 * que aplica `CrystalFiveFragmentsApproved` a cada faceta.
 *
 * La GEOMETRÍA no se copia: sale de las constantes que exporta el asset (ver
 * guideFragmentGeometry.ts).
 *
 * Los gradientes se redeclaran acá en vez de importarse porque
 * `CrystalFiveApproved.tsx` es un archivo bajo contrato verificado byte a byte y
 * su superficie pública está cerrada. Son los valores publicados de
 * docs/DESIGN_SYSTEM_CRYSTAL.txt sección 3, y
 * `scripts/crystal-five/verify-guide-fragment.ts` comprueba, contra el
 * componente vecino, que sigan coincidiendo stop por stop.
 */

export function GuideFragment({ className, style }: { className?: string; style?: CSSProperties }) {
  const uid = safePieceId(useId());
  const fill = (material: string) => `url(#gf-${material}-${uid})`;
  const { x, y, width, height } = GUIDE_FRAGMENT_VIEWBOX;

  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <CrystalPieceDefs uid={uid} />

      {/* Espesor: cara posterior desplazada 3 / 3.5, en material DEEP al 50 %. */}
      <polygon
        points={GUIDE_FACET.points}
        fill={fill("deep")}
        fillOpacity=".5"
        stroke="#4E1830"
        strokeOpacity=".5"
        strokeWidth=".7"
        transform="translate(3 3.5)"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Cara principal, con el material y la opacidad base de FACETS[15]. */}
      <polygon
        points={GUIDE_FACET.points}
        fill={fill(GUIDE_FACET.material)}
        fillOpacity={GUIDE_FACET.opacity}
        stroke={`url(#gf-edge-${uid})`}
        strokeWidth=".82"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {GUIDE_INNER_FACES.map((face) => (
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

      <path
        d={GUIDE_HIGHLIGHT}
        fill="none"
        stroke="rgba(255,240,245,.62)"
        strokeWidth=".48"
        vectorEffect="non-scaling-stroke"
      />

      {/* INCLUSIONS[6], adherida: viaja con la faceta en todas las secciones. */}
      <polygon
        points={GUIDE_INCLUSION.points}
        fill={fill(GUIDE_INCLUSION.material)}
        fillOpacity={GUIDE_INCLUSION.opacity}
        stroke="rgba(255,222,233,.30)"
        strokeWidth=".36"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
