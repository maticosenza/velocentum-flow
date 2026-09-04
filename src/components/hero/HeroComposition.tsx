import type { CSSProperties, RefObject } from "react";
import { BrandCTA } from "@/components/brand/BrandCTA";
import { CrystalFiveApproved } from "@/components/brand/CrystalFiveApproved";
import { cn } from "@/lib/utils";
import { HERO_COPY, HERO_CTAS, HERO_PILLS, u } from "./heroContent";
import { HeroPill } from "./HeroPill";

/** Delays de entrada (ms). El objeto llega primero; el copy lo sigue. */
export const HERO_ENTRY_DELAYS = {
  stage: 250,
  eyebrow: 550,
  headline: 700,
  subtitle: 900,
  ctas: 1050,
} as const;

/**
 * BrandCTA trae la geometría aprobada a 1440 (padding 15/30, .94rem, gap 10).
 * Acá se le pasa la misma geometría en unidades del lienzo para que escale
 * con el resto de la composición por encima de 1440 y valga lo mismo a 1440.
 */
const CTA_SCALE_STYLE: CSSProperties = {
  fontSize: u(15.04),
  padding: `${u(15)} ${u(30)}`,
  gap: u(10),
};

type HeroCompositionProps = {
  /**
   * "static": fallback sin scroll pinned (mobile y prefers-reduced-motion).
   * Renderiza el Crystal 5 armado adentro, sin `control`: DOM idéntico al asset.
   * "pinned": overlay del beat. El stage queda VACÍO a propósito: el Crystal 5 lo
   * pinta CrystalStage en la misma posición del lienzo (rama Hero).
   */
  mode: "static" | "pinned";
  play: boolean;
  /** Pinned: CrystalStage mide este slot para la rama legada de Crystal V. */
  stageRef?: RefObject<HTMLDivElement | null>;
  /** Pinned: el slot de cada píldora, para el parallax por plano. */
  pillSlotRef?: (el: HTMLDivElement | null, index: number) => void;
};

/**
 * La composición aprobada del Mockup 01 sobre un lienzo de 1440 × 900 unidades
 * (`--u`). Es la ÚNICA definición del layout del Hero: la consumen Hero.tsx
 * (estático) y HeroBeat.tsx (pinned).
 *
 * Capas, de atrás hacia adelante: píldoras (z 10) · Crystal 5 (z 20) · copy
 * (z 30). Ni el lienzo ni el root crean stacking context, para que en modo
 * pinned el Crystal 5 de CrystalStage se intercale entre píldoras y copy.
 */
export function HeroComposition({ mode, play, stageRef, pillSlotRef }: HeroCompositionProps) {
  const revealed = play ? "true" : "false";

  return (
    <div
      className={cn(
        "hero-canvas",
        mode === "pinned" ? "hero-canvas-overlay" : "hero-canvas-static",
      )}
    >
      <div className="hero-pills" aria-hidden="true">
        {HERO_PILLS.map((pill, index) => (
          <HeroPill
            key={pill.id}
            pill={pill}
            index={index}
            play={play}
            {...(pillSlotRef
              ? { slotRef: (el: HTMLDivElement | null) => pillSlotRef(el, index) }
              : {})}
          />
        ))}
      </div>

      {mode === "static" ? (
        <div className="hero-stage hero-stage-enter" data-revealed={revealed} aria-hidden="true">
          <CrystalFiveApproved className="hero-crystal-svg" />
        </div>
      ) : (
        <div ref={stageRef} className="hero-stage" aria-hidden="true" />
      )}

      <div className="hero-copy">
        <span
          className="hero-eyebrow reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${HERO_ENTRY_DELAYS.eyebrow}ms` }}
        >
          {HERO_COPY.eyebrow}
        </span>

        <h1
          className="hero-h1 reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${HERO_ENTRY_DELAYS.headline}ms` }}
        >
          {HERO_COPY.headlineLine1}
          <br />
          <span className="hero-h1-accent">{HERO_COPY.headlineLine2Accent}</span>.
        </h1>

        <p
          className="hero-sub reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${HERO_ENTRY_DELAYS.subtitle}ms` }}
        >
          {HERO_COPY.subtitle}
        </p>

        {/* BrandCTA ya renderiza su propio Link: se le pasan to y hash, nunca se envuelve en otro. */}
        <div
          className="hero-ctas reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${HERO_ENTRY_DELAYS.ctas}ms` }}
        >
          <BrandCTA
            to={HERO_CTAS.primary.to}
            hash={HERO_CTAS.primary.hash}
            variant="primary"
            style={CTA_SCALE_STYLE}
          >
            {HERO_CTAS.primary.label}
          </BrandCTA>
          <BrandCTA to={HERO_CTAS.secondary.to} variant="outline" style={CTA_SCALE_STYLE}>
            {HERO_CTAS.secondary.label}
          </BrandCTA>
        </div>
      </div>
    </div>
  );
}
