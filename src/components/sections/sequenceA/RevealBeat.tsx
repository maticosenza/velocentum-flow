import { useEffect, useRef, useState } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { objetivoPulse } from "./guideFragmentPath";
import { MismoObjetivoComposition } from "./MismoObjetivoComposition";
import { BEATS } from "./poses";

/**
 * Sección 04 — Un mismo objetivo, en modo pinned.
 *
 * No hay reconstrucción: la huella son sólo aristas y el fragmento sigue siendo
 * uno solo. La reconstrucción real está reservada para la Sección 09.
 */
export function RevealBeat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<SVGGElement | null>(null);
  const playedRef = useRef(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.reveal.start, BEATS.reveal.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);

      if (visibility > 0 && !playedRef.current) {
        playedRef.current = true;
        setPlay(true);
      }

      if (pulseRef.current) {
        const pulse = objetivoPulse(progress);
        pulseRef.current.style.opacity = pulse.toFixed(3);
        pulseRef.current.style.transform = `scale(${(0.7 + pulse * 0.8).toFixed(3)})`;
      }
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ opacity: 0 }}>
      <MismoObjetivoComposition mode="pinned" play={play} pulseRef={pulseRef} />
    </div>
  );
}
