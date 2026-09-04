import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { PILL_CAPABILITIES, PILL_SVG, type PillId } from "./pillCatalog";
import { PillCapsule, PillIcon } from "./PillShapes";
import { u } from "./sceneUnits";

export const SCENE_PILL_ENTRY_DELAY_MS = 260;
export const SCENE_PILL_STAGGER_MS = 90;

/**
 * Plano de profundidad. `far` NO es simplemente "más transparente": el cuerpo
 * se desenfoca y la etiqueta queda nítida, en dos SVG hermanos (ver más abajo).
 */
export type ScenePlane = "far" | "mid" | "near";

export type ScenePillDef = {
  id: PillId;
  plane: ScenePlane;
  /** Coordenadas del mockup, en unidades del lienzo 1440 × 900. */
  left: number;
  top: number;
  width: number;
  rotate: number;
};

const PLANE_CLASS: Record<ScenePlane, string> = {
  far: "scene-pill-far",
  mid: "scene-pill-mid",
  near: "scene-pill-near",
};

/**
 * Una píldora de capacidad sobre el lienzo de una escena.
 *
 * Plano lejano — técnica aprobada en la Sección 02 del plan: el cuerpo
 * (cápsula + aro) y la etiqueta (icono + palabra) se renderizan como DOS SVG
 * HERMANOS superpositados, con el mismo viewBox. El cuerpo lleva blur 1.55 px
 * y opacidad .44; la etiqueta va sin filtro a opacidad .62. Así la profundidad
 * vive en la forma y las seis capacidades se siguen identificando.
 *
 * Tienen que ser hermanos y no un <g> dentro del mismo SVG: adentro del SVG el
 * desenfoque se calcularía en unidades del viewBox, así que el blur real
 * cambiaría con la escala de cada píldora en vez de valer 1.55 px de pantalla.
 */
export function ScenePill({
  pill,
  index,
  play,
}: {
  pill: ScenePillDef;
  index: number;
  play: boolean;
}) {
  const capability = PILL_CAPABILITIES[pill.id];
  const slotStyle: CSSProperties = {
    left: u(pill.left),
    top: u(pill.top),
    width: u(pill.width),
  };
  const labelStyle: CSSProperties = {
    left: `${PILL_SVG.labelLeftRatio * 100}%`,
    fontSize: u(pill.width * PILL_SVG.labelFontRatio),
    letterSpacing: `${PILL_SVG.labelLetterSpacingEm}em`,
  };
  const isFar = pill.plane === "far";

  return (
    <div className="scene-pill-slot" style={slotStyle}>
      <div
        className={cn("scene-pill", PLANE_CLASS[pill.plane])}
        data-revealed={play ? "true" : "false"}
        style={{
          transitionDelay: `${SCENE_PILL_ENTRY_DELAY_MS + index * SCENE_PILL_STAGGER_MS}ms`,
        }}
      >
        <div className="scene-pill-body" style={{ transform: `rotate(${pill.rotate}deg)` }}>
          <svg
            viewBox={PILL_SVG.viewBox}
            className={cn("scene-pill-svg", isFar && "scene-pill-capsule-far")}
            aria-hidden="true"
          >
            <PillCapsule />
            {!isFar && <PillIcon glyph={capability.icon} />}
          </svg>

          {isFar && (
            <svg
              viewBox={PILL_SVG.viewBox}
              className="scene-pill-svg scene-pill-glyph-far"
              aria-hidden="true"
            >
              <PillIcon glyph={capability.icon} />
            </svg>
          )}

          <span
            className={cn("scene-pill-label", isFar && "scene-pill-label-far")}
            style={labelStyle}
          >
            {capability.label}
          </span>
        </div>
      </div>
    </div>
  );
}
