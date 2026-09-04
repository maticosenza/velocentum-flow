import { useCallback, useEffect, useRef, type RefObject } from "react";
import { CrystalV } from "@/components/brand/CrystalV";
import { HeroCrystal } from "@/components/hero/HeroCrystal";
import {
  applyPoses,
  beatLocalProgress,
  interpolatePoses,
  interpolateScalar,
} from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS, CRYSTAL_KEYFRAMES, EDGE_OPACITY_KEYFRAMES } from "./poses";

const CRYSTAL_ASPECT = 180 / 220; // CrystalV's own viewBox height/width

/**
 * Fundido de entrada del Crystal V legado.
 *
 * Ya no aparece ni en el Hero ni en la Sección 02: esas dos escenas tienen sus
 * propios mockups aprobados y en la 02 no hay Crystal completo, sólo píldoras
 * dispersas y el fragmento guía. Queda sirviendo a Dolor2 y Reveal hasta que
 * esas dos secciones se migren, cada una con su mockup.
 */
const LEGACY_FADE_IN = 0.06;

function legacyCrystalVisibility(progress: number): number {
  return Math.min(Math.max((progress - BEATS.dolor2.start) / LEGACY_FADE_IN, 0), 1);
}

type Rect = { top: number; left: number; width: number; height: number };

/**
 * Where the crystal sits at a given global progress is itself an
 * interpolated value — a pixel rect, not a CSS scale, because "aligned
 * with Hero's copy", "aligned with Reveal's copy" and "big dispersed
 * field, viewport-centered" are three genuinely different layouts, not
 * three scales of the same one. Hero and Reveal each want the crystal in
 * a slot measured from their own real layout (see heroSlotRef/
 * revealSlotRef); Dolor1/Dolor2 want it free-floating and large.
 *
 * Slots are measured on mount + resize only (never inside the scroll
 * callback) — same rule useScrollEngine already enforces for everything
 * else.
 */
