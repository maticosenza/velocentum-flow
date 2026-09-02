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
export const FACETS = [
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
] as const satisfies readonly Facet[];

export const INCLUSIONS = [
  { points: "31,37 54,49 45,76", material: "light", opacity: 0.3 },
  { points: "51,108 73,95 65,114", material: "hot", opacity: 0.42 },
  { points: "82,43 102,72 91,68", material: "deep", opacity: 0.56 },
  { points: "108,112 117,99 114,145", material: "glass", opacity: 0.28 },
  { points: "146,82 161,76 153,96", material: "hot", opacity: 0.42 },
  { points: "173,69 195,47 187,86", material: "deep", opacity: 0.46 },
  { points: "148,118 167,101 158,126", material: "graphite", opacity: 0.5 },
] as const satisfies readonly Facet[];

/** Las cuatro aristas dibujadas sobre las piezas, en orden de pintura. */
export const CRYSTAL_FIVE_EDGE_PATHS = [
  "M20 23L82 37L111 86L124 78L168 39L221 22",
  "M20 23L44 118L117 166L193 116L221 22",
  "M62 54L111 86L104 108L117 166",
  "M181 59L124 78L139 102L117 166",
] as const;

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

// ---------------------------------------------------------------------------
// Contrato de la API por faceta
// ---------------------------------------------------------------------------

export const CRYSTAL_FIVE_FACET_COUNT = 18;
export const CRYSTAL_FIVE_INCLUSION_COUNT = 7;

/** FACETS[15] — "139,102 164,89 193,116 117,166". El ancla de la coreografía. */
export const GUIDE_FACET_INDEX = 15;
/** INCLUSIONS[6] — "148,118 167,101 158,126". Viaja pegada a la faceta guía. */
export const GUIDE_INCLUSION_INDEX = 6;

/**
 * Las SEIS facetas que LLEGAN en T2.
 *
 * No incluye el ancla 15: esa llegó en T1 y no vuelve a llegar. Es una constante
 * distinta de CRYSTAL_FIVE_T2_VISIBLE_FACETS a propósito — una sola con nombre
 * ambiguo se usaría mal en la mitad de los casos.
 */
export const CRYSTAL_FIVE_T2_ARRIVING_FACETS = [1, 7, 10, 11, 16, 17] as const;

/** Las SIETE facetas visibles en T2, incluido el ancla 15 que ya estaba. */
export const CRYSTAL_FIVE_T2_VISIBLE_FACETS = [1, 7, 10, 11, 15, 16, 17] as const;

export type FacetIndex =
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;
export type InclusionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type AssertEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
/** Si alguien agrega o quita una pieza sin mover la constante, esto no compila. */
const FACET_COUNT_MATCHES: AssertEqual<(typeof FACETS)["length"], typeof CRYSTAL_FIVE_FACET_COUNT> =
  true;
const INCLUSION_COUNT_MATCHES: AssertEqual<
  (typeof INCLUSIONS)["length"],
  typeof CRYSTAL_FIVE_INCLUSION_COUNT
> = true;
void FACET_COUNT_MATCHES;
void INCLUSION_COUNT_MATCHES;

/**
 * Pose de una pieza. La identidad es { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }.
 *
 * `opacity` es la del wrapper <g>. El fillOpacity BASE del polígono nunca se toca:
 * una pieza a opacity 1 se ve exactamente como el asset aprobado.
 */
export type CrystalPiecePose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
};

// Supresión localizada de react-refresh/only-export-components, exclusiva para esa regla.
// Este archivo exporta a propósito el componente, los tipos y las constantes públicas del
// contrato aprobado, y esa superficie está verificada y cerrada. La regla existe para que
// Fast Refresh funcione en desarrollo; no justifica reorganizar una API pública ya
// aprobada moviendo constantes, tipos o helpers a otro módulo.
// eslint-disable-next-line react-refresh/only-export-components
export const CRYSTAL_PIECE_POSE_IDENTITY: CrystalPiecePose = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  opacity: 1,
};

