import type { CSSProperties, RefObject } from "react";
import { GuideFragment } from "@/components/brand/GuideFragment";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { ScenePill } from "@/components/scene/ScenePill";
import { SCENE_CANVAS, u } from "@/components/scene/sceneUnits";
import { cn } from "@/lib/utils";
import {
  PROBLEMA_UNO_COPY,
  PROBLEMA_UNO_COPY_BOX,
  PROBLEMA_UNO_DUST,
  PROBLEMA_UNO_GUIDE_POSE,
  PROBLEMA_UNO_PILLS,
} from "./problemaUnoContent";

export const PROBLEMA_UNO_ENTRY_DELAYS = {
  eyebrow: 120,
  headline: 240,
  subtitle: 420,
} as const;

type ProblemaUnoCompositionProps = {
  /**
   * "static": fallback sin scroll pinned. Incluye el fragmento guía en su pose
   * aprobada, porque acá no hay una escena anterior que lo traiga.
   * "pinned": el fragmento lo pinta CrystalStage, que lo mueve de forma continua
   * entre las Secciones 02, 03 y 04.
   */
  mode: "static" | "pinned";
  play: boolean;
  dustRef?: RefObject<SVGSVGElement | null>;
};

/**
 * Sección 02 — El problema.
 *
 * Las seis capacidades existen y son reconocibles, pero ninguna se relaciona con
 * otra: sin centro, sin eje y sin agrupamiento. No se repite la explosión, no
 * aparece el Crystal 5 completo y no hay grupos de fragmentos.
 *
 * Capas: polvo (z 8) · píldoras (z 10) · fragmento guía (z 24, lo pinta
 * CrystalStage en modo pinned) · copy (z 30).
 */
export function ProblemaUnoComposition({ mode, play, dustRef }: ProblemaUnoCompositionProps) {
  const revealed = play ? "true" : "false";
  const copyStyle: CSSProperties = {
    left: u(PROBLEMA_UNO_COPY_BOX.left),
    top: u(PROBLEMA_UNO_COPY_BOX.top),
    width: u(PROBLEMA_UNO_COPY_BOX.width),
  };

  return (
    <div
      className={cn(
        "scene-canvas",
        mode === "pinned" ? "scene-canvas-overlay" : "scene-canvas-static",
      )}
    >
      <svg
        ref={dustRef}
        className="scene-dust"
        viewBox={`0 0 ${SCENE_CANVAS.width} ${SCENE_CANVAS.height}`}
        aria-hidden="true"
      >
        <g fill="var(--pink-soft)">
          {PROBLEMA_UNO_DUST.map((mote) => (
            <circle
              key={`${mote.x}-${mote.y}`}
              cx={mote.x}
              cy={mote.y}
              r={mote.r}
              opacity={mote.opacity}
            />
          ))}
        </g>
      </svg>

      <div className="scene-pills" aria-hidden="true">
        {PROBLEMA_UNO_PILLS.map((pill, index) => (
          <ScenePill key={pill.id} pill={pill} index={index} play={play} />
        ))}
      </div>

      {mode === "static" && (
        <div
          className="scene-guide-slot"
          style={{
            left: u(PROBLEMA_UNO_GUIDE_POSE.left),
            top: u(PROBLEMA_UNO_GUIDE_POSE.top),
            width: u(PROBLEMA_UNO_GUIDE_POSE.width),
            height: u(guideFragmentHeight(PROBLEMA_UNO_GUIDE_POSE.width)),
            transform: `rotate(${PROBLEMA_UNO_GUIDE_POSE.rotate}deg)`,
          }}
          aria-hidden="true"
        >
          <GuideFragment className="scene-guide-svg" />
        </div>
      )}

      <div className="scene-copy scene-copy-left" style={copyStyle}>
        <span
          className="scene-eyebrow reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${PROBLEMA_UNO_ENTRY_DELAYS.eyebrow}ms` }}
        >
          {PROBLEMA_UNO_COPY.eyebrow}
        </span>

        <h2
          className="scene-h2 reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${PROBLEMA_UNO_ENTRY_DELAYS.headline}ms` }}
        >
          {PROBLEMA_UNO_COPY.headlineBefore}
          <span className="scene-h2-accent">{PROBLEMA_UNO_COPY.headlineAccent}</span>
          {PROBLEMA_UNO_COPY.headlineAfter}
        </h2>

        <p
          className="scene-sub reveal"
          data-revealed={revealed}
          style={{
            maxWidth: `${PROBLEMA_UNO_COPY.subtitleMeasureCh}ch`,
            transitionDelay: `${PROBLEMA_UNO_ENTRY_DELAYS.subtitle}ms`,
          }}
        >
          {PROBLEMA_UNO_COPY.subtitle}
        </p>
      </div>
    </div>
  );
}
