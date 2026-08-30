import { useEffect, useRef, type RefObject } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";

type RevealBeatProps = {
  /** Real layout participant CrystalStage measures for this beat's own anchor — see CrystalStage/HeroBeat for the same pattern. */
  slotRef: RefObject<HTMLDivElement | null>;
};

/**
 * Pinned-mode Reveal overlay — the sequence's payoff. Same headline as the
 * pre-V3 RevealSection; the assembly gesture itself is CrystalStage's
 * doing (facets reassembling from Dolor2's GATHER_LOOSE across this whole
 * window, edges fading back in only right at the end — see poses.ts).
 */
export function RevealBeat({ slotRef }: RevealBeatProps) {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.reveal.start, BEATS.reveal.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);
    });
  }, [subscribe]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <h2 className="display-l mx-auto max-w-[28ch] text-on-dark">
        El crecimiento aparece cuando cada parte
        <br />
        trabaja sobre el mismo objetivo.
      </h2>

      {/* Empty on purpose — CrystalStage paints the actual crystal here, measuring this div's real rect. */}
      <div
        ref={slotRef}
        className="mx-auto mt-8 w-full max-w-[275px]"
        style={{ aspectRatio: "220 / 180" }}
        aria-hidden="true"
      />
    </div>
  );
}