/**
 * Control de la coreografía.
 *
 * IDENTIDAD = OMITIR `control`. Sin la prop, el DOM es idéntico byte a byte al del
 * commit 49fc3dc: cero wrappers, cero data-*, cero transform u opacity extra.
 * `control={{}}` YA ES modo controlado — monta los 25 wrappers en pose identidad.
 * El resultado se ve igual, pero el árbol no es el mismo. Para identidad exacta de DOM,
 * no pasar la prop.
 *
 * Las claves 15 (faceta) y 6 (inclusión) están EXCLUIDAS POR TIPO de facetPoses e
 * inclusionPoses: el fragmento guía se mueve sólo con `guidePose`, y la adherencia entre
 * la faceta y su inclusión la garantiza el tipo, no la disciplina del llamador.
 *
 * glowOpacity, groundOpacity y edgesOpacity son FACTORES MULTIPLICADORES sobre la
 * opacidad base del asset, en rango 0 a 1. Nunca valores absolutos: pasar 1 devuelve
 * exactamente el valor aprobado y nunca se puede superar el original.
 *
 *   Bases del asset: glow 0.28 · suelo 0.62 · aristas 1
 *
 * ATENCIÓN AL CONVERTIR desde el HTML del Mockup 09: ese HTML expresa OPACIDADES
 * EFECTIVAS, no factores. Hay que dividir por la base. Ejemplo del suelo:
 *
 *   T1 a T4      efectiva 0.14  ->  factor 0.14 / 0.62 = 0.2258064516
 *   T5 y default efectiva 0.62  ->  factor 1
 */
export type CrystalFiveControl = {
  facetPoses?: Partial<Record<Exclude<FacetIndex, typeof GUIDE_FACET_INDEX>, CrystalPiecePose>>;
  inclusionPoses?: Partial<
    Record<Exclude<InclusionIndex, typeof GUIDE_INCLUSION_INDEX>, CrystalPiecePose>
  >;
  /** La única pose de FACETS[15] e INCLUSIONS[6]. Los mueve juntos. */
  guidePose?: CrystalPiecePose;
  glowOpacity?: number;
  groundOpacity?: number;
  edgesOpacity?: number;
};

export type CrystalFiveApprovedProps = CrystalProposalProps & {
  control?: CrystalFiveControl;
};

