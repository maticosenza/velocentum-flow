import { useRef, type RefObject } from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";

type Cota = {
  id: string;
  text: string;
  delay: number;
  style: React.CSSProperties;
};

const COTAS: Cota[] = [
  {
    id: "top",
    text: "84.0",
    delay: 850,
    style: { left: "50%", top: "18%", transform: "translate(-50%, -220%)" },
  },
  {
    id: "axis",
    text: "74.0",
    delay: 910,
    style: {
      left: "50%",
      top: "56%",
      transform: "translate(calc(-100% - 10px), -50%) rotate(-90deg)",
    },
  },
  {
    id: "angle",
    text: "∠ 58°",
    delay: 970,
    style: { left: "50%", top: "92%", transform: "translate(-50%, 6px)" },
  },
  {
    id: "code",
    text: "VLC—01",
    delay: 1030,
    style: { left: "6%", top: "8%", transform: "translate(0, -100%)" },
  },
];

const OUTER_TRIANGLE = "M 8 18 L 92 18 L 50 92 Z";
const INNER_NOTCH = "M 28 30 L 58 30 L 43 56 Z";

type HeroIsotypeProps = {
  sectionRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
};

export function HeroIsotype({ sectionRef, reducedMotion }: HeroIsotypeProps) {
  const groupRef = useRef<SVGGElement | null>(null);
  const cotasRef = useRef<HTMLDivElement | null>(null);

  useScrollRange(
    sectionRef,
    (progress) => {
      if (reducedMotion) return;

      const group = groupRef.current;
      if (group) {
        const rotate = progress * 4;
        const translate = progress * 8;
        group.setAttribute("transform", `translate(0 ${translate}) rotate(${rotate} 50 55)`);
      }

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
    <div className="relative aspect-square w-full">
      <div className="hero-halo" aria-hidden="true" />
      <div className="hero-grid-bg" aria-hidden="true" />

      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full"
        role="img"
        aria-label="Isotipo de Velocentum trazándose como un plano técnico"
      >
        <defs>
          <linearGradient id="heroIsotypeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7F7FB" />
            <stop offset="55%" stopColor="#7B5CFF" />
            <stop offset="100%" stopColor="#2A1EC9" />
          </linearGradient>
        </defs>

        <g className="hero-construction-lines" aria-hidden="true">
          <line
            className="hero-trace"
            x1={4}
            y1={18}
            x2={96}
            y2={18}
            style={{ transitionDelay: "200ms", transitionDuration: "500ms" }}
          />
          <line
            className="hero-trace"
            x1={50}
            y1={12}
            x2={50}
            y2={98}
            style={{ transitionDelay: "200ms", transitionDuration: "500ms" }}
          />
          <line
            className="hero-trace"
            x1={8}
            y1={18}
            x2={50}
            y2={92}
            style={{ transitionDelay: "450ms", transitionDuration: "500ms" }}
          />
          <line
            className="hero-trace"
            x1={92}
            y1={18}
            x2={50}
            y2={92}
            style={{ transitionDelay: "450ms", transitionDuration: "500ms" }}
          />
          <circle
            className="hero-trace"
            cx={50}
            cy={42}
            r={44}
            strokeOpacity={0.25}
            style={{ transitionDelay: "600ms", transitionDuration: "600ms" }}
          />
          <line
            className="hero-trace"
            x1={4}
            y1={15}
            x2={4}
            y2={21}
            style={{ transitionDelay: "250ms", transitionDuration: "300ms" }}
          />
          <line
            className="hero-trace"
            x1={96}
            y1={15}
            x2={96}
            y2={21}
            style={{ transitionDelay: "250ms", transitionDuration: "300ms" }}
          />
        </g>

        <g ref={groupRef} style={{ willChange: "transform" }}>
          <path
            className="hero-trace hero-outline"
            d={OUTER_TRIANGLE}
            style={{ transitionDelay: "1000ms", transitionDuration: "700ms" }}
          />
          <path
            className="hero-trace hero-outline"
            d={INNER_NOTCH}
            style={{ transitionDelay: "1300ms", transitionDuration: "400ms" }}
          />
          <path className="hero-fill" d={OUTER_TRIANGLE} fill="url(#heroIsotypeFill)" />
          <path className="hero-fill" d={INNER_NOTCH} fill="var(--ink-deep)" />
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
