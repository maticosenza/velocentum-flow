import { useEffect, useRef, useState } from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";

// First Trabajos item — duplicated here rather than imported (TRABAJOS/
// posterUrl aren't exported from Trabajos.tsx) so this handoff stays a
// standalone, low-risk seam between two independent sections rather than
// a coupling point either has to keep in sync for unrelated reasons.
const FIRST_PLAYBACK_ID = "8OWtx2015Wnb4lVUrdUTcmlOut012eF01Ow6101SvCFCpp00";
const FIRST_POSTER = `https://image.mux.com/${FIRST_PLAYBACK_ID}/thumbnail.webp?width=500&fit_mode=smartcrop&time=1`;

/**
 * Short object-to-object handoff between Servicios and Trabajos — NOT a
 * third NarrativeSequence (see the V3 map's explicit instruction): no
 * pin, no sticky, just a normal-flow ~70vh block whose own scroll-range
 * progress drives a surface growing into the first video. Trabajos itself
 * starts immediately after, back to ordinary scroll.
 */
export function ServiciosToTrabajosHandoff() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced) {
      if (surfaceRef.current) surfaceRef.current.style.transform = "scale(1)";
      if (posterRef.current) posterRef.current.style.opacity = "1";
    }
  }, []);

  useScrollRange(
    wrapRef,
    (progress) => {
      if (reducedMotion) return;
      if (surfaceRef.current) {
        const scale = 0.4 + progress * 0.6;
        surfaceRef.current.style.transform = `scale(${scale.toFixed(3)})`;
      }
      if (posterRef.current) {
        const fadeIn = Math.min(Math.max((progress - 0.55) / 0.35, 0), 1);
        posterRef.current.style.opacity = fadeIn.toFixed(3);
      }
    },
    { start: 0.75, end: 0.25 },
  );

  return (
    <div ref={wrapRef} className="relative flex h-[70vh] items-center justify-center bg-ink-deep">
      <div
        ref={surfaceRef}
        className="relative overflow-hidden rounded-[20px] border"
        style={{
          width: 220,
          aspectRatio: "9 / 16",
          borderColor: "rgba(255,75,141,.22)",
          backgroundColor: "var(--ink-deep-2)",
          willChange: "transform",
        }}
      >
        <img
          ref={posterRef}
          src={FIRST_POSTER}
          alt=""
          aria-hidden="true"
          width={400}
          height={711}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
