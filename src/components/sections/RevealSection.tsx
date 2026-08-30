import { useEffect, useRef, useState } from "react";
import { CrystalV } from "@/components/brand/CrystalV";
import { CRYSTAL_V_SCATTER, scaleFacetPosition, mix } from "@/components/brand/crystalVMotion";
import { useScrollRange } from "@/hooks/useScrollEngine";

// Reveal's dispersed state is the Hero's own scatter, amplified ~1.6x on
// position (rotation stays as-is) — the Plan Maestro is explicit that this
// is the same base, just wider, not an independently invented arrangement.
const REVEAL_SCATTER = CRYSTAL_V_SCATTER.map((t) => scaleFacetPosition(t, 1.6));

export function RevealSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);
  const crystalWrapRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  function applyProgress(progress: number) {
    // 0 -> 0.7: each facet interpolates directly (no lerp) from its Reveal
    // scatter position to assembled (identity) — must stay perfectly
    // reversible on scroll-up, which direct progress-based interpolation
    // guarantees and a smoothed/lerped value would not.
    const assembleT = Math.min(Math.max(progress / 0.7, 0), 1);
    facetRefs.current.forEach((el, i) => {
      const scatter = REVEAL_SCATTER[i];
      if (!el || !scatter) return;
      const x = mix(scatter.x, 0, assembleT);
      const y = mix(scatter.y, 0, assembleT);
      const rotate = mix(scatter.rotate, 0, assembleT);
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;
    });

    // 0.7 -> 0.9: edges fade in.
    if (edgesRef.current) {
      const edgeT = Math.min(Math.max((progress - 0.7) / 0.2, 0), 1);
      edgesRef.current.style.opacity = edgeT.toFixed(3);
    }

    // 0.9 -> 1: settle, scale(1.02) -> scale(1).
    if (crystalWrapRef.current) {
      const settleT = Math.min(Math.max((progress - 0.9) / 0.1, 0), 1);
      const scale = progress < 0.9 ? 1 : mix(1.02, 1, settleT);
      crystalWrapRef.current.style.transform = `scale(${scale.toFixed(4)})`;
    }
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    if (reduced) {
      facetRefs.current.forEach((el) => {
        if (el) el.style.transform = "none";
      });
      if (edgesRef.current) edgesRef.current.style.opacity = "1";
      if (crystalWrapRef.current) crystalWrapRef.current.style.transform = "scale(1)";
    } else {
      applyProgress(0);
    }
  }, []);

  useScrollRange(
    sectionRef,
    (progress) => {
      if (reducedMotion) return;
      applyProgress(progress);
    },
    { start: 0, end: 0 },
  );

  return (
    <section ref={sectionRef} className="reveal-section bg-ink-deep">
      <div className="container-v flex flex-col items-center text-center">
        <h2 className="display-l mx-auto max-w-[28ch] text-on-dark">
          El crecimiento aparece cuando cada parte
          <br />
          trabaja sobre el mismo objetivo.
        </h2>

        <div ref={crystalWrapRef} className="mx-auto mt-10 w-full max-w-[200px] md:max-w-[320px]">
          <CrystalV
            variant="object"
            className="w-full"
            facetRef={(el, i) => {
              facetRefs.current[i] = el;
            }}
            edgesRef={(el) => {
              edgesRef.current = el;
              if (el) el.style.opacity = "0";
            }}
          />
        </div>
      </div>
    </section>
  );
}
