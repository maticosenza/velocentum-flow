import { useEffect, useRef } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";

// Descentered crosshair — "una persona no alcanza": the reticle sits off
// to one side of the viewport, never aimed at the crystal field's own
// center. Fixed viewport position (not tied to the crystal's own
// interpolated rect) — it's commentary on the scene, not part of it.
function Target() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        right: "12%",
        bottom: "14%",
        width: 96,
        height: 96,
      }}
    >
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="none"
        stroke="var(--on-dark)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="none"
        stroke="var(--on-dark)"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <path
        d="M50 4v20M50 76v20M4 50h20M76 50h20"
        stroke="var(--on-dark)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="50" r="6" fill="var(--pink)" />
    </svg>
  );
}

/**
 * Pinned-mode Dolor1 overlay: headline only, positioned clear of the big
 * dispersed crystal field CrystalStage paints centered behind it (see
 * CrystalStage's "free" rect during this window). The fragmentation
 * itself is the shared crystal's job, not this beat's.
 */
export function Dolor1Beat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.dolor1.start, BEATS.dolor1.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <Target />
      <div className="container-v absolute inset-0 flex items-center">
        <div className="max-w-[560px] text-left">
          <span className="eyebrow text-on-dark-2">El problema</span>
          <h2 className="display-l dolor-headline mt-4 text-on-dark">
            Una sola persona no puede cargar
            <br />
            todo el crecimiento de un negocio.
          </h2>
        </div>
      </div>
    </div>
  );
}
