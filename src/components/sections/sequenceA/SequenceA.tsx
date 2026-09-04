import { NarrativeSequence } from "@/components/narrative/NarrativeSequence";
import { Hero } from "@/components/hero/Hero";
import { Dolor1, Dolor2 } from "@/components/sections/Dolores";
import { RevealSection } from "@/components/sections/RevealSection";
import { CrystalStage } from "./CrystalStage";
import { HeroBeat } from "./HeroBeat";
import { Dolor1Beat } from "./Dolor1Beat";
import { Dolor2Beat } from "./Dolor2Beat";
import { RevealBeat } from "./RevealBeat";
import { GuideFragmentStage } from "./GuideFragmentStage";

// Pin total: cuatro beats (Hero / El problema / El otro problema / Un mismo
// objetivo), cada uno un cuarto del progreso compartido — ver BEATS en poses.ts.
//
// AmbientShards se retiró: las Secciones 02 y 03 aprobadas son explícitas en que
// no hay lluvia ni grupos de fragmentos. El único fragmento que recorre la
// secuencia es el guía (GuideFragmentStage), continuo entre las Secciones 02, 03
// y 04.
export function SequenceA() {
  return (
    <NarrativeSequence
      beatCount={4}
      className="bg-ink-deep"
      staticFallback={
        <>
          <Hero />
          <Dolor1 />
          <Dolor2 />
          <RevealSection />
        </>
      }
    >
      <CrystalStage />
      <GuideFragmentStage />
      <HeroBeat />
      <Dolor1Beat />
      <Dolor2Beat />
      <RevealBeat />
    </NarrativeSequence>
  );
}
