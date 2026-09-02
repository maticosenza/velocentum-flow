import { useId, type CSSProperties } from "react";

export type CrystalFragmentLayout = "cluster" | "burst" | "flow-a" | "flow-b";

type CrystalFragmentsProps = {
  layout?: CrystalFragmentLayout;
  className?: string;
  style?: CSSProperties;
};

type Material = "hot" | "rose" | "smoke" | "clear" | "deep";

type Shard = {
  points: string;
  material: Material;
  opacity?: number;
};

// Exact fragment family drawn for the approved design-system board. Every
// polygon stays independent so the same material can be distributed through
// the page without raster scaling or a single cluster-shaped image.
const SHARDS: Shard[] = [
  { points: "30,35 42,27 48,42", material: "clear", opacity: 0.84 },
  { points: "66,22 82,20 76,38", material: "hot" },
  { points: "106,13 124,34 98,36", material: "hot" },
  { points: "150,37 160,28 168,44", material: "clear", opacity: 0.82 },
  { points: "46,72 78,56 84,88 60,105", material: "smoke" },
  { points: "98,63 128,47 145,79 116,96", material: "rose" },
  { points: "164,66 183,54 191,82", material: "clear", opacity: 0.82 },
  { points: "211,62 230,52 236,76", material: "deep" },
  { points: "29,120 50,110 57,134", material: "clear", opacity: 0.84 },
  { points: "77,119 102,105 111,140 87,148", material: "deep" },
  { points: "136,112 159,96 166,130", material: "hot" },
  { points: "197,113 224,99 219,138", material: "rose" },
  { points: "51,171 70,160 76,182", material: "hot" },
  { points: "104,169 130,153 136,190 111,196", material: "clear", opacity: 0.82 },
  { points: "158,174 180,157 190,186", material: "deep" },
  { points: "220,170 239,159 245,181", material: "rose" },
];

type Pose = { x: number; y: number; rotate: number; scale?: number };

const CLUSTER_POSES: Pose[] = SHARDS.map(() => ({ x: 0, y: 0, rotate: 0 }));

const BURST_TARGETS: Array<[number, number]> = [
  [72, 58],
  [111, 39],
  [145, 33],
  [181, 54],
  [91, 92],
  [133, 78],
  [173, 91],
  [210, 89],
  [61, 123],
  [104, 120],
  [150, 113],
  [195, 128],
  [82, 157],
  [128, 171],
  [171, 154],
  [211, 167],
];

const FLOW_A_TARGETS: Array<[number, number]> = [
  [46, 18],
  [214, 30],
  [72, 44],
  [236, 58],
  [42, 72],
  [198, 86],
  [76, 101],
  [232, 116],
  [48, 130],
  [204, 145],
  [80, 160],
  [236, 175],
  [44, 190],
  [194, 205],
  [74, 220],
  [228, 232],
];

const FLOW_B_TARGETS: Array<[number, number]> = FLOW_A_TARGETS.map(([x, y]) => [280 - x, y]);

/**
 * Acceso indexado con el invariante afirmado en un solo lugar.
 *
 * El proyecto compila con `noUncheckedIndexedAccess`, así que todo índice dinámico
 * devuelve `T | undefined`. Los recorridos de este archivo son sobre arrays propios y
 * siempre están dentro de rango; en vez de repetir aserciones en cada uso, el invariante
 * se comprueba acá y falla ruidosamente si alguna vez deja de valer.
 */
function at<T>(values: readonly T[], index: number): T {
  const value = values[index];
  if (value === undefined) {
    throw new RangeError(`CrystalFragments: índice ${index} fuera de rango`);
  }
  return value;
}

function center(points: string): [number, number] {
  const values = points.split(/[ ,]+/).map(Number);
  let x = 0;
  let y = 0;
  const count = values.length / 2;
  for (let index = 0; index < values.length; index += 2) {
    x += at(values, index);
    y += at(values, index + 1);
  }
  return [x / count, y / count];
}

function subFacets(points: string): string[] {
  const values = points.split(/[ ,]+/).map(Number);
  const vertices: Array<[number, number]> = [];
  for (let index = 0; index < values.length; index += 2) {
    vertices.push([at(values, index), at(values, index + 1)]);
  }
  const [cx, cy] = center(points);
  return vertices.map(([x, y], index) => {
    const [nextX, nextY] = at(vertices, (index + 1) % vertices.length);
    return `${cx},${cy} ${x},${y} ${nextX},${nextY}`;
  });
}

