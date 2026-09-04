import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { HERO_PILL_SVG, u, type HeroPillDef, type HeroPillPlane } from "./heroContent";

export const PILL_ENTRY_DELAY_MS = 800;
export const PILL_STAGGER_MS = 80;

/** Nombres literales: Tailwind sólo emite las utilidades que encuentra escritas en el código. */
const PLANE_CLASS: Record<HeroPillPlane, string> = {
  far: "hero-pill-far",
  mid: "hero-pill-mid",
  near: "hero-pill-near",
};

type HeroPillProps = {
  pill: HeroPillDef;
  index: number;
  play: boolean;
  /** El slot exterior recibe el parallax por scroll; la entrada vive en el hijo. */
  slotRef?: (el: HTMLDivElement | null) => void;
};

/**
 * Píldora oficial de official/pills/<id>.svg. La geometría (cápsula, aro e
 * icono) es la del SVG maestro; la etiqueta se tipografía en HTML con
 * Manrope 700 encima, en la misma posición y proporción que el <text> del
 * asset (x=72/300, 18/72 de alto). Los archivos maestros no se tocan.
 */
export function HeroPill({ pill, index, play, slotRef }: HeroPillProps) {
  const slotStyle: CSSProperties = {
    top: u(pill.top),
    width: u(pill.width),
    [pill.side]: u(pill.inset),
  };
  const labelStyle: CSSProperties = {
    left: `${HERO_PILL_SVG.labelLeftRatio * 100}%`,
    fontSize: u(pill.width * HERO_PILL_SVG.labelFontRatio),
    letterSpacing: `${HERO_PILL_SVG.labelLetterSpacingEm}em`,
  };

  return (
    <div ref={slotRef} className="hero-pill-slot" style={slotStyle}>
      <div
        className={cn("hero-pill", PLANE_CLASS[pill.plane])}
        data-revealed={play ? "true" : "false"}
        style={{ transitionDelay: `${PILL_ENTRY_DELAY_MS + index * PILL_STAGGER_MS}ms` }}
      >
        <div className="hero-pill-body" style={{ transform: `rotate(${pill.rotate}deg)` }}>
          <svg viewBox={HERO_PILL_SVG.viewBox} className="hero-pill-svg" aria-hidden="true">
            <rect
              x="1"
              y="1"
              width="298"
              height="70"
              rx="34"
              fill="#0E0E13"
              fillOpacity=".85"
              stroke="#FF4B8D"
              strokeOpacity=".75"
            />
            <circle
              cx="40"
              cy="36"
              r="16"
              fill="#FF4B8D"
              fillOpacity=".12"
              stroke="#FF4B8D"
              strokeOpacity=".8"
            />
            <text x="40" y="42" textAnchor="middle" fontSize="20" fill="#FF4B8D" fontFamily="Arial">
              {pill.icon}
            </text>
          </svg>
          <span className="hero-pill-label" style={labelStyle}>
            {pill.label}
          </span>
        </div>
      </div>
    </div>
  );
}
