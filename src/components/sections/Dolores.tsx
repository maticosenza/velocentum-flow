import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useScrollRange } from "@/hooks/useScrollEngine";
import {
  FRAGMENTS,
  FRAGMENT_VIEWBOX,
  type FragmentDef,
  type FragmentTreatment,
} from "@/components/brand/fragmentGeometry";

// Per-treatment opacity target — mirrors the Asset Pack V2 board's own mix
// of solid / graded / translucent shards (plus "dark" for depth, this
// system's own addition) rather than tuning sixteen values by hand.
const TREATMENT_OPACITY: Record<FragmentTreatment, number> = {
  solid: 0.75,
  graded: 0.62,
  translucent: 0.4,
  dark: 0.55,
};

function fragmentFill(treatment: FragmentTreatment, gradientId: string) {
  switch (treatment) {
    case "solid":
      return { fill: "var(--pink)", stroke: "rgba(255,255,255,.3)" };
    case "graded":
      return { fill: `url(#${gradientId})`, stroke: "rgba(255,255,255,.3)" };
    case "translucent":
      return { fill: "none", stroke: "rgba(255,255,255,.55)" };
    case "dark":
      return { fill: "var(--ink-deep-2)", stroke: "rgba(255,75,141,.4)" };
  }
}

function FragmentShard({
  fragment,
  index,
  cluster,
  gradientId,
}: {
  fragment: FragmentDef;
  index: number;
  /** 0 = Dolor 1 native position, 1 = fully gathered into its Dolor 2 cluster. */
  cluster: number;
  gradientId: string;
}) {
  const { fill, stroke } = fragmentFill(fragment.treatment, gradientId);
  const tx = fragment.clusterDelta.x * cluster;
  const ty = fragment.clusterDelta.y * cluster;

  return (
    <g
      className="dolor-fragment"
      style={
        {
          "--frag-opacity": TREATMENT_OPACITY[fragment.treatment],
          "--frag-tx": `${tx.toFixed(2)}px`,
          "--frag-ty": `${ty.toFixed(2)}px`,
          // The site-wide prefers-reduced-motion rule (styles.css) forces
          // transition-delay:0 !important too, so this stagger collapses
          // safely there without any extra guard here.
          transitionDelay: `${index * 28}ms`,
        } as CSSProperties
      }
    >
      <polygon points={fragment.points} fill={fill} stroke={stroke} strokeWidth={1.1} />
    </g>
  );
}

function FragmentGradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fff" stopOpacity=".7" />
        <stop offset=".35" stopColor="var(--pink-soft)" />
        <stop offset="1" stopColor="var(--pink)" />
      </linearGradient>
    </defs>
  );
}

// Descentered crosshair — "una persona no alcanza": the reticle sits off to
// one side, never centered on the cluster it's aimed at. Coordinates are in
// the shared 280x240 fragment viewBox so it lives inside the same <svg> as
// the shards instead of a separately-positioned overlay.
function Target({ x, y, size = 50 }: { x: number; y: number; size?: number }) {
  const s = size / 100;
  return (
    <g transform={`translate(${x - 50 * s}, ${y - 50 * s}) scale(${s})`} aria-hidden="true">
      <circle className="dolor-target-ring" cx="50" cy="50" r="34" strokeWidth="1.5" />
      <circle className="dolor-target-ring" cx="50" cy="50" r="18" strokeWidth="1" />
      <path
        className="dolor-target-ring"
        d="M50 4v20M50 76v20M4 50h20M76 50h20"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="50" r="6" fill="var(--pink)" />
    </g>
  );
}

function Dolor1() {
  const sceneRef = useReveal<HTMLDivElement>();
  const gradientId = useId();

  return (
    <section className="dolor-section bg-ink-deep">
      <div className="container-v grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="eyebrow text-on-dark-2">El problema</span>
          <h2 className="display-l dolor-headline mt-4 text-on-dark">
            Una sola persona no puede cargar
            <br />
            todo el crecimiento de un negocio.
          </h2>
        </div>

        <div ref={sceneRef} className="dolor-scene order-1 md:order-2">
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox={FRAGMENT_VIEWBOX}
          >
            <FragmentGradientDefs id={gradientId} />
            {FRAGMENTS.map((fragment, i) => (
              <FragmentShard
                key={i}
                fragment={fragment}
                index={i}
                cluster={0}
                gradientId={gradientId}
              />
            ))}
            <Target x={218} y={168} size={54} />
          </svg>
        </div>
      </div>
    </section>
  );
}

// Same two connecting lines as before — "algunos pares", never the closed
// loop of all three, which would read as a giant deliberate (and premature)
// triangle. Anchors match the cluster targets in fragmentGeometry.ts exactly.
const DOLOR2_LINES = [
  { x1: 26, y1: 28, x2: 72, y2: 24 },
  { x1: 72, y1: 24, x2: 42, y2: 72 },
];

function Dolor2() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const sceneRef = useReveal<HTMLDivElement>();
  const sceneWrapRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const gradientId = useId();

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // A small continued camera pan while the section scrolls by — the scene
  // drifts and the text column eases back, so the composition keeps
  // shifting instead of holding the exact "text left / scene right" split
  // Dolor 1 already used. Kept subtle: transform/opacity only, no layout
  // reads inside the callback (see useScrollEngine's rules).
  useScrollRange(sectionRef, (progress) => {
    if (reducedMotion || !sceneWrapRef.current) return;
    const pan = progress * -24;
    const scale = 1 + progress * 0.04;
    sceneWrapRef.current.style.transform = `translateX(${pan.toFixed(2)}px) scale(${scale.toFixed(3)})`;
  });

  return (
    <section ref={sectionRef} className="dolor-section bg-ink-deep">
      <div className="container-v grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="eyebrow text-on-dark-2">El otro problema</span>
          <h2 className="display-l dolor-headline mt-4 text-on-dark">
            Y muchos proveedores sueltos
            <br />
            tampoco forman un equipo.
          </h2>
        </div>

        <div ref={sceneWrapRef} className="order-1 md:order-2" style={{ willChange: "transform" }}>
          <div ref={sceneRef} className="dolor-scene">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox={FRAGMENT_VIEWBOX}
            >
              <FragmentGradientDefs id={gradientId} />
              {DOLOR2_LINES.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1 * 2.8}
                  y1={line.y1 * 2.4}
                  x2={line.x2 * 2.8}
                  y2={line.y2 * 2.4}
                  stroke="var(--pink)"
                  strokeOpacity="0.28"
                  strokeWidth="0.7"
                  className="dolor-connector"
                  style={{ "--frag-opacity": 0.28, transitionDelay: "420ms" } as CSSProperties}
                />
              ))}
              {FRAGMENTS.map((fragment, i) => (
                <FragmentShard
                  key={i}
                  fragment={fragment}
                  index={i}
                  cluster={1}
                  gradientId={gradientId}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Dolor1, Dolor2 };
