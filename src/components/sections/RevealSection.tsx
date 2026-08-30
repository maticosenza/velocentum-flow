import { useEffect, useRef, useState } from "react";
import { CrystalV } from "@/components/brand/CrystalV";
import { CRYSTAL_V_SCATTER, scaleFacetPosition, mix } from "@/components/brand/crystalVMotion";
import { useScrollRange } from "@/hooks/useScrollEngine";

// Reveal's dispersed state is close to the Hero's own scatter (~1x, not the
// 1.6x this had before) — that amplification read as pieces flying way out
// rather than a V that's merely still disassembled. Mobile gets a further
// reduction: the same absolute px offsets read as relatively more dispersed
// against a visually smaller (190px) crystal than a desktop 275px one.
const DESKTOP_SCATTER = CRYSTAL_V_SCATTER.map((t) => scaleFacetPosition(t, 1));
const MOBILE_SCATTER = CRYSTAL_V_SCATTER.map((t) => scaleFacetPosition(t, 0.65));

export function RevealSection() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);
  const crystalWrapRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const scatter = isDesktop ? DESKTOP_SCATTER : MOBILE_SCATTER;

  function applyProgress(progress: number) {
    // 0 -> 0.65: each facet interpolates directly (no lerp) from its Reveal
    // scatter position to assembled (identity) — must stay perfectly
    // reversible on scroll-up, which direct progress-based interpolation
    // guarantees and a smoothed/lerped value would not.
    const assembleT = Math.min(Math.max(progress / 0.65, 0), 1);
    facetRefs.current.forEach((el, i) => {
      const facetScatter = scatter[i];
      if (!el || !facetScatter) return;
      const x = mix(facetScatter.x, 0, assembleT);
      const y = mix(facetScatter.y, 0, assembleT);
      const rotate = mix(facetScatter.rotate, 0, assembleT);
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;
    });

    // 0.65 -> 0.85: edges fade in.
    if (edgesRef.current) {
      const edgeT = Math.min(Math.max((progress - 0.65) / 0.2, 0), 1);
      edgesRef.current.style.opacity = edgeT.toFixed(3);
    }

    // 0.85 -> 1: settle, scale(1.02) -> scale(1).
    if (crystalWrapRef.current) {
      const settleT = Math.min(Math.max((progress - 0.85) / 0.15, 0), 1);
      const scale = progress < 0.85 ? 1 : mix(1.02, 1, settleT);
      crystalWrapRef.current.style.transform = `scale(${scale.toFixed(4)})`;
    }
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    const mqDesktop = window.matchMedia("(min-width: 900px)");
    setIsDesktop(mqDesktop.matches);
    const syncDesktop = () => setIsDesktop(mqDesktop.matches);
    mqDesktop.addEventListener("change", syncDesktop);

    if (reduced) {
      facetRefs.current.forEach((el) => {
        if (el) el.style.transform = "none";
      });
      if (edgesRef.current) edgesRef.current.style.opacity = "1";
      if (crystalWrapRef.current) crystalWrapRef.current.style.transform = "scale(1)";
    } else {
      applyProgress(0);
    }

    return () => mqDesktop.removeEventListener("change", syncDesktop);
  }, []);

  // start:0.8/end:0.75 (vs. the sticky-pin-exact 0/0), on purpose: the
  // assembly should already be underway while the section is still entering
  // from below, not wait until its top has reached the viewport top. See
  // useScrollEngine's range math — a larger `start` pulls progress=0 earlier
  // (section mostly below the fold). `end` needs to stay large (close to
  // `start`) here specifically because the sticky pin window is short
  // (outer 150svh - sticky 100svh = only 50svh of actual pinned scroll): a
  // small `end` (the more typical choice) pushes progress=1 far past the
  // point where the pin releases, so the 0.85->1 settle finishes after the
  // section has already scrolled out from under the nav — verified via
  // getBoundingClientRect against Trabajos becoming visible underneath.
  useScrollRange(
    outerRef,
    (progress) => {
      if (reducedMotion) return;
      applyProgress(progress);
    },
    { start: 0.8, end: 0.75 },
  );

  return (
    <div ref={outerRef} className="reveal-outer bg-ink-deep">
      <div className="reveal-sticky">
        <div className="container-v flex flex-col items-center text-center">
          <h2 className="display-l mx-auto max-w-[28ch] text-on-dark">
            El crecimiento aparece cuando cada parte
            <br />
            trabaja sobre el mismo objetivo.
          </h2>

          <div ref={crystalWrapRef} className="mx-auto mt-8 w-full max-w-[190px] md:max-w-[275px]">
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
      </div>
    </div>
  );
}
