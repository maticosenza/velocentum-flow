import { useCallback } from "react";
import { HeroCrystal } from "@/components/hero/HeroCrystal";
import { beatLocalProgress } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { BEATS } from "./poses";

/**
 * El objeto narrativo de la Secuencia A.
 *
 * Sólo pinta el beat Hero: el Crystal 5 aprobado, vía HeroCrystal y la API por
 * faceta de CrystalFiveApproved — armado, explosión radial, polvo y salida del
 * fragmento guía (Sección 01 del plan).
 *
 * A partir de ahí no hay más Crystal completo en la secuencia. Las Secciones 02
 * y 03 tienen píldoras y el fragmento guía; la 04 tiene una huella de aristas,
 * la Mira y el mismo fragmento. El recorrido de esa pieza lo lleva
 * GuideFragmentStage, de forma continua entre las tres.
 *
 * Con eso CrystalV queda SIN CONSUMIDORES en toda la Secuencia A. El componente
 * no se borra: `sequenceB/`, `Contacto`, `Servicios` y `crystal-review` todavía
 * dependen de él.
 *
 * Se renderiza sólo en modo "pinned" (ver SequenceA.tsx), y ese modo ya implica
 * !reducedMotion por contrato de useNarrativeMode: el árbol estático
 * (Hero / Dolores / RevealSection) cubre ese caso por su cuenta.
 */
export function CrystalStage() {
  const { subscribe } = useNarrativeContext();

  /** HeroCrystal recibe el progreso LOCAL del beat Hero, ya recortado a 0..1. */
  const subscribeHero = useCallback(
    (fn: (local: number) => void) =>
      subscribe((progress) => fn(beatLocalProgress(progress, BEATS.hero.start, BEATS.hero.end))),
    [subscribe],
  );

  return <HeroCrystal subscribe={subscribeHero} />;
}
