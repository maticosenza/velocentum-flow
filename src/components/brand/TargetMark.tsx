import { useId, type CSSProperties } from "react";

/**
 * La Mira — el objetivo.
 *
 * Es `public/brand-approved/official/objects/target.svg` SIN MODIFICAR. Lo único
 * que cambia son los IDs de sus `<defs>`, generados con `useId()` para no
 * colisionar al embeber varios SVG en la misma página, tal como exige
 * docs/DESIGN_SYSTEM_CRYSTAL.txt.
 *
 * El sistema ya define este objeto como foco y dirección: el objetivo tiene un
 * objeto asignado, no es una abstracción.
 */
function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export const TARGET_MARK_VIEWBOX = 260;

export function TargetMark({ className, style }: { className?: string; style?: CSSProperties }) {
  const uid = safeId(useId());
  const coreId = `tg-core-${uid}`;
  const glowId = `tg-glow-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${TARGET_MARK_VIEWBOX} ${TARGET_MARK_VIEWBOX}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={coreId} cx="38%" cy="30%" r="76%">
          <stop stopColor="#fff" />
          <stop offset=".2" stopColor="#ffb6d0" />
          <stop offset=".55" stopColor="#ff4b8d" />
          <stop offset="1" stopColor="#bd245b" />
        </radialGradient>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <circle cx="130" cy="130" r="68" strokeOpacity=".86" strokeWidth="1.35" />
        <circle cx="130" cy="130" r="32" strokeOpacity=".48" strokeWidth="1" />
        <path
          d="M130 27v67M130 166v67M27 130h67M166 130h67"
          strokeOpacity=".76"
          strokeWidth="1.15"
        />
        <path d="M130 16v11M130 233v11M16 130h11M233 130h11" strokeOpacity=".32" strokeWidth=".8" />
      </g>
      <circle cx="130" cy="130" r="22" fill="#ff4b8d" opacity=".24" filter={`url(#${glowId})`} />
      <circle cx="130" cy="130" r="12" fill={`url(#${coreId})`} />
      <circle cx="126.5" cy="126.5" r="3" fill="#fff" opacity=".48" />
    </svg>
  );
}