function useCrystalRects(
  heroSlotRef: RefObject<HTMLDivElement | null>,
  revealSlotRef: RefObject<HTMLDivElement | null>,
) {
  const heroRectRef = useRef<Rect>({ top: 0, left: 0, width: 200, height: 200 * CRYSTAL_ASPECT });
  const revealRectRef = useRef<Rect>({ top: 0, left: 0, width: 275, height: 275 * CRYSTAL_ASPECT });

  useEffect(() => {
    function measure() {
      const heroSlot = heroSlotRef.current;
      if (heroSlot) {
        const rect = heroSlot.getBoundingClientRect();
        heroRectRef.current = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      }
      const revealSlot = revealSlotRef.current;
      if (revealSlot) {
        const rect = revealSlot.getBoundingClientRect();
        revealRectRef.current = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [heroSlotRef, revealSlotRef]);

  function freeRect(): Rect {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // 0.52, not a bigger fraction: Dolor1/Dolor2's text columns sit ~35-40%
    // in from each edge (see Dolor1Beat/Dolor2Beat's 560px columns), and a
    // wider field started clipping under their headlines.
    const width = Math.min(vw, vh) * 0.52;
    return {
      width,
      height: width * CRYSTAL_ASPECT,
      left: vw / 2 - width / 2,
      top: vh / 2 - (width * CRYSTAL_ASPECT) / 2,
    };
  }

  return { heroRectRef, revealRectRef, freeRect };
}

function mixRect(a: Rect, b: Rect, t: number): Rect {
  return {
    top: a.top + (b.top - a.top) * t,
    left: a.left + (b.left - a.left) * t,
    width: a.width + (b.width - a.width) * t,
    height: a.height + (b.height - a.height) * t,
  };
}

/**
 * Rect keyframes computed from the same global-progress timeline as the
 * facet keyframes (see poses.ts): hero-slot-anchored while assembled
 * through most of the Hero beat, free/large through Dolor1-Dolor2, then
 * reveal-slot-anchored for the final reassembly.
 */
function rectAtProgress(progress: number, hero: Rect, free: Rect, reveal: Rect): Rect {
  const stops: Array<{ t: number; rect: Rect }> = [
    { t: 0, rect: hero },
    { t: 0.22, rect: hero },
    { t: 0.3, rect: free },
    { t: 0.7, rect: free },
    { t: 0.9, rect: reveal },
    { t: 1, rect: reveal },
  ];
  const p = Math.min(Math.max(progress, 0), 1);
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1]!.t) i++;
  const a = stops[i]!;
  const b = stops[i + 1]!;
  const span = b.t - a.t || 1;
  return mixRect(a.rect, b.rect, (p - a.t) / span);
}

// Small settle overshoot right at the very end, mirroring the pre-V3
// RevealSection's own landing beat (scale 1.02 -> 1).
function settleFactor(progress: number): number {
  if (progress < 0.9) return 1;
  if (progress < 0.96) return 1 + ((progress - 0.9) / 0.06) * 0.02;
  return 1.02 - ((progress - 0.96) / 0.04) * 0.02;
}

type CrystalStageProps = {
  heroSlotRef: RefObject<HTMLDivElement | null>;
  revealSlotRef: RefObject<HTMLDivElement | null>;
};

/**
 * El objeto compartido de la Secuencia A, en dos ramas:
 *
 * - Beat Hero (progreso 0 a 0.25): el Crystal 5 aprobado, vía HeroCrystal y la
 *   API por faceta de CrystalFiveApproved — armado, explosión radial, polvo y
 *   salida del fragmento guía (Sección 01 del plan).
 * - Dolor2 y Reveal (0.5 a 1): el Crystal V legado, exactamente con las poses,
 *   rects y aristas de siempre (poses.ts). Queda apagado durante el Hero y la
 *   Sección 02, y se funde al comenzar Dolor2; esas dos secciones migran a
 *   Crystal 5 cuando les toque, con sus propios mockups.
 *
 * Only ever rendered in "pinned" mode (see SequenceA.tsx) — pinned mode
 * already implies !reducedMotion (useNarrativeMode's contract), so there
 * is no reduced-motion branch to handle here: the static fallback tree
 * (Hero/Dolores/RevealSection) covers that case entirely on its own.
 */
export function CrystalStage({ heroSlotRef, revealSlotRef }: CrystalStageProps) {
  const { subscribe } = useNarrativeContext();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);
  const { heroRectRef, revealRectRef, freeRect } = useCrystalRects(heroSlotRef, revealSlotRef);

  /** HeroCrystal recibe el progreso LOCAL del beat Hero, ya recortado a 0..1. */
  const subscribeHero = useCallback(
    (fn: (local: number) => void) =>
      subscribe((progress) => fn(beatLocalProgress(progress, BEATS.hero.start, BEATS.hero.end))),
    [subscribe],
  );

  useEffect(() => {
    function applyFromProgress(progress: number) {
      applyPoses(facetRefs.current, interpolatePoses(progress, CRYSTAL_KEYFRAMES));
      if (edgesRef.current) {
        edgesRef.current.style.opacity = interpolateScalar(
          progress,
          EDGE_OPACITY_KEYFRAMES,
        ).toFixed(3);
      }
      if (wrapRef.current) {
        const rect = rectAtProgress(
          progress,
          heroRectRef.current,
          freeRect(),
          revealRectRef.current,
        );
        const settle = settleFactor(progress);
        const w = rect.width * settle;
        const h = rect.height * settle;
        wrapRef.current.style.top = `${(rect.top - (h - rect.height) / 2).toFixed(1)}px`;
        wrapRef.current.style.left = `${(rect.left - (w - rect.width) / 2).toFixed(1)}px`;
        wrapRef.current.style.width = `${w.toFixed(1)}px`;
        wrapRef.current.style.height = `${h.toFixed(1)}px`;
        wrapRef.current.style.opacity = legacyCrystalVisibility(progress).toFixed(3);
      }
    }

    return subscribe(applyFromProgress);
  }, [subscribe, heroRectRef, revealRectRef, freeRect]);

  return (
    <>
      <HeroCrystal subscribe={subscribeHero} />
      <div
        ref={wrapRef}
        className="hero-crystal-wrap pointer-events-none absolute"
        style={{ top: 0, left: 0, width: 200, height: 200 * CRYSTAL_ASPECT, opacity: 0 }}
      >
        <CrystalV
          variant="object"
          className="h-full w-full"
          facetRef={(el, i) => {
            facetRefs.current[i] = el;
          }}
          edgesRef={(el) => {
            edgesRef.current = el;
            if (el) el.style.opacity = "1";
          }}
        />
      </div>
    </>
  );
}
