import { useEffect, useId, useRef, useState } from "react";
import { BarsObject, LightningObject, PrismObject } from "@/components/brand/SystemObjects";
import { TargetMark } from "@/components/brand/TargetMark";
import { SceneGuideFragment } from "@/components/scene/SceneGuideFragment";
import { SCENE_CANVAS, u } from "@/components/scene/sceneUnits";
import { useReveal } from "@/hooks/useReveal";
import { useScrollRange } from "@/hooks/useScrollEngine";
import { cn } from "@/lib/utils";
import {
  COMO_TRABAJAMOS_CARDS,
  COMO_TRABAJAMOS_COPY,
  COMO_TRABAJAMOS_COPY_BOX,
  COMO_TRABAJAMOS_GUIDE_PATH,
  COMO_TRABAJAMOS_GUIDE_REST,
  COMO_TRABAJAMOS_PULSE_FROM,
  COMO_TRABAJAMOS_ROW,
  COMO_TRABAJAMOS_SCALE,
  COMO_TRABAJAMOS_TICKS,
  comoTrabajamosPulse,
  type MotorDef,
} from "./comoTrabajamosContent";

function MotorObject({ objeto }: { objeto: MotorDef["objeto"] }) {
  switch (objeto) {
    case "mira":
      return <TargetMark className="scene-card-object-svg" />;
    case "prisma":
      // SIN RECORTAR: el viewBox 520 × 260 es más apaisado que el resto, así que
      // se limita por altura. Recortarlo para "equilibrar" sería modificar el asset.
      return <PrismObject className="scene-card-object-svg scene-card-object-wide" />;
    case "rayo":
      return <LightningObject className="scene-card-object-svg" />;
    case "barras":
      return <BarsObject className="scene-card-object-svg" />;
  }
}

/**
 * Card de motor. Estructura interna: objeto (118 px fijo) → número → ESPACIO
 * FLEXIBLE → título → descripción. Ese espacio flexible es lo que mantiene los
 * cuatro títulos alineados aunque los objetos tengan proporciones distintas.
 */
function MotorCard({ card, index }: { card: MotorDef; index: number }) {
  const ref = useReveal<HTMLDivElement>({ delay: index * 90 });

  return (
    <article
      ref={ref}
      className="scene-card reveal"
      data-revealed="false"
      style={{ left: u(card.left), top: u(COMO_TRABAJAMOS_ROW.top) }}
    >
      <div className="scene-card-object" aria-hidden="true">
        <MotorObject objeto={card.objeto} />
      </div>
      <span className="scene-card-num">{card.numero}</span>
      <h3 className="scene-card-title">{card.titulo}</h3>
      <p className="scene-card-text">{card.texto}</p>
    </article>
  );
}

