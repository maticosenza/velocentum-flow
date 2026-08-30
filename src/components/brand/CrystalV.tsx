import { useId, type CSSProperties } from "react";

/** Number of animatable facets in the "object" variant, in a fixed order. */
export const CRYSTAL_V_FACET_COUNT = 12;

type CrystalVVariant = "object" | "mark";

type CrystalVProps = {
  variant: CrystalVVariant;
  className?: string;
  style?: CSSProperties;
  /** Called once per facet's wrapping <g>, index 0..CRYSTAL_V_FACET_COUNT-1. Only fires for variant="object". */
  facetRef?: (el: SVGGElement | null, index: number) => void;
  /** Called for the single edges/aristas group. Only fires for variant="object". */
  edgesRef?: (el: SVGGElement | null) => void;
};

// useId() returns something like ":r0:" — the colons aren't safe inside a
// bare url(#...) reference, so strip everything but alnum/-/_ before using it
// to namespace this instance's gradient ids.
function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

// Exact polygon points from the Asset Pack V2 crystal-v-short-b.svg — source
// of truth, not approximated. This fixed 0..11 order is what every consumer
// (Hero, Reveal) keys its per-facet animation state against.
const LEFT_MAIN = "18,18 86,43 112,166 42,121";
const RIGHT_MAIN = "202,17 135,44 112,166 179,117";

type Facet = { points: string; gradient?: "left" | "right"; fill?: string; fillOpacity?: number };

const FACETS: Facet[] = [
  { points: LEFT_MAIN, gradient: "left" },
  { points: RIGHT_MAIN, gradient: "right" },
  { points: "18,18 75,31 86,43 42,121", fill: "#F1AEC6", fillOpacity: 0.62 },
  { points: "18,18 86,43 69,74", fill: "#2A2230", fillOpacity: 0.72 },
  { points: "86,43 112,79 112,166 42,121", fill: "#8E2047", fillOpacity: 0.48 },
  { points: "42,121 86,43 112,79", fill: "#E23872", fillOpacity: 0.68 },
  { points: "202,17 148,31 135,44 179,117", fill: "#DFA3B9", fillOpacity: 0.42 },
  { points: "202,17 135,44 153,70", fill: "#2D2430", fillOpacity: 0.65 },
  { points: "135,44 112,79 112,166 179,117", fill: "#751A3A", fillOpacity: 0.64 },
  { points: "135,44 153,70 112,79", fill: "#D9346D", fillOpacity: 0.74 },
  { points: "75,31 86,43 112,79", fill: "#F7C4D5", fillOpacity: 0.38 },
  { points: "148,31 135,44 112,79", fill: "#FFFFFF", fillOpacity: 0.14 },
];

const EDGE_PATHS = [
  "M18 18L112 166 202 17",
  "M18 18L86 43L112 79L135 44L202 17",
  "M42 121L112 79L179 117",
  "M75 31L112 79L148 31",
  "M86 43L112 166M135 44L112 166",
];

/**
 * Crystal V — the brand's symbol object (Plan Maestro 2026). "mark" is the
 * flat two-polygon reduction for nav/small sizes; "object" is the full
 * twelve-facet version used by Hero/Reveal, with per-facet <g> wrappers so
 * callers can animate each facet's transform independently without ever
 * touching the polygon points themselves.
 */
export function CrystalV({ variant, className, style, facetRef, edgesRef }: CrystalVProps) {
  const uid = sanitizeId(useId());
  const leftGradId = `cv-left-${uid}`;
  const rightGradId = `cv-right-${uid}`;
  const edgeGradId = `cv-edge-${uid}`;

  if (variant === "mark") {
    return (
      <svg viewBox="0 0 220 180" className={className} style={style} aria-hidden="true">
        <polygon points={LEFT_MAIN} fill="var(--pink)" />
        <polygon points={RIGHT_MAIN} fill="var(--pink)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 180" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient
          id={leftGradId}
          x1="18"
          y1="18"
          x2="112"
          y2="166"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFB4CF" />
          <stop offset=".28" stopColor="#F77FA8" />
          <stop offset=".62" stopColor="#D32D68" />
          <stop offset="1" stopColor="#7A193C" />
        </linearGradient>
        <linearGradient
          id={rightGradId}
          x1="202"
          y1="17"
          x2="112"
          y2="166"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8B2CC" />
          <stop offset=".26" stopColor="#E782A5" />
          <stop offset=".58" stopColor="#C92B64" />
          <stop offset="1" stopColor="#661532" />
        </linearGradient>
        <linearGradient id={edgeGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" stopOpacity=".82" />
          <stop offset="1" stopColor="#FF82AE" stopOpacity=".3" />
        </linearGradient>
      </defs>

      <g strokeLinejoin="round">
        {FACETS.map((facet, i) => {
          const fill =
            facet.gradient === "left"
              ? `url(#${leftGradId})`
              : facet.gradient === "right"
                ? `url(#${rightGradId})`
                : facet.fill;
          return (
            <g key={i} ref={(el) => facetRef?.(el, i)}>
              <polygon points={facet.points} fill={fill} fillOpacity={facet.fillOpacity} />
            </g>
          );
        })}

        <g
          ref={edgesRef}
          fill="none"
          stroke={`url(#${edgeGradId})`}
          strokeWidth={1.15}
          strokeOpacity={0.78}
        >
          {EDGE_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
