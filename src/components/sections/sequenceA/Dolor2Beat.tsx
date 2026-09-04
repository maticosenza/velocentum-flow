import { useEffect, useRef, useState } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { guideProximityFlash } from "./guideFragmentPath";
import { BEATS } from "./poses";
import { PROBLEMA_DOS_BROKEN_LINK } from "./problemaDosContent";
import { ProblemaDosComposition } from "./ProblemaDosComposition";

/** Alcance del destello, en unidades del lienzo. */
const FLASH_REACH = 240;

/**
 * Sección 03 — El otro problema, en modo pinned.
 *
 * El destello del extremo de la conexión incompleta no ocurre a un progreso
 * fijo: se deriva de la distancia real del fragmento a ese punto, así que sigue
 * cayendo "al pasar cerca" aunque cambie la trayectoria.
 */
export function Dolor2Beat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<SVGGElement | null>(null);
  const playedRef = useRef(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.dolor2.start, BEATS.dolor2.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);

      if (visibility > 0 && !playedRef.current) {
        playedRef.current = true;
        setPlay(true);
      }

      if (flashRef.current) {
        const flash = guideProximityFlash(progress, PROBLEMA_DOS_BROKEN_LINK.to, FLASH_REACH);
        flashRef.current.style.opacity = flash.toFixed(3);
        flashRef.current.style.transform = `scale(${(0.6 + flash * 0.7).toFixed(3)})`;
      }
    });
  }, [subscribe]);

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ opacity: 0 }}>
      <ProblemaDosComposition mode="pinned" play={play} flashRef={flashRef} />
    </div>
  );
}
