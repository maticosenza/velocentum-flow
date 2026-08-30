import { useEffect, useRef, useState } from "react";
import { CrystalV } from "@/components/brand/CrystalV";
import { CRYSTAL_V_SCATTER, scaleFacetPosition } from "@/components/brand/crystalVMotion";

// Brand open before the Hero itself plays its own assembly gesture: a
// complete Crystal V holds, fractures outward, and the overlay dissolves —
// by the time it's gone the Hero crystal underneath is already mid-assembly,
// so the two gestures read as one continuous idea (scatter, then
// reconverge) rather than two unrelated animations. Total budget ~1s, well
// under the 1-1.5s ceiling, because this must never make the nav/CTA feel
// unreachable.
const HOLD_MS = 180;
const FRACTURE_STAGGER = 14;
const FRACTURE_DURATION = 480;
const EDGES_FADE_DURATION = 200;
const FRACTURE_TOTAL = FRACTURE_STAGGER * 11 + FRACTURE_DURATION;
const OVERLAY_FADE_DELAY = HOLD_MS + FRACTURE_TOTAL;
const OVERLAY_FADE_DURATION = 260;
const DONE_AT = OVERLAY_FADE_DELAY + OVERLAY_FADE_DURATION + 40;

// Wider and slightly more rotated than the Hero/Reveal scatter — this is a
// fracture blowing pieces off-screen, not a gentle disassembly.
const FRACTURE_SCATTER = CRYSTAL_V_SCATTER.map((t) => ({
  ...scaleFacetPosition(t, 3.1),
  rotate: t.rotate * 1.6,
}));

export function CrystalIntro() {
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    timers.push(
      setTimeout(() => {
        facetRefs.current.forEach((el, i) => {
          const target = FRACTURE_SCATTER[i];
          if (!el || !target) return;
          const stagger = i * FRACTURE_STAGGER;
          el.style.transition = `transform ${FRACTURE_DURATION}ms var(--ease-in-out-firm) ${stagger}ms, opacity ${FRACTURE_DURATION}ms var(--ease-in-out-firm) ${stagger}ms`;
          el.style.transform = `translate(${target.x.toFixed(2)}px, ${target.y.toFixed(2)}px) rotate(${target.rotate.toFixed(2)}deg)`;
          el.style.opacity = "0";
        });
        if (edgesRef.current) {
          edgesRef.current.style.transition = `opacity ${EDGES_FADE_DURATION}ms var(--ease-out-soft)`;
          edgesRef.current.style.opacity = "0";
        }
      }, HOLD_MS),
    );

    timers.push(
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.style.transition = `opacity ${OVERLAY_FADE_DURATION}ms var(--ease-out-soft)`;
          overlayRef.current.style.opacity = "0";
        }
      }, OVERLAY_FADE_DELAY),
    );

    timers.push(setTimeout(() => setDone(true), DONE_AT));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-ink-deep"
    >
      <div className="w-[clamp(180px,34vw,360px)]">
        <CrystalV
          variant="object"
          className="w-full"
          facetRef={(el, i) => {
            facetRefs.current[i] = el;
          }}
          edgesRef={(el) => {
            edgesRef.current = el;
            if (el) el.style.opacity = "1";
          }}
        />
      </div>
    </div>
  );
}