function flowPoses(targets: Array<[number, number]>): Pose[] {
  return SHARDS.map((shard, index) => {
    const [cx, cy] = center(shard.points);
    const [tx, ty] = at(targets, index);
    return {
      x: tx - cx,
      y: ty - cy,
      rotate: index % 2 === 0 ? -18 + index : 16 - index,
      scale: index % 3 === 0 ? 0.82 : index % 3 === 1 ? 0.68 : 0.76,
    };
  });
}

const FLOW_A_POSES = flowPoses(FLOW_A_TARGETS);
const FLOW_B_POSES = flowPoses(FLOW_B_TARGETS);
const BURST_ROTATIONS = [-24, 14, -8, 22, -14, 9, -19, 27, 18, -12, 16, -22, -17, 11, -14, 20];
const BURST_SCALES = [
  0.7, 0.76, 0.82, 0.66, 1.12, 1.08, 0.74, 0.62, 0.68, 1.02, 0.78, 0.7, 0.72, 0.86, 0.69, 0.76,
];
const BURST_POSES: Pose[] = flowPoses(BURST_TARGETS).map((pose, index) => ({
  ...pose,
  rotate: at(BURST_ROTATIONS, index),
  scale: at(BURST_SCALES, index),
}));

function safeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function CrystalFragments({ layout = "cluster", className, style }: CrystalFragmentsProps) {
  const uid = safeId(useId());
  const id = (name: string) => `cf-${name}-${uid}`;
  const poses =
    layout === "burst"
      ? BURST_POSES
      : layout === "flow-a"
        ? FLOW_A_POSES
        : layout === "flow-b"
          ? FLOW_B_POSES
          : CLUSTER_POSES;

  const fills: Record<Material, string> = {
    hot: `url(#${id("hot")})`,
    rose: `url(#${id("rose")})`,
    smoke: `url(#${id("smoke")})`,
    clear: `url(#${id("clear")})`,
    deep: `url(#${id("deep")})`,
  };

  return (
    <svg viewBox="0 0 280 250" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={id("hot")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F6B0C7" stopOpacity=".84" />
          <stop offset=".18" stopColor="#E96C99" stopOpacity=".92" />
          <stop offset=".48" stopColor="#FF2D76" stopOpacity=".98" />
          <stop offset=".76" stopColor="#81163E" />
          <stop offset="1" stopColor="#2A1724" />
        </linearGradient>
        <linearGradient id={id("rose")} x1="1" y1="0" x2="0" y2="1">
          <stop stopColor="#E79AB5" stopOpacity=".84" />
          <stop offset=".28" stopColor="#CF426F" stopOpacity=".94" />
          <stop offset=".58" stopColor="#A9144B" />
          <stop offset="1" stopColor="#2C1623" />
        </linearGradient>
        <linearGradient id={id("smoke")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A57388" />
          <stop offset=".3" stopColor="#654958" />
          <stop offset=".68" stopColor="#3C313D" />
          <stop offset="1" stopColor="#211E27" />
        </linearGradient>
        <linearGradient id={id("clear")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#D39BAF" stopOpacity=".64" />
          <stop offset=".42" stopColor="#795669" stopOpacity=".78" />
          <stop offset="1" stopColor="#3A303C" stopOpacity=".96" />
        </linearGradient>
        <linearGradient id={id("deep")} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#29232D" />
          <stop offset=".38" stopColor="#4A3040" />
          <stop offset=".7" stopColor="#A92757" />
          <stop offset="1" stopColor="#EA6E98" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFD9E5" stopOpacity=".32" />
          <stop offset=".24" stopColor="#FFFFFF" stopOpacity=".04" />
          <stop offset=".72" stopColor="#FF4B8D" stopOpacity=".12" />
          <stop offset="1" stopColor="#000000" stopOpacity=".26" />
        </linearGradient>
        <linearGradient id={id("facet-pink")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FF8FB2" stopOpacity=".56" />
          <stop offset=".52" stopColor="#E72D70" stopOpacity=".3" />
          <stop offset="1" stopColor="#55273D" stopOpacity=".14" />
        </linearGradient>
        <linearGradient id={id("facet-light")} x1="1" y1="0" x2="0" y2="1">
          <stop stopColor="#FFD3E0" stopOpacity=".5" />
          <stop offset=".46" stopColor="#B9859A" stopOpacity=".22" />
          <stop offset="1" stopColor="#4A3543" stopOpacity=".08" />
        </linearGradient>
        <linearGradient id={id("facet-dark")} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#1E1922" stopOpacity=".52" />
          <stop offset=".55" stopColor="#44313F" stopOpacity=".28" />
          <stop offset="1" stopColor="#B72C5D" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={id("edge")} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFE0EA" stopOpacity=".82" />
          <stop offset=".5" stopColor="#EBA2BA" stopOpacity=".7" />
          <stop offset="1" stopColor="#FF4B8D" stopOpacity=".6" />
        </linearGradient>
        <filter
          id={id("depth")}
          x="-70%"
          y="-70%"
          width="240%"
          height="260%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".028 .06"
            numOctaves="3"
            seed="23"
            result="stoneNoise"
          />
          <feColorMatrix
            in="stoneNoise"
            values="0 0 0 0 .36  0 0 0 0 .07  0 0 0 0 .18  .2126 .7152 .0722 0 0"
            result="stoneTint"
          />
          <feComposite in="stoneTint" in2="SourceAlpha" operator="in" result="stoneClipped" />
          <feComponentTransfer in="stoneClipped" result="stoneGrain">
            <feFuncA type="table" tableValues="0 .045 .13 .25" />
          </feComponentTransfer>
          <feGaussianBlur in="stoneGrain" stdDeviation=".1" result="stoneMottle" />
          <feBlend in="SourceGraphic" in2="stoneMottle" mode="multiply" result="stoneBase" />
          <feSpecularLighting
            in="stoneNoise"
            surfaceScale="1.1"
            specularConstant=".07"
            specularExponent="21"
            lightingColor="#FFD1DF"
            result="stoneSpecular"
          >
            <feDistantLight azimuth="218" elevation="50" />
          </feSpecularLighting>
          <feComposite
            in="stoneSpecular"
            in2="SourceAlpha"
            operator="in"
            result="stoneSpecularClipped"
          />
          <feBlend in="stoneBase" in2="stoneSpecularClipped" mode="screen" result="stoneFace" />
          <feDropShadow
            in="stoneFace"
            dx="0"
            dy="1.4"
            stdDeviation="1"
            floodColor="#130A12"
            floodOpacity=".64"
          />
          <feDropShadow dx="0" dy="0" stdDeviation=".5" floodColor="#FF2D76" floodOpacity=".16" />
        </filter>
      </defs>

      {SHARDS.map((shard, index) => {
        const [cx, cy] = center(shard.points);
        const facets = subFacets(shard.points);
        const pose = at(poses, index);
        const transform = `translate(${pose.x} ${pose.y}) rotate(${pose.rotate} ${cx} ${cy}) translate(${cx} ${cy}) scale(${pose.scale ?? 1}) translate(${-cx} ${-cy})`;
        return (
          <g key={shard.points} transform={transform} filter={`url(#${id("depth")})`}>
            <polygon
              points={shard.points}
              fill={fills[shard.material]}
              fillOpacity={shard.opacity ?? 0.94}
              stroke={`url(#${id("edge")})`}
              strokeWidth=".56"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {facets.map((points, facetIndex) => {
              const facetFills = [
                `url(#${id("facet-pink")})`,
                `url(#${id("facet-dark")})`,
                `url(#${id("facet-light")})`,
              ];
              return (
                <polygon
                  key={points}
                  points={points}
                  fill={at(facetFills, (index + facetIndex) % facetFills.length)}
                  fillOpacity={0.46 + ((index + facetIndex) % 3) * 0.09}
                  stroke="rgba(255,211,226,.34)"
                  strokeWidth=".2"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            <polygon
              points={shard.points}
              fill={`url(#${id("sheen")})`}
              fillOpacity=".14"
              stroke="none"
            />
          </g>
        );
      })}
    </svg>
  );
}
