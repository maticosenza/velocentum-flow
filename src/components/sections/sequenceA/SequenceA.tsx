import { useRef } from "react";
import { NarrativeSequence } from "@/components/narrative/NarrativeSequence";
import { Hero } from "@/components/hero/Hero";
import { Dolor1, Dolor2 } from "@/components/sections/Dolores";
import { RevealSection } from "@/components/sections/RevealSection";
import { CrystalStage } from "./CrystalStage";
import { HeroBeat } from "./HeroBeat";

// Total pin: four beats (Hero/Dolor1/Dolor2/Reveal), each a quarter of the
// shared progress — see poses.ts BEATS. The pre-scroll "Intro" isn't a
// beat of its own: it's CrystalStage's on-mount auto-play, seeding the
// exact facet elements this pin goes on to control (see CrystalStage's
// own comment for why that's the point).
//
// Dolor1/Dolor2/Reveal don't have pinned-mode beat renderers yet — that's
// V3 commits 4 and 5. Until then the shared crystal still plays through
// their pose windows on scroll (fracture -> gather -> reassemble), just
// without their headlines/decoration layered on top yet, and it re-anchors
// to Hero's own slot for those windows as a placeholder (commit 5 gives
// Reveal its own measured slot). Intentional, temporary, resolved by the
// next two commits — not a bug in this one.
export function SequenceA() {
  const heroSlotRef = useRef<HTMLDivElement | null>(null);

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
      <CrystalStage heroSlotRef={heroSlotRef} />
      <HeroBeat slotRef={heroSlotRef} />
    </NarrativeSequence>
  );
}
