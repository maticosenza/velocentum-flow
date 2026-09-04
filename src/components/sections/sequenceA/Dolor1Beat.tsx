import { useEffect, useRef, useState } from "react";
import { beatLocalProgress, beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";
import { ProblemaUnoComposition } from "./ProblemaUnoComposition";

/** El polvo se agota temprano: es estela del Hero, no ambiente de la sección. */
const DUST_FADE_END = 0.34;

/**
 * Sección 02 — El problema, en modo pinned.
 *
 * El fragmento guía no se pinta acá: lo pinta GuideFragmentStage, que lo mueve
 * de forma continua entre esta sección y las dos siguientes.
 */
export function Dolor1Beat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dustRef = useRef<SVGSVGElement | null>(null);
  const playedRef = useRef(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.dolor1.start, BEATS.dolor1.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);

      // La entrada de las píldoras arranca cuando la escena empieza a aparecer,
      // no al montar: si no, se pierde antes de que la sección se vea. Es UN
      // solo setState en toda la vida del beat, no uno por frame.
      if (visibility > 0 && !playedRef.current) {
        playedRef.current = true;
        setPlay(true);
      }

      const local = beatLocalProgress(progress, BEATS.dolor1.start, BEATS.dolor1.end);
      if (dustRef.current) {
        const fade = 1 - Math.min(1, local / DUST_FADE_END);
        dustRef.current.style.opacity = fade.toFixed(3);
      }
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ opacity: 0 }}>
      <ProblemaUnoComposition mode="pinned" play={play} dustRef={dustRef} />
    </div>
  );
}
