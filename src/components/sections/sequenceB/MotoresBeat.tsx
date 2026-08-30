import { useEffect, useRef, type ComponentType } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import {
  BarsMotif,
  FragmentClusterIcon,
  LightningIcon,
  PrismIcon,
  TargetStructureIcon,
} from "@/components/brand/motorIcons";
import { BEATS } from "./poses";

type Motor = { name: string; text: string; Icon: ComponentType<{ className?: string }> };

// Same four motors/copy as the pre-V3 Motores.tsx (staticFallback) — this
// beat is that section's content, not a rewrite of it.
const MOTORES: Motor[] = [
  {
    name: "Estrategia",
    text: "Primero entendemos el negocio. Después armamos el plan.",
    Icon: PrismIcon,
  },
  {
    name: "Creatividad",
    text: "Piezas pensadas para funcionar, no solo para llenar el feed.",
    Icon: FragmentClusterIcon,
  },
  {
    name: "Adquisición",
    text: "Campañas que se miden por venta real, no por clics.",
    Icon: LightningIcon,
  },
  {
    name: "Web & Conversión",
    text: "Sitios y fichas pensados para convertir, no solo para existir.",
    Icon: TargetStructureIcon,
  },
];

// Local window (within the motores beat) where the four objects crossfade
// in — right after SequenceBStage's crystal has fully fractured/faded
// (see sequenceB/poses.ts: gone by t=0.32), so the hand-off reads as "the
// V released these four" rather than two unrelated animations.
const ICONS_IN_START = 0.34;
const ICONS_IN_END = 0.48;

/**
 * Pinned-mode Motores overlay: the same four motor cards as the pre-V3
 * Motores.tsx, entering as a relay from SequenceBStage's crystal (relevo
 * espacial, not a shared-shape morph — a prism/lightning/target/fragment-
 * cluster is not a facet of the V, so this is deliberately a crossfade,
 * not a per-facet-tracked "morph").
 */
export function MotoresBeat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.motores.start, BEATS.motores.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);

      const span = ICONS_IN_END - ICONS_IN_START;
      iconRefs.current.forEach((el, i) => {
        if (!el) return;
        const localStart = ICONS_IN_START + i * 0.02;
        const t = Math.min(Math.max((progress - localStart) / span, 0), 1);
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${(14 * (1 - t)).toFixed(2)}px) scale(${(0.85 + 0.15 * t).toFixed(3)})`;
      });
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0 flex items-center">
      <div className="container-v text-center">
        <span className="eyebrow text-on-dark-2">Cómo trabajamos</span>
        <h2 className="display-m motores-headline mx-auto mt-3 text-on-dark">
          Un equipo. Cuatro motores funcionando juntos.
        </h2>
        <p className="body-base mx-auto mt-3 max-w-[56ch] text-on-dark-2">
          Estrategia, creatividad, adquisición y web &amp; conversión no se activan por separado.
          Medición los conecta a todos.
        </p>

        <div className="motores-grid mt-10">
          {MOTORES.map((motor, i) => (
            <article key={motor.name} className="motores-card">
              <span
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="motores-icon"
                aria-hidden="true"
                style={{ display: "block", opacity: 0 }}
              >
                <motor.Icon className="h-full w-full" />
              </span>
              <h3 className="motores-card-title text-on-dark">{motor.name}</h3>
              <p className="motores-card-text text-on-dark-2">{motor.text}</p>
            </article>
          ))}
          <div className="motores-bars-row" aria-hidden="true">
            <BarsMotif className="motores-bars" />
          </div>
        </div>
      </div>
    </div>
  );
}
