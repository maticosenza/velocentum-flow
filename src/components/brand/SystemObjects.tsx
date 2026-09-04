import { useId, type CSSProperties } from "react";

/**
 * Los objetos del sistema, embebidos SIN MODIFICAR desde
 * `public/brand-approved/official/objects/`.
 *
 * Lo único que cambia respecto de los archivos maestros es el nombre de los IDs
 * de sus `<defs>`: los cuatro comparten nombres genéricos (`glass`, `beam`, `g`,
 * `gl`, `front`, `side`, `top`, `inner`, `core`, `glow`) y colisionarían al
 * embeberlos juntos en la misma página. El sufijo lo aporta `useId()`.
 *
 * Mapeo aprobado de la Sección 05: Estrategia → Mira, Creatividad → Prisma,
 * Adquisición → Rayo, Web & Conversión → Barras. La Mira vive en TargetMark.tsx,
 * porque la Sección 04 ya la usa como objetivo.
 */
function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

type ObjectProps = { className?: string; style?: CSSProperties };

/** Prisma — una entrada, muchas salidas. official/objects/prism.svg */
export function PrismObject({ className, style }: ObjectProps) {
  const uid = safeId(useId());
  const glass = `pr-glass-${uid}`;
  const beam = `pr-beam-${uid}`;
  const blur = `pr-g-${uid}`;

  return (
    <svg viewBox="0 0 520 260" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient
          id={glass}
          x1="190"
          y1="30"
          x2="300"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".16" />
          <stop offset=".5" stopColor="#FF9BC0" stopOpacity=".12" />
          <stop offset="1" stopColor="#FF4B8D" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id={beam} x1="250" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset=".18" stopColor="#ffe76d" />
          <stop offset=".38" stopColor="#7dff6a" />
          <stop offset=".60" stopColor="#50c9ff" />
          <stop offset=".82" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#FF4B8D" stopOpacity="0" />
        </linearGradient>
        <filter id={blur}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        d="M16 136H170"
        stroke="#FF4B8D"
        strokeOpacity=".20"
        strokeWidth="16"
        filter={`url(#${blur})`}
      />
      <path d="M16 136H170" stroke="#FF4B8D" strokeOpacity=".45" strokeWidth="3" />
      <polygon
        points="250,28 164,218 337,218"
        fill={`url(#${glass})`}
        stroke="#FFB1CC"
        strokeOpacity=".82"
        strokeWidth="2"
      />
      <path d="M250 28L250 218M164 218L250 122 337 218" stroke="#fff" strokeOpacity=".18" />
      <path
        d="M250 136L500 136"
        stroke={`url(#${beam})`}
        strokeWidth="13"
        filter={`url(#${blur})`}
      />
      <path d="M250 136L500 136" stroke={`url(#${beam})`} strokeWidth="5" />
    </svg>
  );
}

/** Rayo — ejecución y velocidad. official/objects/lightning.svg */
export function LightningObject({ className, style }: ObjectProps) {
  const uid = safeId(useId());
  const grad = `li-g-${uid}`;
  const glow = `li-gl-${uid}`;

  return (
    <svg viewBox="0 0 220 260" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="45" y1="20" x2="165" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".8" />
          <stop offset=".18" stopColor="#FF9BC0" />
          <stop offset=".55" stopColor="#FF4B8D" />
          <stop offset="1" stopColor="#981B4A" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${glow})`} stroke="#fff" strokeOpacity=".35" strokeWidth="1.2">
        <path d="M147 14L48 130h63L77 246l101-143h-58z" fill={`url(#${grad})`} />
        <path d="M147 14L91 111l29-8M48 130l63 0 10-27M77 246l34-116M178 103l-67 27" fill="none" />
        <path d="M72 155l59-54 18 26-63 48z" fill="#FF6B9D" fillOpacity=".28" stroke="none" />
      </g>
    </svg>
  );
}