/** Opacidades base del asset. Son el techo: los factores sólo pueden bajarlas. */
const GLOW_BASE_OPACITY = 0.28;
const GROUND_BASE_OPACITY = 0.62;
const EDGES_BASE_OPACITY = 1;

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
    throw new RangeError(`CrystalFiveApproved: índice ${index} fuera de rango`);
  }
  return value;
}

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function center(points: string): [number, number] {
  const values = points.split(/[ ,]+/).map(Number);
  let x = 0;
  let y = 0;
  for (let index = 0; index < values.length; index += 2) {
    x += at(values, index);
    y += at(values, index + 1);
  }
  return [x / (values.length / 2), y / (values.length / 2)];
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

/** El centroide de FACETS[15]. Origen compartido por los dos wrappers de la guía. */
const GUIDE_CENTER = center(FACETS[GUIDE_FACET_INDEX].points);

function clampFactor(value: number | undefined): number {
  if (value === undefined) return 1;
  return Math.min(1, Math.max(0, value));
}

function layerOpacity(base: number, factor: number | undefined): number {
  return base * clampFactor(factor);
}

function poseTransform(pose: CrystalPiecePose, cx: number, cy: number): string {
  return `translate(${pose.x} ${pose.y}) rotate(${pose.rotate} ${cx} ${cy}) translate(${cx} ${cy}) scale(${pose.scale}) translate(${-cx} ${-cy})`;
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

export function CrystalFiveApproved({ className, style, control }: CrystalFiveApprovedProps) {
  const uid = safeId(useId());

  // Sin control no se monta nada alrededor de las piezas: el árbol es el aprobado.
  // Con control se montan LAS 25, tengan pose o no, y las capas pasan a llevar opacity.
  // Nada se ausenta nunca del DOM: se apaga por opacidad, para poder interpolar sin remount.
  const guidePose = control?.guidePose ?? CRYSTAL_PIECE_POSE_IDENTITY;
  const [guideCx, guideCy] = GUIDE_CENTER;

  return (
    <svg viewBox="0 0 240 184" className={className} style={style} aria-hidden="true">
      <ProposalDefs uid={uid} />
      <path
        d="M20 23L82 37L111 86L124 78L168 39L221 22L193 116L117 166L44 118Z"
        fill="#DF2868"
        opacity={control ? layerOpacity(GLOW_BASE_OPACITY, control.glowOpacity) : ".28"}
        filter={`url(#cp-glow-${uid})`}
      />
      <ellipse
        cx="118"
        cy="166"
        rx="57"
        ry="9"
        fill={`url(#cp-ground-${uid})`}
        opacity={control ? layerOpacity(GROUND_BASE_OPACITY, control.groundOpacity) : ".62"}
      />
      <g
        stroke={`url(#cp-edge-${uid})`}
        strokeWidth=".72"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#cp-piece-${uid})`}
      >
        {FACETS.map((facet, index) => {
          const polygon = (
            <polygon
              key={facet.points}
              points={facet.points}
              fill={fillFor(facet.material, uid)}
              fillOpacity={facet.opacity}
            />
          );
          if (!control) return polygon;

          // La faceta guía usa guidePose y el centroide de FACETS[15], igual que su inclusión.
          const isGuide = index === GUIDE_FACET_INDEX;
          const pose = isGuide
            ? guidePose
            : (control.facetPoses?.[index as Exclude<FacetIndex, typeof GUIDE_FACET_INDEX>] ??
              CRYSTAL_PIECE_POSE_IDENTITY);
          const [cx, cy] = isGuide ? GUIDE_CENTER : center(facet.points);

          return (
            <g key={facet.points} transform={poseTransform(pose, cx, cy)} opacity={pose.opacity}>
              {polygon}
            </g>
          );
        })}
        {INCLUSIONS.map((facet, index) => {
          const polygon = (
            <polygon
              key={facet.points}
              points={facet.points}
              fill={fillFor(facet.material, uid)}
              fillOpacity={facet.opacity}
              strokeWidth=".38"
              strokeOpacity=".2"
            />
          );
          if (!control) return polygon;

          // Hermana de la faceta guía, no hija: anidarla dentro del grupo de FACETS[15] la
          // adelantaría en el z-order, entre las facetas 15 y 16, y cambiaría el armado.
          // Comparte el MISMO transform, con origen en el centroide de FACETS[15]: si cada
          // una rotara sobre su propio centro, la inclusión se despegaría.
          const isGuide = index === GUIDE_INCLUSION_INDEX;
          const pose = isGuide
            ? guidePose
            : (control.inclusionPoses?.[
                index as Exclude<InclusionIndex, typeof GUIDE_INCLUSION_INDEX>
              ] ?? CRYSTAL_PIECE_POSE_IDENTITY);
          const [cx, cy] = isGuide ? [guideCx, guideCy] : center(facet.points);

          return (
            <g key={facet.points} transform={poseTransform(pose, cx, cy)} opacity={pose.opacity}>
              {polygon}
            </g>
          );
        })}
      </g>
      <g
        fill="none"
        stroke={`url(#cp-edge-${uid})`}
        strokeWidth=".66"
        strokeOpacity=".64"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        {...(control ? { opacity: layerOpacity(EDGES_BASE_OPACITY, control.edgesOpacity) } : {})}
      >
        {CRYSTAL_FIVE_EDGE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
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
        const pose = at(FRAGMENT_POSES, index);
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
                  fill={fillFor(at(faceMaterials, (index + faceIndex) % faceMaterials.length), uid)}
                  fillOpacity={0.22 + ((index + faceIndex) % 3) * 0.09}
                  stroke="rgba(255,222,233,.34)"
                  strokeWidth=".36"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            {!outlineOnly && (
              <path
                d={`M${cx} ${cy}L${at(facet.points.split(" "), 0).replace(",", " ")}`}
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
