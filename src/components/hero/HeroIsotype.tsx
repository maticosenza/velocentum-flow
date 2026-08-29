import { useEffect, useRef, type RefObject } from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";

type Cota = {
  id: string;
  text: string;
  delay: number;
  style: React.CSSProperties;
};

const COTAS: Cota[] = [
  {
    id: "code",
    text: "VLC—01",
    delay: 850,
    style: { left: "0%", top: "0%", transform: "translate(0, -150%)" },
  },
  {
    id: "top",
    text: "84.0",
    delay: 910,
    style: { left: "50%", top: "0%", transform: "translate(-50%, -160%)" },
  },
];

// Vectorized from the original logo (95% match). Single continuous
// contour: the inner V is an open notch cut into the left arm from the
// top edge, not a closed hole — split down the shared edge between
// (49.8, 58) and (49.8, 87.6) into the two halves that assemble on load.
const LEFT_HALF =
  "M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 Z";
// Right half's shared edge is nudged 0.15 units past x=49.8 so the two
// fills overlap slightly at rest instead of leaving a hairline gap from
// anti-aliasing between two adjacent (not unioned) shapes.
const RIGHT_HALF = "M 49.65 58 L 82.9 0 L 100 0 L 49.65 87.6 Z";

type HeroIsotypeProps = {
  sectionRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
};

export function HeroIsotype({ sectionRef, reducedMotion }: HeroIsotypeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const leftGroupRef = useRef<SVGGElement | null>(null);
  const rightGroupRef = useRef<SVGGElement | null>(null);
  const cotasRef = useRef<HTMLDivElement | null>(null);

  // Real per-element trace length instead of a fixed generous dasharray:
  // short strokes are only a few units long, so a fixed dasharray kept
  // them entirely inside the initial gap until the very end of the
  // transition, making them pop in instead of drawing.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const traces = svg.querySelectorAll<SVGGeometryElement>(".hero-trace");
    traces.forEach((el) => {
      const length = el.getTotalLength();
      el.style.setProperty("--trace-len", String(length));
    });
  }, []);

  useScrollRange(
    sectionRef,
    (progress) => {
      if (reducedMotion) return;

      // The two halves pull apart again on scroll, proportional to
      // progress, capping at 6 units of separation — the assembly gesture
      // reads going down the page too, not just on load.
      const offset = progress * 6;
      const left = leftGroupRef.current;
      if (left) left.setAttribute("transform", `translate(${-offset} 0)`);
      const right = rightGroupRef.current;
      if (right) right.setAttribute("transform", `translate(${offset} 0)`);

      const cotas = cotasRef.current;
      if (cotas) {
        cotas.style.opacity = String(Math.max(0, 1 - progress / 0.3));
      }
    },
    // The hero sits at the very top of the document, already fully in view
    // at scrollY 0 — the default range assumes an element scrolling up into
    // view from below the fold, which would start this progress at ~0.5
    // instead of 0. start:0 makes progress 0 at rest and 1 once the section
    // has scrolled a full viewport height past the top.
    { start: 0, end: 0 },
  );

  return (
    <div className="relative aspect-[100/87.6] w-full" style={{ containerType: "inline-size" }}>
      <div className="hero-halo" aria-hidden="true" />
      <div className="hero-grid-bg" aria-hidden="true" />

      <svg
        ref={svgRef}
        viewBox="0 0 100 87.6"
        className="relative h-full w-full"
        role="img"
        aria-label="Isotipo de Velocentum ensamblándose desde sus dos mitades"
      >
        <defs>
          <linearGradient
            id="heroIsotypeFill"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="100"
            y2="87.6"
          >
            <stop offset="0%" stopColor="#F7F7FB" />
            <stop offset="55%" stopColor="#7B5CFF" />
            <stop offset="100%" stopColor="#2A1EC9" />
          </linearGradient>
        </defs>

        <g className="hero-construction-lines" aria-hidden="true">
          <line
            className="hero-trace"
            x1={-4}
            y1={0}
            x2={104}
            y2={0}
            style={{ transitionDelay: "200ms", transitionDuration: "300ms" }}
          />
          <line
            className="hero-trace"
            x1={49.8}
            y1={-6}
            x2={49.8}
            y2={94}
            style={{ transitionDelay: "200ms", transitionDuration: "300ms" }}
          />
          <line
            className="hero-trace"
            x1={0}
            y1={0}
            x2={49.8}
            y2={87.6}
            style={{ transitionDelay: "350ms", transitionDuration: "300ms" }}
          />
          <line
            className="hero-trace"
            x1={100}
            y1={0}
            x2={49.8}
            y2={87.6}
            style={{ transitionDelay: "350ms", transitionDuration: "300ms" }}
          />
          <circle
            className="hero-trace"
            cx={49.8}
            cy={40}
            r={52}
            style={{ transitionDelay: "500ms", transitionDuration: "300ms" }}
          />
        </g>

        <g ref={leftGroupRef} style={{ willChange: "transform" }}>
          <path className="hero-half hero-half-left" d={LEFT_HALF} fill="url(#heroIsotypeFill)" />
        </g>
        <g ref={rightGroupRef} style={{ willChange: "transform" }}>
          <path className="hero-half hero-half-right" d={RIGHT_HALF} fill="url(#heroIsotypeFill)" />
        </g>
      </svg>

      <div ref={cotasRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {COTAS.map((cota) => (
          <span
            key={cota.id}
            className="hero-cota"
            style={{ ...cota.style, transitionDelay: `${cota.delay}ms` }}
          >
            {cota.text}
          </span>
        ))}
      </div>
    </div>
  );
}
