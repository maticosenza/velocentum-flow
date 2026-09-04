import { useId, type CSSProperties } from "react";
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

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function GuideDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`gf-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFF7FA" stopOpacity=".92" />
        <stop offset=".2" stopColor="#FFB1CE" />
        <stop offset=".56" stopColor="#F56B9D" />
        <stop offset="1" stopColor="#B32558" />
      </linearGradient>
      <linearGradient id={`gf-hot-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFB0CC" />
        <stop offset=".3" stopColor="#FF5C96" />
        <stop offset=".62" stopColor="#E82C70" />
        <stop offset="1" stopColor="#7C1C40" />
      </linearGradient>
      <linearGradient id={`gf-rose-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#F58FB4" />
        <stop offset=".38" stopColor="#CA3F72" />
        <stop offset="1" stopColor="#5B243B" />
      </linearGradient>
      <linearGradient id={`gf-graphite-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#5D4C5B" />
        <stop offset=".48" stopColor="#332A37" />
        <stop offset="1" stopColor="#17141D" />
      </linearGradient>
      <linearGradient id={`gf-deep-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#9E315E" />
        <stop offset=".42" stopColor="#63213E" />
        <stop offset="1" stopColor="#261A27" />
      </linearGradient>
      <linearGradient id={`gf-edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" stopOpacity=".78" />
        <stop offset=".45" stopColor="#F4B3CA" stopOpacity=".58" />
        <stop offset="1" stopColor="#FF4B8D" stopOpacity=".46" />
      </linearGradient>
    </defs>
  );
}

export function GuideFragment({ className, style }: { className?: string; style?: CSSProperties }) {
  const uid = safeId(useId());
  const fill = (material: string) => `url(#gf-${material}-${uid})`;
  const { x, y, width, height } = GUIDE_FRAGMENT_VIEWBOX;

  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <GuideDefs uid={uid} />

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
