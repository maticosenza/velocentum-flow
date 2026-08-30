import { useEffect, useRef } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";

/**
 * Pinned-mode Dolor2 overlay: headline only, mirrored to the right side of
 * the viewport (Dolor1's sat left) — a small, deliberate composition shift
 * so the two beats don't read as the same template repeated, even though
 * both are just "headline beside the shared crystal field".
 */
export function Dolor2Beat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.dolor2.start, BEATS.dolor2.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="container-v absolute inset-0 flex items-center justify-end">
        <div className="max-w-[560px] text-left">
          <span className="eyebrow text-on-dark-2">El otro problema</span>
          <h2 className="display-l dolor-headline mt-4 text-on-dark">
            Y muchos proveedores sueltos
            <br />
            tampoco forman un equipo.
          </h2>
        </div>
      </div>
    </div>
  );
}
