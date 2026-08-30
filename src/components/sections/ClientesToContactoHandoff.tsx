import { useEffect, useRef, useState } from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";
import { FRAGMENTS } from "@/components/brand/fragmentGeometry";

// Four shards, reused verbatim from the fragment-cluster vocabulary
// (Dolor1/Dolor2/AmbientShards) — "vuelven las facetas" at the exact exit
// of Clientes, the same material the whole page has been speaking since
// the intro, not a new one invented for this seam.
const RETURN_INDICES = [2, 6, 9, 12];
const PLACEMENTS = [
  { left: "18%", top: "30%", size: 88 },
  { left: "82%", top: "24%", size: 72 },
  { left: "24%", top: "72%", size: 68 },
  { left: "78%", top: "76%", size: 80 },
];

/**
 * Short, non-pinned light->dark handoff between Clientes and Contacto —
 * NOT a third NarrativeSequence (see the V3 map's explicit instruction).
 * Base background is light (matches Clientes' own --surface, no visible
 * seam on entry); a full-bleed dark overlay fades in via opacity only
 * (never background-color — see useScrollEngine's transform/opacity-only
 * rule) so the light->dark wipe is a single cheap compositor animation,
 * with a few returning shards fading in once the dark has mostly taken
 * over. By the time this block ends, the page is fully dark and Contacto
 * (unchanged) continues straight into its own crystal-settle sequence.
 */
export function ClientesToContactoHandoff() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const shardsRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced) {
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
      if (shardsRef.current) shardsRef.current.style.opacity = "1";
    }
  }, []);

  useScrollRange(
    wrapRef,
    (progress) => {
      if (reducedMotion) return;
      if (overlayRef.current) overlayRef.current.style.opacity = progress.toFixed(3);
      if (shardsRef.current) {
        const shardsIn = Math.min(Math.max((progress - 0.45) / 0.4, 0), 1);
        shardsRef.current.style.opacity = shardsIn.toFixed(3);
      }
    },
    { start: 0.85, end: 0.15 },
  );

  return (
    <div
      ref={wrapRef}
      className="relative h-[60vh] overflow-hidden"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ink-deep"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      <div ref={shardsRef} className="absolute inset-0" style={{ opacity: 0 }} aria-hidden="true">
        {RETURN_INDICES.map((idx, i) => {
          const fragment = FRAGMENTS[idx];
          const placement = PLACEMENTS[i];
          if (!fragment || !placement) return null;
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
                transform: "translate(-50%, -50%)",
              }}
            >
              <polygon
                points={fragment.points}
                fill="var(--pink)"
                fillOpacity={0.5}
                stroke="rgba(255,255,255,.3)"
                strokeWidth={1.2}
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
}
