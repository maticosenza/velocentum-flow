import { NarrativeSequence } from "@/components/narrative/NarrativeSequence";
import { Motores } from "@/components/sections/Motores";
import { Servicios } from "@/components/sections/Servicios";
import { SequenceBStage } from "./SequenceBStage";
import { MotoresBeat } from "./MotoresBeat";
import { ServiciosBeat } from "./ServiciosBeat";

// Two beats (Motores/Servicios), each half the pin — see poses.ts BEATS.
// Reveal isn't a beat of its own here: the continuity with Sequence A is
// SequenceBStage's crystal starting already assembled (matching exactly
// where Sequence A's Reveal beat ends), not a shared DOM/pin — two
// separate sequences, one visual throughline. Motores is a first-class
// beat of this sequence (not a standalone section afterward): the four
// motor objects crossfade in as SequenceBStage's crystal fractures and
// fades, then crossfade out as Servicios' six crossfade in.
export function SequenceB() {
  return (
    <NarrativeSequence
      beatCount={2}
      className="bg-ink-deep"
      staticFallback={
        <>
          <Motores />
          <Servicios />
        </>
      }
    >
      <SequenceBStage />
      <MotoresBeat />
      <ServiciosBeat />
    </NarrativeSequence>
  );
}