/** Barras — conversión y crecimiento medible. official/objects/bars.svg */
export function BarsObject({ className, style }: ObjectProps) {
  const uid = safeId(useId());
  const front = `ba-front-${uid}`;
  const side = `ba-side-${uid}`;
  const top = `ba-top-${uid}`;
  const inner = `ba-inner-${uid}`;
  const glow = `ba-glow-${uid}`;

  return (
    <svg viewBox="0 0 300 280" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffb3ce" stopOpacity=".58" />
          <stop offset=".22" stopColor="#c45882" stopOpacity=".5" />
          <stop offset=".64" stopColor="#6d2445" stopOpacity=".54" />
          <stop offset="1" stopColor="#ff4b8d" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="#502039" stopOpacity=".7" />
          <stop offset=".55" stopColor="#a52b5a" stopOpacity=".48" />
          <stop offset="1" stopColor="#ff4b8d" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#ff8eb7" stopOpacity=".82" />
          <stop offset=".5" stopColor="#ffd8e6" stopOpacity=".9" />
          <stop offset="1" stopColor="#b8587c" stopOpacity=".74" />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff" stopOpacity=".3" />
          <stop offset=".48" stopColor="#ff99be" stopOpacity=".08" />
          <stop offset="1" stopColor="#ff4b8d" stopOpacity=".34" />
        </linearGradient>
        <filter id={glow} x="-60%" y="-30%" width="220%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <ellipse
        cx="139"
        cy="232"
        rx="121"
        ry="13"
        fill="#ff4b8d"
        opacity=".14"
        filter={`url(#${glow})`}
      />
      <g strokeLinejoin="round">
        <g>
          <path
            d="M29 159 65 169v57l-36-9z"
            fill={`url(#${front})`}
            stroke="#ffd3e2"
            strokeOpacity=".78"
            strokeWidth="1.35"
          />
          <path
            d="m65 169 14-9v57l-14 9z"
            fill={`url(#${side})`}
            stroke="#ff8db7"
            strokeOpacity=".72"
            strokeWidth="1.2"
          />
          <path
            d="m29 159 14-8 36 9-14 9z"
            fill={`url(#${top})`}
            stroke="#fff4f8"
            strokeOpacity=".9"
            strokeWidth="1.25"
          />
          <path
            d="M39 162v48l26 7M69 168v49"
            fill="none"
            stroke={`url(#${inner})`}
            strokeWidth="1"
          />
        </g>
        <g>
          <path
            d="M99 105 139 116v110l-40-10z"
            fill={`url(#${front})`}
            stroke="#ffd3e2"
            strokeOpacity=".82"
            strokeWidth="1.45"
          />
          <path
            d="m139 116 16-10v110l-16 10z"
            fill={`url(#${side})`}
            stroke="#ff8db7"
            strokeOpacity=".76"
            strokeWidth="1.25"
          />
          <path
            d="m99 105 16-9 40 10-16 10z"
            fill={`url(#${top})`}
            stroke="#fff4f8"
            strokeOpacity=".92"
            strokeWidth="1.3"
          />
          <path
            d="M110 108v100l29 8M144 114v102"
            fill="none"
            stroke={`url(#${inner})`}
            strokeWidth="1.05"
          />
          <path d="m100 169 39 10 16-10" fill="none" stroke="#ff9fc1" strokeOpacity=".16" />
        </g>
        <g>
          <path
            d="M177 42 222 54v172l-45-11z"
            fill={`url(#${front})`}
            stroke="#ffe0eb"
            strokeOpacity=".86"
            strokeWidth="1.55"
          />
          <path
            d="m222 54 17-11v172l-17 11z"
            fill={`url(#${side})`}
            stroke="#ff8db7"
            strokeOpacity=".8"
            strokeWidth="1.35"
          />
          <path
            d="m177 42 17-10 45 11-17 11z"
            fill={`url(#${top})`}
            stroke="#fff7fa"
            strokeOpacity=".94"
            strokeWidth="1.4"
          />
          <path
            d="M189 45v162l33 8M228 52v163"
            fill="none"
            stroke={`url(#${inner})`}
            strokeWidth="1.1"
          />
          <path
            d="m178 115 44 11 17-10M178 178l44 11 17-10"
            fill="none"
            stroke="#ff9fc1"
            strokeOpacity=".16"
          />
        </g>
      </g>
      <path d="M18 228h235" stroke="#ff4b8d" strokeOpacity=".28" strokeWidth=".9" />
    </svg>
  );
}
