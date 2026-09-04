import { useEffect, useRef, useState, type RefObject } from "react";
import { HeroComposition } from "@/components/hero/HeroComposition";
import { HERO_PILL_PLANES, HERO_PILLS } from "@/components/hero/heroContent";
import { beatLocalProgress, beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";

type HeroBeatProps = {
  /** Slot real del stage que CrystalStage mide para la rama legada de Crystal V. */
  slotRef: RefObject<HTMLDivElement | null>;
};

/**
 * Overlay pinned del Hero: copy, CTA y píldoras (HeroComposition en modo
 * "pinned"). El Crystal 5 no se pinta acá: lo pinta CrystalStage sobre el
 * mismo lienzo, entre las píldoras y el copy. Visible desde la carga y se
 * funde al salir hacia Dolor1; las píldoras hacen un parallax mínimo por
 * plano de profundidad con el progreso local del beat.
 */
export function HeroBeat({ slotRef }: HeroBeatProps) {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pillSlotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.hero.start, BEATS.hero.end);
      if (rootRef.current) {
        rootRef.current.style.opacity = visibility.toFixed(3);
        rootRef.current.style.pointerEvents = visibility > 0.5 ? "auto" : "none";
      }
      const local = beatLocalProgress(progress, BEATS.hero.start, BEATS.hero.end);
      pillSlotRefs.current.forEach((el, index) => {
        const pill = HERO_PILLS[index];
        if (!el || !pill) return;
        const parallax = HERO_PILL_PLANES[pill.plane].parallax;
        el.style.transform = `translate3d(0, calc(${(-local * parallax).toFixed(2)} * var(--u)), 0)`;
      });
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <HeroComposition
        mode="pinned"
        play={play}
        stageRef={slotRef}
        pillSlotRef={(el, index) => {
          pillSlotRefs.current[index] = el;
        }}
      />
    </div>
  );
}
