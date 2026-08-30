import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { CrystalV, CRYSTAL_V_FACET_COUNT } from "@/components/brand/CrystalV";
import { CRYSTAL_V_SCATTER, facetTransformString } from "@/components/brand/crystalVMotion";
import { useScrollRange } from "@/hooks/useScrollEngine";
import { cn } from "@/lib/utils";

const EYEBROW = "Equipo de crecimiento";
const HEADLINE_LINE_1 = "Estamos en el negocio";
const HEADLINE_LINE_2_PREFIX = "de ";
const HEADLINE_LINE_2_HIGHLIGHT = "hacer crecer negocios";
const SUBTITLE =
  "Estrategia, creatividad, pauta y medición. Primero analizamos tu negocio. Después armamos el plan.";

// Facet assembly timing — see crystalVMotion.ts for the scatter positions.
// Edges fade in only once every facet has finished converging: computed, not
// a magic constant, so it stays correct if stagger/duration/count change.
const FACET_INITIAL_DELAY = 400;
const FACET_STAGGER = 45;
const FACET_DURATION = 700;
const EDGES_FADE_DELAY =
  FACET_INITIAL_DELAY + CRYSTAL_V_FACET_COUNT * FACET_STAGGER + FACET_DURATION;
const EDGES_FADE_DURATION = 400;

const PILL_ENTRY_DELAY = 700;
const PILL_STAGGER = 90;
const PILL_EASE_OVERSHOOT = "cubic-bezier(0.34, 1.3, 0.64, 1)";

type PillVariant = "rosa" | "blanca" | "deep";
type PillLayer = "behind" | "front";
type PillSide = "left" | "right";

type PillDef = {
  label: string;
  variant: PillVariant;
  layer: PillLayer;
  top: string;
  /** Anchored from this edge — "right" avoids width-dependent viewport
   * clipping that a large `left:%` value on a narrow desktop can't. */
  side: PillSide;
  inset: string;
  finalRotate: number;
  /** % of viewport height the pill drifts up by as the hero scrolls past, 6-10. */
  parallaxPct: number;
};

// Anchored to the wrapper's own edges (side+inset), never to a `left:%` on
// the far side — that clipped hard on 1024-1366px viewports because a
// pill's own width was never part of the percentage math.
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

