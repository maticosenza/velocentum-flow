import { useId, type CSSProperties } from "react";

type CrystalProposalProps = {
  className?: string;
  style?: CSSProperties;
};

type Material = "light" | "hot" | "rose" | "graphite" | "deep" | "glass";

type Facet = {
  points: string;
  material: Material;
  opacity?: number;
};

// Nueva geometría para Crystal 5. Conserva la silueta ancha del objeto narrativo,
// pero sus cortes son deliberadamente asimétricos y siguen el mismo criterio del
// isotipo original del design system: superposición de caras, grafito, rosa y luz.
const FACETS: Facet[] = [
  { points: "20,23 82,37 62,54", material: "glass", opacity: 0.72 },
  { points: "20,23 62,54 44,118", material: "hot", opacity: 0.9 },
  { points: "62,54 82,37 111,86 91,72", material: "graphite", opacity: 0.92 },
  { points: "62,54 91,72 72,92", material: "light", opacity: 0.88 },
  { points: "62,54 72,92 44,118", material: "rose", opacity: 0.9 },
  { points: "72,92 111,86 104,108", material: "deep", opacity: 0.84 },
  { points: "72,92 104,108 44,118", material: "graphite", opacity: 0.78 },
  { points: "44,118 104,108 117,166", material: "rose", opacity: 0.76 },
  { points: "104,108 111,86 117,166", material: "deep", opacity: 0.88 },
  { points: "221,22 168,39 181,59", material: "glass", opacity: 0.64 },
  { points: "221,22 181,59 193,116", material: "light", opacity: 0.9 },
  { points: "168,39 124,78 150,72 181,59", material: "graphite", opacity: 0.86 },
  { points: "150,72 124,78 139,102", material: "hot", opacity: 0.94 },
  { points: "150,72 181,59 164,89", material: "rose", opacity: 0.88 },
  { points: "164,89 181,59 193,116", material: "graphite", opacity: 0.88 },
  { points: "139,102 164,89 193,116 117,166", material: "rose", opacity: 0.74 },
  { points: "124,78 139,102 117,166", material: "deep", opacity: 0.9 },
  {
    points: "111,86 124,78 139,102 117,166 104,108",
    material: "graphite",
    opacity: 0.58,
  },
];

const INCLUSIONS: Facet[] = [
  { points: "31,37 54,49 45,76", material: "light", opacity: 0.3 },
  { points: "51,108 73,95 65,114", material: "hot", opacity: 0.42 },
  { points: "82,43 102,72 91,68", material: "deep", opacity: 0.56 },
  { points: "108,112 117,99 114,145", material: "glass", opacity: 0.28 },
  { points: "146,82 161,76 153,96", material: "hot", opacity: 0.42 },
  { points: "173,69 195,47 187,86", material: "deep", opacity: 0.46 },
  { points: "148,118 167,101 158,126", material: "graphite", opacity: 0.5 },
];

const FRAGMENT_POSES: Array<{ x: number; y: number; rotate: number; scale: number }> = [
  { x: 68, y: 42, rotate: -20, scale: 0.39 },
  { x: 112, y: 80, rotate: 13, scale: 0.68 },
  { x: 94, y: 112, rotate: -9, scale: 0.62 },
  { x: 49, y: 76, rotate: 21, scale: 0.42 },
  { x: 145, y: 62, rotate: -16, scale: 0.5 },
  { x: 202, y: 57, rotate: 18, scale: 0.34 },
  { x: 177, y: 98, rotate: -14, scale: 0.62 },
  { x: 126, y: 131, rotate: 9, scale: 0.66 },
  { x: 150, y: 108, rotate: -23, scale: 0.48 },
  { x: 222, y: 92, rotate: 17, scale: 0.33 },
  { x: 187, y: 139, rotate: -11, scale: 0.47 },
  { x: 102, y: 151, rotate: 20, scale: 0.64 },
  { x: 61, y: 130, rotate: -18, scale: 0.38 },
  { x: 220, y: 154, rotate: 15, scale: 0.36 },
  { x: 145, y: 166, rotate: 12, scale: 0.46 },
  { x: 174, y: 181, rotate: -16, scale: 0.58 },
  { x: 83, y: 177, rotate: 22, scale: 0.38 },
  { x: 139, y: 116, rotate: -7, scale: 0.46 },
];

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function center(points: string): [number, number] {
  const values = points.split(/[ ,]+/).map(Number);
  let x = 0;
  let y = 0;
  for (let index = 0; index < values.length; index += 2) {
    x += values[index];
    y += values[index + 1];
  }
  return [x / (values.length / 2), y / (values.length / 2)];
}

function subFacets(points: string): string[] {
  const values = points.split(/[ ,]+/).map(Number);
  const vertices: Array<[number, number]> = [];
  for (let index = 0; index < values.length; index += 2) {
    vertices.push([values[index], values[index + 1]]);
  }
  const [cx, cy] = center(points);
  return vertices.map(([x, y], index) => {
    const [nextX, nextY] = vertices[(index + 1) % vertices.length];
    return `${cx},${cy} ${x},${y} ${nextX},${nextY}`;
  });
}

function ProposalDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`cp-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFF7FA" stopOpacity=".92" />
        <stop offset=".2" stopColor="#FFB1CE" />
        <stop offset=".56" stopColor="#F56B9D" />
        <stop offset="1" stopColor="#B32558" />
      </linearGradient>
      <linearGradient id={`cp-hot-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFB0CC" />
        <stop offset=".3" stopColor="#FF5C96" />
        <stop offset=".62" stopColor="#E82C70" />
        <stop offset="1" stopColor="#7C1C40" />
      </linearGradient>
      <linearGradient id={`cp-rose-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#F58FB4" />
        <stop offset=".38" stopColor="#CA3F72" />
        <stop offset="1" stopColor="#5B243B" />
      </linearGradient>
      <linearGradient id={`cp-graphite-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#5D4C5B" />
        <stop offset=".48" stopColor="#332A37" />
        <stop offset="1" stopColor="#17141D" />
      </linearGradient>
      <linearGradient id={`cp-deep-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#9E315E" />
        <stop offset=".42" stopColor="#63213E" />
        <stop offset="1" stopColor="#261A27" />
      </linearGradient>
      <linearGradient id={`cp-glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" stopOpacity=".82" />
        <stop offset=".3" stopColor="#F6BDD1" stopOpacity=".52" />
        <stop offset="1" stopColor="#6C5364" stopOpacity=".32" />
      </linearGradient>
      <linearGradient id={`cp-edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" stopOpacity=".78" />
        <stop offset=".45" stopColor="#F4B3CA" stopOpacity=".58" />
        <stop offset="1" stopColor="#FF4B8D" stopOpacity=".46" />
      </linearGradient>
      <radialGradient id={`cp-ground-${uid}`} cx="50%" cy="10%" r="72%">
        <stop stopColor="#FF4B8D" stopOpacity=".34" />
        <stop offset="1" stopColor="#FF4B8D" stopOpacity="0" />
      </radialGradient>
      <filter id={`cp-glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4.2" />
      </filter>
      <filter id={`cp-piece-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.3" floodColor="#120A12" floodOpacity=".76" />
        <feDropShadow dx="0" dy="0" stdDeviation=".55" floodColor="#FF4B8D" floodOpacity=".22" />
      </filter>
    </defs>
  );
}

function fillFor(material: Material, uid: string) {
  return `url(#cp-${material}-${uid})`;
}

export function CrystalFiveApproved({ className, style }: CrystalProposalProps) {
  const uid = safeId(useId());

  return (
    <svg viewBox="0 0 240 184" className={className} style={style} aria-hidden="true">
      <ProposalDefs uid={uid} />
      <path
        d="M20 23L82 37L111 86L124 78L168 39L221 22L193 116L117 166L44 118Z"
        fill="#DF2868"
        opacity=".28"
        filter={`url(#cp-glow-${uid})`}
      />
      <ellipse cx="118" cy="166" rx="57" ry="9" fill={`url(#cp-ground-${uid})`} opacity=".62" />
      <g
        stroke={`url(#cp-edge-${uid})`}
        strokeWidth=".72"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#cp-piece-${uid})`}
      >
        {FACETS.map((facet) => (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={fillFor(facet.material, uid)}
            fillOpacity={facet.opacity}
          />
        ))}
        {INCLUSIONS.map((facet) => (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={fillFor(facet.material, uid)}
            fillOpacity={facet.opacity}
            strokeWidth=".38"
            strokeOpacity=".2"
          />
        ))}
      </g>
      <g
        fill="none"
        stroke={`url(#cp-edge-${uid})`}
        strokeWidth=".66"
        strokeOpacity=".64"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M20 23L82 37L111 86L124 78L168 39L221 22" />
        <path d="M20 23L44 118L117 166L193 116L221 22" />
        <path d="M62 54L111 86L104 108L117 166" />
        <path d="M181 59L124 78L139 102L117 166" />
      </g>
    </svg>
  );
}

export function CrystalFiveFragmentsApproved({ className, style }: CrystalProposalProps) {
  const uid = safeId(useId());

  return (
    <svg viewBox="0 0 280 230" className={className} style={style} aria-hidden="true">
      <ProposalDefs uid={uid} />
      <ellipse cx="142" cy="116" rx="104" ry="94" fill={`url(#cp-ground-${uid})`} opacity=".18" />
      {FACETS.map((facet, index) => {
        const [cx, cy] = center(facet.points);
        const pose = FRAGMENT_POSES[index];
        const transform = `translate(${pose.x - cx} ${pose.y - cy}) rotate(${pose.rotate} ${cx} ${cy}) translate(${cx} ${cy}) scale(${pose.scale}) translate(${-cx} ${-cy})`;
        const outlineOnly = index === 0 || index === 5 || index === 9 || index === 14;
        const faces = subFacets(facet.points);
        const faceMaterials: Material[] = ["light", "graphite", "hot", "deep"];

        return (
          <g key={facet.points} transform={transform} filter={`url(#cp-piece-${uid})`}>
            <polygon
              points={facet.points}
              fill={fillFor("deep", uid)}
              fillOpacity=".5"
              stroke="#4E1830"
              strokeOpacity=".5"
              strokeWidth=".7"
              transform="translate(3 3.5)"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polygon
              points={facet.points}
              fill={outlineOnly ? "rgba(20,17,25,.34)" : fillFor(facet.material, uid)}
              fillOpacity={outlineOnly ? 0.42 : facet.opacity}
              stroke={`url(#cp-edge-${uid})`}
              strokeWidth=".82"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {!outlineOnly &&
              faces.map((points, faceIndex) => (
                <polygon
                  key={points}
                  points={points}
                  fill={fillFor(faceMaterials[(index + faceIndex) % faceMaterials.length], uid)}
                  fillOpacity={0.22 + ((index + faceIndex) % 3) * 0.09}
                  stroke="rgba(255,222,233,.34)"
                  strokeWidth=".36"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            {!outlineOnly && (
              <path
                d={`M${cx} ${cy}L${facet.points.split(" ")[0].replace(",", " ")}`}
                fill="none"
                stroke="rgba(255,240,245,.62)"
                strokeWidth=".48"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