/** La escala de medición y el pulso vertical que activa el nodo 01. */
function MedicionScale({ pulseRef }: { pulseRef: React.RefObject<SVGGElement | null> }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const beamId = `mt-beam-${uid}`;
  const glowId = `mt-glow-${uid}`;
  const activeX = COMO_TRABAJAMOS_SCALE.nodes[COMO_TRABAJAMOS_SCALE.activeNodeIndex] ?? 225;

  return (
    <svg
      className="scene-scale"
      viewBox={`0 0 ${SCENE_CANVAS.width} ${SCENE_CANVAS.height}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={beamId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--pink-soft)" stopOpacity=".42" />
          <stop offset=".55" stopColor="var(--pink)" stopOpacity=".16" />
          <stop offset="1" stopColor="var(--pink)" stopOpacity=".5" />
        </linearGradient>
        <filter id={glowId} x="-120%" y="-30%" width="340%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Pulso vertical: el fragmento señala, el pulso hace el trabajo. */}
      <g ref={pulseRef} className="scene-scale-pulse">
        <rect
          x={activeX - 9}
          y={COMO_TRABAJAMOS_PULSE_FROM}
          width="18"
          height={COMO_TRABAJAMOS_SCALE.y - COMO_TRABAJAMOS_PULSE_FROM}
          fill={`url(#${beamId})`}
          filter={`url(#${glowId})`}
          opacity=".55"
        />
        <path
          d={`M${activeX} ${COMO_TRABAJAMOS_PULSE_FROM}V${COMO_TRABAJAMOS_SCALE.y}`}
          stroke={`url(#${beamId})`}
          strokeWidth="1.4"
        />
        <circle
          cx={activeX}
          cy={COMO_TRABAJAMOS_SCALE.y}
          r="15"
          fill="var(--pink)"
          fillOpacity=".18"
          filter={`url(#${glowId})`}
        />
        <circle
          cx={activeX}
          cy={COMO_TRABAJAMOS_SCALE.y}
          r="13"
          fill="none"
          stroke="var(--pink-soft)"
          strokeOpacity=".5"
          strokeWidth="1"
        />
      </g>

      {/* Eje derivado del ScrollAxis oficial: capa secundaria, nunca una card. */}
      <path
        d={`M0 ${COMO_TRABAJAMOS_SCALE.y}H${SCENE_CANVAS.width}`}
        stroke="var(--pink)"
        strokeOpacity={COMO_TRABAJAMOS_SCALE.strokeOpacity}
        strokeWidth={COMO_TRABAJAMOS_SCALE.strokeWidth}
      />
      {COMO_TRABAJAMOS_TICKS.map((x) => (
        <path
          key={x}
          d={`M${x} ${COMO_TRABAJAMOS_SCALE.y - 4}v8`}
          stroke="var(--pink)"
          strokeOpacity=".16"
        />
      ))}
      {COMO_TRABAJAMOS_SCALE.nodes.map((x, index) => {
        const active = index === COMO_TRABAJAMOS_SCALE.activeNodeIndex;
        return (
          <g key={x}>
            <circle
              cx={x}
              cy={COMO_TRABAJAMOS_SCALE.y}
              r="6.5"
              fill="var(--ink-deep)"
              stroke="var(--pink)"
              strokeOpacity={active ? 0.95 : 0.75}
              strokeWidth={active ? 1.7 : 1.3}
            />
            <circle
              cx={x}
              cy={COMO_TRABAJAMOS_SCALE.y}
              r={active ? 3 : 2.2}
              fill="var(--pink)"
              fillOpacity={active ? 1 : 0.7}
            />
          </g>
        );
      })}
      {/* Una sola leyenda, al inicio del eje. Sin rótulo por nodo. */}
      <text
        x={COMO_TRABAJAMOS_SCALE.legend.x}
        y={COMO_TRABAJAMOS_SCALE.legend.y}
        className="scene-scale-legend"
      >
        {COMO_TRABAJAMOS_SCALE.legend.text}
      </text>
    </svg>
  );
}

/**
 * Sección 05 — Cómo trabajamos.
 *
 * Cuatro motores en fila, cada uno con su objeto del sistema, atravesados por
 * una escala de medición que los relaciona sin ser uno más. El fragmento guía se
 * alinea en el canal superior y activa el nodo 01 A DISTANCIA: su cuerpo nunca
 * entra en una card.
 *
 * Es una sección de SCROLL NORMAL, no un beat pinned.
 */
export function ComoTrabajamos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pulseRef = useRef<SVGGElement | null>(null);
  const copyRef = useReveal<HTMLDivElement>();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    // Sin movimiento el nodo 01 ya aparece activo, con su pulso al máximo.
    if (reduced && pulseRef.current) pulseRef.current.style.opacity = "1";
  }, []);

  useScrollRange(sectionRef, (progress) => {
    if (reducedMotion || !pulseRef.current) return;
    pulseRef.current.style.opacity = comoTrabajamosPulse(progress).toFixed(3);
  });

  return (
    <section ref={sectionRef} className="scene-static" id="motores">
      <div className={cn("scene-canvas", "scene-canvas-static")}>
        <MedicionScale pulseRef={pulseRef} />

        {COMO_TRABAJAMOS_CARDS.map((card, index) => (
          <MotorCard key={card.id} card={card} index={index} />
        ))}

        <SceneGuideFragment
          sectionRef={sectionRef}
          spec={COMO_TRABAJAMOS_GUIDE_PATH}
          restLocal={COMO_TRABAJAMOS_GUIDE_REST}
        />

        <div
          ref={copyRef}
          className="scene-copy scene-copy-center reveal"
          data-revealed="false"
          style={{
            top: u(COMO_TRABAJAMOS_COPY_BOX.top),
            paddingInline: u(COMO_TRABAJAMOS_COPY_BOX.paddingInline),
          }}
        >
          <span className="scene-eyebrow scene-eyebrow-tight">{COMO_TRABAJAMOS_COPY.eyebrow}</span>
          <h2 className="scene-h2 scene-h2-module">
            {COMO_TRABAJAMOS_COPY.headlineBefore}
            <span className="scene-h2-accent">{COMO_TRABAJAMOS_COPY.headlineAccent}</span>
            {COMO_TRABAJAMOS_COPY.headlineAfter}
          </h2>
          <p
            className="scene-sub scene-sub-tight"
            style={{
              maxWidth: `${COMO_TRABAJAMOS_COPY.subtitleMeasureCh}ch`,
              marginInline: "auto",
            }}
          >
            {COMO_TRABAJAMOS_COPY.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
