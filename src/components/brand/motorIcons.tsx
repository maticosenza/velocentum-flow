// Per-motor objects for the Motores section — one distinct object per motor
// (never the Crystal V mark repeated four times), each derived from the
// Asset Pack V2 board geometry (prism-board / lightning-board /
// target-board / fragment-cluster-board), recolored to the pink-only
// system where the source board used a multicolor spectrum (the prism
// beam) — "una paleta de un solo color de acento" overrides the raw asset.
import { useId } from "react";
import { FRAGMENTS } from "@/components/brand/fragmentGeometry";

type IconProps = { className?: string };

// Estrategia — the prism board's own triangle + refracted beam, cropped to
// just that motif and recolored to the pink gradient scale instead of the
// board's literal rainbow.
export function PrismIcon({ className }: IconProps) {
  const uid = useId();
  const glassId = `prism-glass-${uid}`;
  const beamId = `prism-beam-${uid}`;
  return (
    <svg viewBox="150 10 220 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={glassId}
          x1="190"
          y1="30"
          x2="300"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".2" />
          <stop offset=".5" stopColor="var(--pink-soft)" stopOpacity=".2" />
          <stop offset="1" stopColor="var(--pink)" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={beamId} x1="250" y1="0" x2="370" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset=".4" stopColor="var(--pink-soft)" />
          <stop offset="1" stopColor="var(--pink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M156 136H240" stroke="var(--pink)" strokeOpacity=".3" strokeWidth="4" />
      <polygon
        points="250,28 164,218 337,218"
        fill={`url(#${glassId})`}
        stroke="var(--pink-soft)"
        strokeOpacity=".8"
        strokeWidth="2.5"
      />
      <path d="M250 28L250 218M164 218L250 122 337 218" stroke="#fff" strokeOpacity=".22" />
      <path d="M250 136L365 136" stroke={`url(#${beamId})`} strokeWidth="5" />
    </svg>
  );
}

// Adquisición — the lightning board's own bolt silhouette, same gradient.
export function LightningIcon({ className }: IconProps) {
  const uid = useId();
  const gradId = `bolt-${uid}`;
  return (
    <svg viewBox="30 5 160 250" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={gradId}
          x1="45"
          y1="20"
          x2="165"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".85" />
          <stop offset=".18" stopColor="var(--pink-soft)" />
          <stop offset=".55" stopColor="var(--pink)" />
          <stop offset="1" stopColor="var(--pink-deep)" />
        </linearGradient>
      </defs>
      <g stroke="#fff" strokeOpacity=".35" strokeWidth="1.4">
        <path d="M147 14L48 130h63L77 246l101-143h-58z" fill={`url(#${gradId})`} />
        <path d="M72 155l59-54 18 26-63 48z" fill="#fff" fillOpacity=".22" stroke="none" />
      </g>
    </svg>
  );
}

// Web & Conversión — the target board's own concentric rings + crosshair.
export function TargetStructureIcon({ className }: IconProps) {
  const uid = useId();
  const coreId = `target-core-${uid}`;
  return (
    <svg viewBox="20 20 220 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={coreId}>
          <stop stopColor="#fff" />
          <stop offset=".3" stopColor="var(--pink-soft)" />
          <stop offset="1" stopColor="var(--pink)" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="var(--pink-soft)" strokeOpacity=".85">
        <circle cx="130" cy="130" r="67" strokeWidth="2" />
        <circle cx="130" cy="130" r="32" strokeOpacity=".55" strokeWidth="2" />
        <path d="M130 24v75M130 161v75M24 130h75M161 130h75" strokeWidth="2" />
      </g>
      <circle cx="130" cy="130" r="11" fill={`url(#${coreId})`} />
    </svg>
  );
}

// Creatividad — a tight crop of four real fragment-cluster-board shards
// (the same polygons Dolor 1/2 use), not a fresh icon language.
export function FragmentClusterIcon({ className }: IconProps) {
  const uid = useId();
  const gradId = `motor-frag-${uid}`;
  const shards = [FRAGMENTS[0], FRAGMENTS[1], FRAGMENTS[4], FRAGMENTS[5]].filter(
    (shard) => shard !== undefined,
  );
  return (
    <svg viewBox="18 10 115 105" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".7" />
          <stop offset=".35" stopColor="var(--pink-soft)" />
          <stop offset="1" stopColor="var(--pink)" />
        </linearGradient>
      </defs>
      {shards.map((shard, i) => (
        <polygon
          key={i}
          points={shard.points}
          fill={
            shard.treatment === "graded"
              ? `url(#${gradId})`
              : shard.treatment === "dark"
                ? "var(--ink-deep-2)"
                : "var(--pink)"
          }
          stroke="rgba(255,255,255,.32)"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

// The transversal "medición" motif: a faint ascending-bars pattern that
// runs behind all four motor cards (see .motores-bars), not a fifth card.
export function BarsMotif({ className }: IconProps) {
  const uid = useId();
  const gradId = `bars-${uid}`;
  return (
    <svg viewBox="0 0 320 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="var(--pink)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--pink)" stopOpacity=".55" />
        </linearGradient>
      </defs>
      {/* One ascending bar per motor column, evenly spread across the full
          320-wide viewBox so it reads as behind all four cards, not just
          the first ones. */}
      <path d="M26 92V74l20-7v25z" fill={`url(#${gradId})`} />
      <path d="M106 92V56l22-9v45z" fill={`url(#${gradId})`} />
      <path d="M186 92V40l23-9v61z" fill={`url(#${gradId})`} />
      <path d="M266 92V24l23-9v77z" fill={`url(#${gradId})`} />
      <path d="M14 94h296" stroke="var(--pink)" strokeOpacity=".25" strokeWidth="0.6" />
    </svg>
  );
}
