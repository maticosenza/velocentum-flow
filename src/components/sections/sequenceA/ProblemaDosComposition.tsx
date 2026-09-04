import type { CSSProperties, RefObject } from "react";
import { GuideFragment } from "@/components/brand/GuideFragment";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { ScenePill } from "@/components/scene/ScenePill";
import { SCENE_CANVAS, u } from "@/components/scene/sceneUnits";
import { cn } from "@/lib/utils";
import {
  PROBLEMA_DOS_BROKEN_LINK,
  PROBLEMA_DOS_COPY,
  PROBLEMA_DOS_COPY_BOX,
  PROBLEMA_DOS_GUIDE_POSE,
  PROBLEMA_DOS_LINKS,
  PROBLEMA_DOS_PILLS,
  PROBLEMA_DOS_PLANE_OPACITY,
} from "./problemaDosContent";

export const PROBLEMA_DOS_ENTRY_DELAYS = {
  eyebrow: 120,
  headline: 240,
  subtitle: 420,
} as const;

type ProblemaDosCompositionProps = {
  mode: "static" | "pinned";
  play: boolean;
  /** El halo del destello, al pasar el fragmento cerca del extremo cortado. */
  flashRef?: RefObject<SVGGElement | null>;
};

/**
 * Sección 03 — El otro problema.
 *
 * Las capacidades ahora sí se agrupan, pero cada grupo funciona por su cuenta:
 * hay una conexión dentro de cada cluster y ninguna entre ellos. Nunca se forma
 * una red completa. El vacío inferior derecho es deliberado: es el corredor por
 * donde el fragmento acaba de cruzar.
 *
 * Capas: conexiones (z 6) · píldoras (z 12) · fragmento guía (z 24) · copy (z 30).
 */
export function ProblemaDosComposition({ mode, play, flashRef }: ProblemaDosCompositionProps) {
  const revealed = play ? "true" : "false";
  const copyStyle: CSSProperties = {
    right: u(PROBLEMA_DOS_COPY_BOX.right),
    top: u(PROBLEMA_DOS_COPY_BOX.top),
    width: u(PROBLEMA_DOS_COPY_BOX.width),
  };

  return (
    <div
      className={cn(
        "scene-canvas",
        mode === "pinned" ? "scene-canvas-overlay" : "scene-canvas-static",
      )}
    >
      <svg
        className="scene-links"
        viewBox={`0 0 ${SCENE_CANVAS.width} ${SCENE_CANVAS.height}`}
        aria-hidden="true"
      >
        <g stroke="var(--pink)" fill="none" strokeLinecap="round">
          {PROBLEMA_DOS_LINKS.map((link) => (
            <path
              key={`${link.from.x}-${link.from.y}`}
              d={`M${link.from.x} ${link.from.y} L${link.to.x} ${link.to.y}`}
              strokeOpacity={link.opacity}
              strokeWidth={link.width}
            />
          ))}
          <path
            d={`M${PROBLEMA_DOS_BROKEN_LINK.from.x} ${PROBLEMA_DOS_BROKEN_LINK.from.y} L${PROBLEMA_DOS_BROKEN_LINK.to.x} ${PROBLEMA_DOS_BROKEN_LINK.to.y}`}
            strokeOpacity={PROBLEMA_DOS_BROKEN_LINK.opacity}
            strokeWidth={PROBLEMA_DOS_BROKEN_LINK.width}
            strokeDasharray={PROBLEMA_DOS_BROKEN_LINK.dash}
          />
        </g>
        {/* Punto tenue del extremo, en su valor aprobado: nunca se toca. */}
        <circle
          cx={PROBLEMA_DOS_BROKEN_LINK.to.x}
          cy={PROBLEMA_DOS_BROKEN_LINK.to.y}
          r={PROBLEMA_DOS_BROKEN_LINK.endpointRadius}
          fill="var(--pink-soft)"
          fillOpacity={PROBLEMA_DOS_BROKEN_LINK.endpointOpacity}
        />
        {/* Halo del destello, en una capa aparte para animar sólo opacity y
            transform y dejar intacto el punto aprobado. */}
        <g ref={flashRef} className="scene-link-flash">
          <circle
            cx={PROBLEMA_DOS_BROKEN_LINK.to.x}
            cy={PROBLEMA_DOS_BROKEN_LINK.to.y}
            r={PROBLEMA_DOS_BROKEN_LINK.endpointRadius * 2.4}
            fill="var(--pink-soft)"
            fillOpacity="0.28"
          />
          <circle
            cx={PROBLEMA_DOS_BROKEN_LINK.to.x}
            cy={PROBLEMA_DOS_BROKEN_LINK.to.y}
            r={PROBLEMA_DOS_BROKEN_LINK.endpointRadius}
            fill="#FFFFFF"
            fillOpacity="0.85"
          />
        </g>
      </svg>

      <div className="scene-pills scene-pills-front" aria-hidden="true">
        {PROBLEMA_DOS_PILLS.map((pill, index) => (
          <ScenePill
            key={pill.id}
            pill={pill}
            index={index}
            play={play}
            planeOpacity={PROBLEMA_DOS_PLANE_OPACITY[pill.plane]}
          />
        ))}
      </div>

      {mode === "static" && (
        <div
          className="scene-guide-slot"
          style={{
            left: u(PROBLEMA_DOS_GUIDE_POSE.left),
            top: u(PROBLEMA_DOS_GUIDE_POSE.top),
            width: u(PROBLEMA_DOS_GUIDE_POSE.width),
            height: u(guideFragmentHeight(PROBLEMA_DOS_GUIDE_POSE.width)),
            transform: `rotate(${PROBLEMA_DOS_GUIDE_POSE.rotate}deg)`,
          }}
          aria-hidden="true"
        >
          <GuideFragment className="scene-guide-svg" />
        </div>
      )}

      <div className="scene-copy scene-copy-right" style={copyStyle}>
        <span
          className="scene-eyebrow reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${PROBLEMA_DOS_ENTRY_DELAYS.eyebrow}ms` }}
        >
          {PROBLEMA_DOS_COPY.eyebrow}
        </span>

        <h2
          className="scene-h2 reveal"
          data-revealed={revealed}
          style={{ transitionDelay: `${PROBLEMA_DOS_ENTRY_DELAYS.headline}ms` }}
        >
          {PROBLEMA_DOS_COPY.headlineBefore}
          <span className="scene-h2-accent">{PROBLEMA_DOS_COPY.headlineAccent}</span>
          {PROBLEMA_DOS_COPY.headlineAfter}
        </h2>

        <p
          className="scene-sub reveal"
          data-revealed={revealed}
          style={{
            maxWidth: `${PROBLEMA_DOS_COPY.subtitleMeasureCh}ch`,
            marginLeft: "auto",
            transitionDelay: `${PROBLEMA_DOS_ENTRY_DELAYS.subtitle}ms`,
          }}
        >
          {PROBLEMA_DOS_COPY.subtitle}
        </p>
      </div>
    </div>
  );
}
