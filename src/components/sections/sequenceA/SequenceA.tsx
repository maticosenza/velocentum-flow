import { useRef } from "react";
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

// Total pin: four beats (Hero/Dolor1/Dolor2/Reveal), each a quarter of the
// shared progress — see poses.ts BEATS.
//
// AmbientShards se retiró: la Sección 02 aprobada es explícita en que no hay
// lluvia ni grupos de fragmentos, y la 03 tampoco los tiene. El único fragmento
// que recorre la secuencia es el guía (GuideFragmentStage).
export function SequenceA() {
  const heroSlotRef = useRef<HTMLDivElement | null>(null);
  const revealSlotRef = useRef<HTMLDivElement | null>(null);

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
      <CrystalStage heroSlotRef={heroSlotRef} revealSlotRef={revealSlotRef} />
      <GuideFragmentStage />
      <HeroBeat slotRef={heroSlotRef} />
      <Dolor1Beat />
      <Dolor2Beat />
      <RevealBeat slotRef={revealSlotRef} />
    </NarrativeSequence>
  );
}
