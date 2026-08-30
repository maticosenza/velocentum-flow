import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { beatLocalProgress, beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { cn } from "@/lib/utils";
import { BEATS } from "./poses";

// Copy/pills identical to the pre-V3 Hero (src/components/hero/Hero.tsx,
// kept unmodified as the static/reduced-motion fallback) — only the
// crystal itself moved out to CrystalStage, shared across the whole
// sequence, and pill parallax now reads this beat's own local progress
// instead of the page-wide scroll range a standalone Hero section used to
// own.
const EYEBROW = "Equipo de crecimiento";
const HEADLINE_LINE_1 = "Estamos en el negocio de";
const HEADLINE_LINE_2_HIGHLIGHT = "hacer crecer negocios";
const SUBTITLE =
  "Estrategia, creatividad, adquisición y medición. Primero analizamos tu negocio. Después armamos el plan.";

const PILL_ENTRY_DELAY = 700;
const PILL_STAGGER = 90;

type PillVariant = "rosa" | "blanca" | "deep";
type PillLayer = "behind" | "front";
type PillSide = "left" | "right";

type PillDef = {
  label: string;
  variant: PillVariant;
  layer: PillLayer;
  top: string;
  side: PillSide;
  inset: string;
  finalRotate: number;
  parallaxPct: number;
};

const DESKTOP_PILLS: PillDef[] = [
  {
    label: "Crecimiento",
    variant: "rosa",
    layer: "behind",
    top: "6%",
    side: "left",
    inset: "2%",
    finalRotate: -4,
    parallaxPct: 7,
  },
  {
    label: "Estrategia",
    variant: "deep",
    layer: "behind",
    top: "8%",
    side: "right",
    inset: "2%",
    finalRotate: 5,
    parallaxPct: 9,
  },
  {
    label: "Contenido",
    variant: "blanca",
    layer: "front",
    top: "38%",
    side: "left",
    inset: "0.5%",
    finalRotate: 3,
    parallaxPct: 6,
  },
  {
    label: "Marca",
    variant: "rosa",
    layer: "front",
    top: "40%",
    side: "right",
    inset: "0.5%",
    finalRotate: -6,
    parallaxPct: 10,
  },
  {
    label: "Web",
    variant: "deep",
    layer: "front",
    top: "68%",
    side: "left",
    inset: "3%",
    finalRotate: 6,
    parallaxPct: 8,
  },
  {
    label: "Medición",
    variant: "blanca",
    layer: "front",
    top: "70%",
    side: "right",
    inset: "3%",
    finalRotate: -3,
    parallaxPct: 7,
  },
];

const PILL_VARIANT_CLASS: Record<PillVariant, string> = {
  rosa: "hero-pill-rosa",
  blanca: "hero-pill-blanca",
  deep: "hero-pill-deep",
};

function HeroPill({
  pill,
  index,
  play,
  slotRef,
}: {
  pill: PillDef;
  index: number;
  play: boolean;
  slotRef: (el: HTMLDivElement | null) => void;
}) {
  const restTransform = `translateY(0) rotate(${pill.finalRotate}deg)`;
  const positionStyle: CSSProperties = { top: pill.top, zIndex: pill.layer === "front" ? 3 : 1 };
  const inset = `max(${pill.inset}, 16px)`;
  if (pill.side === "left") positionStyle.left = inset;
  else positionStyle.right = inset;

  return (
    <div ref={slotRef} className="pointer-events-none absolute" style={positionStyle}>
      <span
        className={cn("hero-pill", PILL_VARIANT_CLASS[pill.variant])}
        style={{
          transform: play ? restTransform : undefined,
          opacity: play ? 1 : undefined,
          transitionDelay: `${PILL_ENTRY_DELAY + index * PILL_STAGGER}ms`,
        }}
      >
        {pill.label}
      </span>
    </div>
  );
}

/**
 * Pinned-mode Hero overlay — text/pills/CTA only, no crystal (see
 * CrystalStage). Visible for the whole sequence at page-load (progress 0
 * sits inside the Hero window) and fades out as scroll carries the shared
 * crystal into Dolor1.
 */
type HeroBeatProps = {
  /** Real layout participant that CrystalStage measures to know exactly where "Hero's crystal" belongs — see CrystalStage's own comment on why this replaced independently-centered overlays. */
  slotRef: RefObject<HTMLDivElement | null>;
};

export function HeroBeat({ slotRef }: HeroBeatProps) {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pillSlotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.hero.start, BEATS.hero.end);
      if (rootRef.current) {
        rootRef.current.style.opacity = visibility.toFixed(3);
        rootRef.current.style.pointerEvents = visibility > 0.5 ? "auto" : "none";
      }
      const local = beatLocalProgress(progress, BEATS.hero.start, BEATS.hero.end);
      pillSlotRefs.current.forEach((el, i) => {
        const pill = DESKTOP_PILLS[i];
        if (!el || !pill) return;
        const offset = local * window.innerHeight * (pill.parallaxPct / 100);
        el.style.transform = `translateY(${(-offset).toFixed(2)}px)`;
      });
    });
  }, [subscribe]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 flex w-full flex-col items-center justify-center overflow-hidden pt-36"
    >
      <div className="relative flex w-full max-w-[1300px] flex-col items-center px-6 text-center">
        {DESKTOP_PILLS.map((pill, i) => (
          <HeroPill
            key={pill.label}
            pill={pill}
            index={i}
            play={play}
            slotRef={(el) => {
              pillSlotRefs.current[i] = el;
            }}
          />
        ))}

        <div className="relative z-[2] mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 md:gap-4 lg:max-w-[760px] xl:max-w-[960px] 2xl:max-w-[1040px]">
          <span
            className="reveal eyebrow w-full text-on-dark-2"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "700ms" }}
          >
            {EYEBROW}
          </span>

          <h1
            className="reveal display-xl hero-headline w-full text-on-dark"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "900ms" }}
          >
            {HEADLINE_LINE_1}
            <br />
            <span style={{ color: "var(--pink)" }}>{HEADLINE_LINE_2_HIGHLIGHT}</span>.
          </h1>

          <p
            className="reveal body-l w-full max-w-[52ch] text-balance text-on-dark-2"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "1300ms" }}
          >
            {SUBTITLE}
          </p>

          {/* Empty on purpose — CrystalStage paints the actual crystal, measuring this div's real rendered rect (see CrystalStage) so it lands exactly here instead of guessing a fixed height. */}
          <div
            ref={slotRef}
            className="mt-2 w-full max-w-[260px]"
            style={{ aspectRatio: "220 / 180" }}
            aria-hidden="true"
          />

          <Link
            to="/"
            hash="contacto"
            className="hero-cta reveal body-base inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 font-medium text-ink"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "1450ms" }}
          >
            Reservá tu análisis de negocio
            <span className="hero-cta-arrow" style={{ color: "var(--ink)" }} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
