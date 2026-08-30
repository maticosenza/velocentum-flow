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
import { AmbientShards } from "./AmbientShards";

// Total pin: four beats (Hero/Dolor1/Dolor2/Reveal), each a quarter of the
// shared progress — see poses.ts BEATS. The pre-scroll "Intro" isn't a
// beat of its own: it's CrystalStage's on-mount auto-play, seeding the
// exact facet elements this pin goes on to control (see CrystalStage's
// own comment for why that's the point). All four beats now have their
// pinned-mode renderer — Sequence A is complete.
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
      <AmbientShards />
      <HeroBeat slotRef={heroSlotRef} />
      <Dolor1Beat />
      <Dolor2Beat />
      <RevealBeat slotRef={revealSlotRef} />
    </NarrativeSequence>
  );
}
