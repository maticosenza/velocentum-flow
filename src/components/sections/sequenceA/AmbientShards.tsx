import { useEffect, useRef } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { FRAGMENTS } from "@/components/brand/fragmentGeometry";
import { BEATS } from "./poses";

// Six fragment-cluster-board shards, spread near the viewport edges — the
// "riqueza material del Fragment Cluster" the V3 correction asked to keep
// around Dolor1/Dolor2, explicitly NOT part of the 12-facet morph (see
// poses.ts): static texture/depth, never interpolated, never a member of
// CRYSTAL_KEYFRAMES. Indices picked across FRAGMENTS' four groups for
// shape variety, not sequentially.
const AMBIENT_INDICES = [1, 5, 8, 11, 13, 15];

// Fixed corners/edges (percent of viewport), well clear of the centered
// crystal field and of Dolor1/Dolor2's own text columns (left column ~
// 4-40vw, right column ~60-96vw — see Dolor1Beat/Dolor2Beat).
const PLACEMENTS = [
  { left: "6%", top: "12%", size: 70 },
  { left: "90%", top: "18%", size: 56 },
  { left: "4%", top: "82%", size: 60 },
  { left: "92%", top: "78%", size: 66 },
  { left: "10%", top: "48%", size: 44 },
  { left: "88%", top: "50%", size: 48 },
];

const FILL_BY_TREATMENT: Record<string, string> = {
  solid: "var(--pink)",
  graded: "var(--pink-soft)",
  translucent: "none",
  dark: "var(--ink-deep-2)",
};

/**
 * Ambient-only dressing for Dolor1+Dolor2's combined window — ties the two
 * beats together visually without being part of the identity system that
 * actually carries the narrative (the shared Crystal V facets).
 */
export function AmbientShards() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.dolor1.start, BEATS.dolor2.end, 0.08);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {AMBIENT_INDICES.map((idx, i) => {
        const fragment = FRAGMENTS[idx];
        const placement = PLACEMENTS[i];
        if (!fragment || !placement) return null;
        const fill = FILL_BY_TREATMENT[fragment.treatment];
        return (
          <svg
            key={idx}
            viewBox="0 0 280 240"
            style={{
              position: "absolute",
              left: placement.left,
              top: placement.top,
              width: placement.size,
              height: (placement.size * 240) / 280,
              opacity: 0.16,
              transform: "translate(-50%, -50%)",
            }}
          >
            <polygon
              points={fragment.points}
              fill={fill}
              stroke="rgba(255,255,255,.3)"
              strokeWidth={1.2}
            />
          </svg>
        );
      })}
    </div>
  );
}
