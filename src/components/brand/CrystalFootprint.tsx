import type { CSSProperties } from "react";
import { CRYSTAL_FIVE_EDGE_PATHS } from "./CrystalFiveApproved";

/**
 * La HUELLA del Crystal 5: únicamente aristas, sin ningún relleno.
 *
 * NO ES UNA RECONSTRUCCIÓN. Es el lugar donde el objeto estuvo. La
 * reconstrucción real está reservada para la Sección 09 — Empecemos.
 *
 * Las cuatro aristas continuas son las del asset (`CRYSTAL_FIVE_EDGE_PATHS`).
 * Las tres restantes son cortes internos entre vértices reales de las facetas,
 * que el Mockup 04 agrega para que la huella se lea completa; no inventan
 * geometría: todos sus puntos existen en FACETS.
 */
const FOOTPRINT_INNER_PATHS = [
  "M20 23L62 54M82 37L91 72M72 92L44 118M104 108L44 118",
  "M221 22L181 59M168 39L150 72M150 72L164 89M164 89L193 116",
  "M139 102L164 89M139 102L117 166M111 86L104 108",
] as const;

export const CRYSTAL_FOOTPRINT_VIEWBOX = { width: 240, height: 184 } as const;

export function CrystalFootprint({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={`0 0 ${CRYSTAL_FOOTPRINT_VIEWBOX.width} ${CRYSTAL_FOOTPRINT_VIEWBOX.height}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="var(--pink)"
        strokeOpacity=".15"
        strokeWidth=".55"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {[...CRYSTAL_FIVE_EDGE_PATHS, ...FOOTPRINT_INNER_PATHS].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
