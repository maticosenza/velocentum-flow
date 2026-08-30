import { useEffect, useRef } from "react";
import { CrystalV } from "@/components/brand/CrystalV";
import {
  applyPoses,
  interpolatePoses,
  interpolateScalar,
} from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { CRYSTAL_KEYFRAMES, EDGE_OPACITY_KEYFRAMES } from "./poses";

/**
 * Sequence B's own Crystal V — a fresh instance (not shared DOM with
 * Sequence A's), but visually the same object: it starts fully assembled,
 * matching exactly the pose Sequence A's Reveal beat hands off. Fixed
 * small size/position (no measured slot like Sequence A — this crystal
 * only ever appears in one spot, briefly, at the very start of Sequence
 * B), fractures once and fades for good — see poses.ts.
 */
export function SequenceBStage() {
  const { subscribe } = useNarrativeContext();
  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    return subscribe((progress) => {
      applyPoses(facetRefs.current, interpolatePoses(progress, CRYSTAL_KEYFRAMES));
      if (edgesRef.current) {
        edgesRef.current.style.opacity = interpolateScalar(
          progress,
          EDGE_OPACITY_KEYFRAMES,
        ).toFixed(3);
      }
    });
  }, [subscribe]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center">
      <div className="hero-crystal-wrap w-[clamp(140px,16vw,200px)]">
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