// Positioned in the actual empty gaps measured on a 390px viewport (above
// the eyebrow, between subtitle and Crystal V, below the CTA) rather than
// overlapping the text column — "detrás o en bordes" reads as "not visibly
// competing with the text", not just "z-index protected".
const MOBILE_PILLS: PillDef[] = [
  {
    label: "Crecimiento",
    variant: "rosa",
    layer: "behind",
    top: "-15%",
    side: "left",
    inset: "10%",
    finalRotate: -4,
    parallaxPct: 6,
  },
  {
    label: "Contenido",
    variant: "blanca",
    layer: "behind",
    top: "58%",
    side: "left",
    inset: "58%",
    finalRotate: 3,
    parallaxPct: 7,
  },
  {
    label: "Medición",
    variant: "deep",
    layer: "behind",
    top: "106%",
    side: "left",
    inset: "50%",
    finalRotate: -3,
    parallaxPct: 8,
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
  reducedMotion,
  slotRef,
}: {
  pill: PillDef;
  index: number;
  play: boolean;
  reducedMotion: boolean;
  slotRef: (el: HTMLDivElement | null) => void;
}) {
  const restTransform = `translateY(0) rotate(${pill.finalRotate}deg)`;
  const positionStyle: CSSProperties = {
    top: pill.top,
    zIndex: pill.layer === "front" ? 3 : 1,
  };
  if (pill.side === "left") positionStyle.left = pill.inset;
  else positionStyle.right = pill.inset;

  return (
    <div ref={slotRef} className="pointer-events-none absolute" style={positionStyle}>
      <span
        className={cn("hero-pill", PILL_VARIANT_CLASS[pill.variant])}
        style={{
          transform: reducedMotion ? restTransform : play ? restTransform : undefined,
          opacity: reducedMotion || play ? 1 : undefined,
          transitionDelay: reducedMotion ? "0ms" : `${PILL_ENTRY_DELAY + index * PILL_STAGGER}ms`,
          transitionDuration: reducedMotion ? "0ms" : undefined,
        }}
      >
        {pill.label}
      </span>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [play, setPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const facetRefs = useRef<Array<SVGGElement | null>>([]);
  const edgesRef = useRef<SVGGElement | null>(null);
  const pillSlotRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    const mqDesktop = window.matchMedia("(min-width: 900px)");
    setIsDesktop(mqDesktop.matches);
    const syncDesktop = () => setIsDesktop(mqDesktop.matches);
    mqDesktop.addEventListener("change", syncDesktop);

    if (reduced) {
      setPlay(true);
      return () => mqDesktop.removeEventListener("change", syncDesktop);
    }

    const id = requestAnimationFrame(() => setPlay(true));
    return () => {
      cancelAnimationFrame(id);
      mqDesktop.removeEventListener("change", syncDesktop);
    };
  }, []);

  // Gesto 1: facets converge from CRYSTAL_V_SCATTER into their assembled
  // position; edges fade in only once the last facet has landed.
  useEffect(() => {
    if (reducedMotion) {
      facetRefs.current.forEach((el) => {
        if (el) el.style.transform = "none";
      });
      if (edgesRef.current) edgesRef.current.style.opacity = "1";
      return;
    }
    if (!play) return;

    facetRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = `transform ${FACET_DURATION}ms var(--ease-out-soft) ${FACET_INITIAL_DELAY + i * FACET_STAGGER}ms`;
      el.style.transform = "translate(0px, 0px) rotate(0deg)";
    });

    if (edgesRef.current) {
      edgesRef.current.style.transition = `opacity ${EDGES_FADE_DURATION}ms var(--ease-out-soft) ${EDGES_FADE_DELAY}ms`;
      edgesRef.current.style.opacity = "1";
    }
  }, [play, reducedMotion]);

  // Set the pre-play scattered facet transforms as soon as refs exist, before
  // the effect above flips them to converged — avoids a flash of the fully
  // assembled crystal on first paint.
  useEffect(() => {
    if (reducedMotion || play) return;
    facetRefs.current.forEach((el, i) => {
      const scatter = CRYSTAL_V_SCATTER[i];
      if (el && scatter) el.style.transform = facetTransformString(scatter);
    });
  });

  const pills = isDesktop ? DESKTOP_PILLS : MOBILE_PILLS;

  useScrollRange(
    sectionRef,
    (progress) => {
      if (reducedMotion) return;
      pillSlotRefs.current.forEach((el, i) => {
        const pill = pills[i];
        if (!el || !pill) return;
        const offset = progress * window.innerHeight * (pill.parallaxPct / 100);
        el.style.transform = `translateY(${(-offset).toFixed(2)}px)`;
      });
    },
    { start: 0, end: 0 },
  );

  return (
    <section
      ref={sectionRef}
      className="hero relative flex w-full flex-col items-center justify-center overflow-hidden bg-ink-deep pt-36"
    >
      <div className="relative flex w-full max-w-[1300px] flex-col items-center px-6 text-center">
        {pills.map((pill, i) => (
          <HeroPill
            key={pill.label}
            pill={pill}
            index={i}
            play={play}
            reducedMotion={reducedMotion}
            slotRef={(el) => {
              pillSlotRefs.current[i] = el;
            }}
          />
        ))}

        <div className="relative z-[2] mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 lg:max-w-[760px] xl:max-w-[900px] md:gap-4">
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
            {HEADLINE_LINE_2_PREFIX}
            <span style={{ color: "var(--pink)" }}>{HEADLINE_LINE_2_HIGHLIGHT}</span>.
          </h1>

          <p
            className="reveal body-l w-full max-w-[52ch] text-balance text-on-dark-2"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "1300ms" }}
          >
            {SUBTITLE}
          </p>

          <div className="mx-auto mt-1 w-full max-w-[150px] md:max-w-[200px]">
            <CrystalV
              variant="object"
              className="w-full"
              facetRef={(el, i) => {
                facetRefs.current[i] = el;
              }}
              edgesRef={(el) => {
                edgesRef.current = el;
                if (el) el.style.opacity = reducedMotion ? "1" : "0";
              }}
            />
          </div>

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
    </section>
  );
}
