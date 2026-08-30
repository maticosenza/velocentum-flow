import { useEffect, useRef, useState, type RefObject } from "react";
import { CrystalV, CRYSTAL_V_FACET_COUNT } from "@/components/brand/CrystalV";
import {
  applyPoses,
  interpolatePoses,
  interpolateScalar,
  poseTransform,
} from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { ASSEMBLED, CRYSTAL_KEYFRAMES, EDGE_OPACITY_KEYFRAMES, SCATTER_NARROW } from "./poses";

// Wider/more violent than any scroll-driven pose (3.1x position, 1.6x
// rotation on top of Hero's own disassembly) — this is a fracture, not a
// disassembly. Same values the pre-V3 CrystalIntro used.
const INTRO_FRACTURE = SCATTER_NARROW.map((p) => ({
  ...p,
  x: p.x * 3.1,
  y: p.y * 3.1,
  rotate: p.rotate * 1.6,
}));

const INTRO_HOLD_MS = 150;
const INTRO_STAGGER_MS = 14;
const INTRO_OUT_MS = 480;
const INTRO_BACK_MS = 520;
const INTRO_OUT_SPAN = INTRO_STAGGER_MS * (CRYSTAL_V_FACET_COUNT - 1) + INTRO_OUT_MS;
const INTRO_TOTAL_MS = INTRO_HOLD_MS + INTRO_OUT_SPAN + INTRO_BACK_MS + 80;

const CRYSTAL_ASPECT = 180 / 220; // CrystalV's own viewBox height/width

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
 * The single Crystal V shared by every beat of Sequence A. Mounted once,
 * its twelve facet <g> refs are the same DOM nodes from the moment the
 * page loads (auto-play intro) through Hero, Dolor1, Dolor2 and Reveal —
 * this is the literal implementation of "identidad persistente de
 * shards", not twelve elements re-created per section.
 *
 * Only ever rendered in "pinned" mode (see SequenceA.tsx) — pinned mode
 * already implies !reducedMotion (useNarrativeMode's contract), so there
 * is no reduced-motion branch to handle here: the static fallback tree
 * (pre-V3 Hero/Dolores/RevealSection) covers that case entirely on its
 * own, with its own already-reduced-motion-safe components.
 */
export function CrystalStage({ heroSlotRef, revealSlotRef }: CrystalStageProps) {
  const { subscribe } = useNarrativeContext();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const lastProgressRef = useRef(0);
  const { heroRectRef, revealRectRef, freeRect } = useCrystalRects(heroSlotRef, revealSlotRef);

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    timers.push(
      setTimeout(() => {
        facetRefs.current.forEach((el, i) => {
          const target = INTRO_FRACTURE[i];
          if (!el || !target) return;
          const stagger = i * INTRO_STAGGER_MS;
          el.style.transition = `transform ${INTRO_OUT_MS}ms var(--ease-in-out-firm) ${stagger}ms`;
          el.style.transform = poseTransform(target);
        });
      }, INTRO_HOLD_MS),
    );

    timers.push(
      setTimeout(() => {
        facetRefs.current.forEach((el, i) => {
          const target = ASSEMBLED[i];
          if (!el || !target) return;
          const stagger = i * INTRO_STAGGER_MS * 0.6;
          el.style.transition = `transform ${INTRO_BACK_MS}ms var(--ease-out-soft) ${stagger}ms`;
          el.style.transform = poseTransform(target);
        });
      }, INTRO_HOLD_MS + INTRO_OUT_SPAN),
    );

    timers.push(
      setTimeout(() => {
        facetRefs.current.forEach((el) => {
          if (el) el.style.transition = "";
        });
        setIntroDone(true);
      }, INTRO_TOTAL_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

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
      }
    }

    if (!introDone) return;
    // Once the auto-play hands off, immediately catch up to wherever
    // scroll already is (handles the edge case of scrolling during the
    // ~1.1s intro) instead of waiting for the next scroll event.
    applyFromProgress(lastProgressRef.current);
    return subscribe((progress) => {
      lastProgressRef.current = progress;
      applyFromProgress(progress);
    });
  }, [introDone, subscribe, heroRectRef, revealRectRef, freeRect]);

  return (
    <div
      ref={wrapRef}
      className="hero-crystal-wrap pointer-events-none absolute"
      style={{ top: 0, left: 0, width: 200, height: 200 * CRYSTAL_ASPECT }}
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
  );
}
