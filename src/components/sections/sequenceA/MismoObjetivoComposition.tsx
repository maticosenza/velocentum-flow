import type { CSSProperties, RefObject } from "react";
import { CrystalFootprint } from "@/components/brand/CrystalFootprint";
import { GuideFragment } from "@/components/brand/GuideFragment";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { TargetMark } from "@/components/brand/TargetMark";
import { SCENE_CANVAS, u } from "@/components/scene/sceneUnits";
import { cn } from "@/lib/utils";
import {
  MISMO_OBJETIVO_COPY,
  MISMO_OBJETIVO_COPY_BOX,
  MISMO_OBJETIVO_FOOTPRINT,
  MISMO_OBJETIVO_GUIDE_BOX,
  MISMO_OBJETIVO_GUIDE_ROTATION,
  MISMO_OBJETIVO_TARGET,
} from "./mismoObjetivoContent";

export const MISMO_OBJETIVO_ENTRY_DELAYS = {
  eyebrow: 120,
  headline: 240,
  subtitle: 420,
} as const;

type MismoObjetivoCompositionProps = {
  mode: "static" | "pinned";
  play: boolean;
  /** Pulso de luz breve en el núcleo de la Mira, durante la alineación. */
  pulseRef?: RefObject<SVGGElement | null>;
};

/**
 * Sección 04 — Un mismo objetivo.
 *
 * Es el punto de giro de la HOME: la narrativa deja de mostrar problemas y
 * empieza a mostrar dirección. La pausa se construye QUITANDO: donde la 02 y la
 * 03 tienen seis píldoras y conexiones, acá quedan TRES ELEMENTOS y un eje —
 * huella, Mira y fragmento. SIN PÍLDORAS.
 *
 * Capas: huella (z 8) · Mira y su pulso (z 14) · fragmento guía (z 24) ·
 * copy (z 30).
 */
export function MismoObjetivoComposition({ mode, play, pulseRef }: MismoObjetivoCompositionProps) {
  const revealed = play ? "true" : "false";
  const copyStyle: CSSProperties = {
    top: u(MISMO_OBJETIVO_COPY_BOX.top),
    paddingInline: u(MISMO_OBJETIVO_COPY_BOX.paddingInline),
  };

  return (
    <div
      className={cn(
        "scene-canvas",
        mode === "pinned" ? "scene-canvas-overlay" : "scene-canvas-static",
      )}
    >
      <div
        className="scene-footprint"
        style={{
          left: u(MISMO_OBJETIVO_FOOTPRINT.centerX - MISMO_OBJETIVO_FOOTPRINT.width / 2),
          top: u(MISMO_OBJETIVO_FOOTPRINT.top),
          width: u(MISMO_OBJETIVO_FOOTPRINT.width),
        }}
        aria-hidden="true"
      >
        <CrystalFootprint className="scene-footprint-svg" />
      </div>

      <div
        className="scene-target"
        style={{
          left: u(MISMO_OBJETIVO_TARGET.x - MISMO_OBJETIVO_TARGET.size / 2),
          top: u(MISMO_OBJETIVO_TARGET.y - MISMO_OBJETIVO_TARGET.size / 2),
          width: u(MISMO_OBJETIVO_TARGET.size),
        }}
        aria-hidden="true"
      >
        <TargetMark className="scene-target-svg" />
      </div>

      {/* El pulso vive en su propia capa: la Mira es el asset oficial y no se
          toca, y así el pulso anima sólo opacity y transform. */}
      <svg
        className="scene-target-pulse-layer"
        viewBox={`0 0 ${SCENE_CANVAS.width} ${SCENE_CANVAS.height}`}
        aria-hidden="true"
      >
        <g ref={pulseRef} className="scene-target-pulse">
          <circle
            cx={MISMO_OBJETIVO_TARGET.x}
            cy={MISMO_OBJETIVO_TARGET.y}
            r={MISMO_OBJETIVO_TARGET.size * 0.13}
            fill="var(--pink-soft)"
            fillOpacity="0.3"
          />
          <circle
            cx={MISMO_OBJETIVO_TARGET.x}
            cy={MISMO_OBJETIVO_TARGET.y}
            r={MISMO_OBJETIVO_TARGET.size * 0.055}
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </g>
      </svg>

      {mode === "static" && (
        <div
          className="scene-guide-slot"
          style={{
            left: u(MISMO_OBJETIVO_GUIDE_BOX.left),
            top: u(MISMO_OBJETIVO_GUIDE_BOX.top),
            width: u(MISMO_OBJETIVO_GUIDE_BOX.width),
            height: u(guideFragmentHeight(MISMO_OBJETIVO_GUIDE_BOX.width)),
            transform: `rotate(${MISMO_OBJETIVO_GUIDE_ROTATION}deg)`,
          }}
          aria-hidden="true"
        >
          <GuideFragment className="scene-guide-svg" />
        </div>
      )}

      <div className="scene-copy scene-copy-center" style={copyStyle}>
        <span
          className="scene-eyebrow reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${MISMO_OBJETIVO_ENTRY_DELAYS.eyebrow}ms` }}
        >
          {MISMO_OBJETIVO_COPY.eyebrow}
        </span>

        <h2
          className="scene-h2 scene-h2-objetivo reveal"
          data-revealed={revealed}
          style={{
            maxWidth: u(MISMO_OBJETIVO_COPY.headlineMaxWidth),
            transitionDelay: `${MISMO_OBJETIVO_ENTRY_DELAYS.headline}ms`,
          }}
        >
          {MISMO_OBJETIVO_COPY.headlineBefore}
          <span className="scene-h2-accent">{MISMO_OBJETIVO_COPY.headlineAccent}</span>
          {MISMO_OBJETIVO_COPY.headlineAfter}
        </h2>

        <p
          className="scene-sub reveal"
          data-revealed={revealed}
          style={{
            maxWidth: `${MISMO_OBJETIVO_COPY.subtitleMeasureCh}ch`,
            marginInline: "auto",
            transitionDelay: `${MISMO_OBJETIVO_ENTRY_DELAYS.subtitle}ms`,
          }}
        >
          {MISMO_OBJETIVO_COPY.subtitle}
        </p>
      </div>
    </div>
  );
}
