import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useScrollRange } from "@/hooks/useScrollEngine";

// Small facet-like shards, not generic triangles: five clip-path silhouettes
// echoing the Crystal V's own facet geometry (kite/shard/notch read as cut
// gem faces, not arbitrary polygons), each paired with one of the system's
// documented treatments (sólido/graduado/translúcido from the Asset Pack V2
// board — "contorno" is skipped since a CSS border can't follow a clip-path
// silhouette without extra SVG plumbing).
type FragmentShape = "triangleUp" | "triangleDown" | "kite" | "shard" | "notch";
type FragmentTreatment = "solid" | "graded" | "translucent";

const SHAPE_CLIP_PATH: Record<FragmentShape, string> = {
  triangleUp: "polygon(50% 0%, 100% 100%, 0% 100%)",
  triangleDown: "polygon(0% 0%, 100% 0%, 50% 100%)",
  kite: "polygon(50% 0%, 100% 40%, 50% 100%, 0% 40%)",
  shard: "polygon(25% 0%, 100% 15%, 75% 100%, 0% 85%)",
  notch: "polygon(0% 0%, 100% 0%, 100% 65%, 50% 100%, 0% 65%)",
};

function treatmentBackground(treatment: FragmentTreatment): string {
  switch (treatment) {
    case "solid":
      return "var(--gradient-brand)";
    case "graded":
      return "linear-gradient(135deg, rgba(255,255,255,.55), rgba(217,47,110,.5))";
    case "translucent":
      return "linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,75,141,.18))";
  }
}

type FragmentDef = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity: number;
  driftX: number;
  driftY: number;
  shape: FragmentShape;
  treatment: FragmentTreatment;
};

// 12 shards standing in for facets of the Crystal V that haven't found their
// place yet. Scattered across the scene for Dolor 1; the same visual
// language regroups into three clusters for Dolor 2 (see DOLOR2_CLUSTERS).
const DOLOR1_FRAGMENTS: FragmentDef[] = [
  {
    top: "10%",
    left: "15%",
    size: 22,
    rotate: 15,
    opacity: 0.6,
    driftX: 10,
    driftY: -8,
    shape: "triangleUp",
    treatment: "solid",
  },
  {
    top: "20%",
    left: "55%",
    size: 30,
    rotate: -20,
    opacity: 0.4,
    driftX: -12,
    driftY: 6,
    shape: "shard",
    treatment: "translucent",
  },
  {
    top: "8%",
    left: "75%",
    size: 18,
    rotate: 40,
    opacity: 0.7,
    driftX: 8,
    driftY: 10,
    shape: "kite",
    treatment: "graded",
  },
  {
    top: "35%",
    left: "8%",
    size: 26,
    rotate: -10,
    opacity: 0.5,
    driftX: -10,
    driftY: -6,
    shape: "notch",
    treatment: "solid",
  },
  {
    top: "42%",
    left: "38%",
    size: 34,
    rotate: 25,
    opacity: 0.8,
    driftX: 12,
    driftY: 4,
    shape: "triangleDown",
    treatment: "graded",
  },
  {
    top: "30%",
    left: "68%",
    size: 20,
    rotate: -35,
    opacity: 0.35,
    driftX: -6,
    driftY: 12,
    shape: "triangleUp",
    treatment: "translucent",
  },
  {
    top: "55%",
    left: "20%",
    size: 24,
    rotate: 50,
    opacity: 0.55,
    driftX: 9,
    driftY: -10,
    shape: "shard",
    treatment: "solid",
  },
  {
    top: "60%",
    left: "50%",
    size: 16,
    rotate: -5,
    opacity: 0.3,
    driftX: -8,
    driftY: 8,
    shape: "kite",
    treatment: "translucent",
  },
  {
    top: "50%",
    left: "80%",
    size: 28,
    rotate: 30,
    opacity: 0.65,
    driftX: 6,
    driftY: -12,
    shape: "notch",
    treatment: "graded",
  },
  {
    top: "75%",
    left: "12%",
    size: 20,
    rotate: -25,
    opacity: 0.45,
    driftX: -10,
    driftY: 5,
    shape: "triangleDown",
    treatment: "solid",
  },
  {
    top: "78%",
    left: "45%",
    size: 32,
    rotate: 10,
    opacity: 0.75,
    driftX: 12,
    driftY: -8,
    shape: "shard",
    treatment: "graded",
  },
  {
    top: "70%",
    left: "70%",
    size: 18,
    rotate: -45,
    opacity: 0.5,
    driftX: -9,
    driftY: 9,
    shape: "kite",
    treatment: "solid",
  },
];

function DolorFragment({ fragment, index }: { fragment: FragmentDef; index: number }) {
  return (
    <div
      key={index}
      aria-hidden="true"
      className="dolor-fragment"
      style={
        {
          top: fragment.top,
          left: fragment.left,
          width: fragment.size,
          height: fragment.size,
          clipPath: SHAPE_CLIP_PATH[fragment.shape],
          backgroundImage: treatmentBackground(fragment.treatment),
          "--fragment-rotate": `${fragment.rotate}deg`,
          "--fragment-opacity": fragment.opacity,
          "--drift-x": `${fragment.driftX}px`,
          "--drift-y": `${fragment.driftY}px`,
        } as CSSProperties
      }
    />
  );
}

function Target({ top, left }: { top: string; left: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className="absolute"
      style={{ top, left, width: 90, height: 90, transform: "translate(-50%, -50%)" }}
    >
      <circle className="dolor-target-ring" cx="50" cy="50" r="34" strokeWidth="1.5" />
      <circle className="dolor-target-ring" cx="50" cy="50" r="18" strokeWidth="1" />
      <path
        className="dolor-target-ring"
        d="M50 4v20M50 76v20M4 50h20M76 50h20"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="50" r="6" fill="var(--pink)" />
    </svg>
  );
}

function Dolor1() {
  const sceneRef = useReveal<HTMLDivElement>();

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
          {DOLOR1_FRAGMENTS.map((fragment, i) => (
            <DolorFragment key={i} fragment={fragment} index={i} />
          ))}
          <Target top="70%" left="78%" />
        </div>
      </div>
    </section>
  );
}

type ClusterDef = {
  /** Cluster anchor, relative to the scene (%). */
  top: string;
  left: string;
  fragments: FragmentDef[];
};

// Same 12 shards as Dolor 1, regrouped into three loose clusters — organizing,
// not yet a shape. Offsets below are relative to each cluster's own anchor.
const DOLOR2_CLUSTERS: ClusterDef[] = [
  {
    top: "28%",
    left: "26%",
    fragments: [
      {
        top: "-8%",
        left: "-6%",
        size: 24,
        rotate: 12,
        opacity: 0.6,
        driftX: 0,
        driftY: 0,
        shape: "shard",
        treatment: "solid",
      },
      {
        top: "6%",
        left: "8%",
        size: 20,
        rotate: -18,
        opacity: 0.45,
        driftX: 0,
        driftY: 0,
        shape: "triangleUp",
        treatment: "translucent",
      },
      {
        top: "10%",
        left: "-10%",
        size: 28,
        rotate: 30,
        opacity: 0.7,
        driftX: 0,
        driftY: 0,
        shape: "notch",
        treatment: "graded",
      },
      {
        top: "-4%",
        left: "12%",
        size: 18,
        rotate: -6,
        opacity: 0.4,
        driftX: 0,
        driftY: 0,
        shape: "kite",
        treatment: "solid",
      },
    ],
  },
  {
    top: "24%",
    left: "72%",
    fragments: [
      {
        top: "-6%",
        left: "4%",
        size: 26,
        rotate: -22,
        opacity: 0.55,
        driftX: 0,
        driftY: 0,
        shape: "triangleDown",
        treatment: "graded",
      },
      {
        top: "8%",
        left: "-8%",
        size: 22,
        rotate: 16,
        opacity: 0.65,
        driftX: 0,
        driftY: 0,
        shape: "shard",
        treatment: "solid",
      },
      {
        top: "-10%",
        left: "-4%",
        size: 18,
        rotate: 40,
        opacity: 0.35,
        driftX: 0,
        driftY: 0,
        shape: "kite",
        treatment: "translucent",
      },
      {
        top: "10%",
        left: "10%",
        size: 20,
        rotate: -30,
        opacity: 0.5,
        driftX: 0,
        driftY: 0,
        shape: "notch",
        treatment: "solid",
      },
    ],
  },
  {
    top: "72%",
    left: "42%",
    fragments: [
      {
        top: "-8%",
        left: "0%",
        size: 30,
        rotate: 8,
        opacity: 0.75,
        driftX: 0,
        driftY: 0,
        shape: "shard",
        treatment: "graded",
      },
      {
        top: "6%",
        left: "10%",
        size: 20,
        rotate: -14,
        opacity: 0.4,
        driftX: 0,
        driftY: 0,
        shape: "triangleUp",
        treatment: "solid",
      },
      {
        top: "8%",
        left: "-10%",
        size: 24,
        rotate: 24,
        opacity: 0.6,
        driftX: 0,
        driftY: 0,
        shape: "kite",
        treatment: "graded",
      },
      {
        top: "-4%",
        left: "-14%",
        size: 16,
        rotate: -40,
        opacity: 0.3,
        driftX: 0,
        driftY: 0,
        shape: "notch",
        treatment: "translucent",
      },
    ],
  },
];

// Just two connecting lines between clusters — "algunos pares", never the
// closed loop of all three, which read as a giant deliberate triangle. This
// scene says "there are some connections", not "here's a shape".
const DOLOR2_LINES = [
  { x1: 26, y1: 28, x2: 72, y2: 24 },
  { x1: 72, y1: 24, x2: 42, y2: 72 },
];

function Dolor2() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const sceneRef = useReveal<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement | null>(null);
  const clusterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sceneSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function measure() {
      const scene = sceneRef.current;
      if (!scene) return;
      sceneSizeRef.current = { width: scene.clientWidth, height: scene.clientHeight };
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [sceneRef]);

  useScrollRange(sectionRef, (progress) => {
    if (reducedMotion) return;
    const { width, height } = sceneSizeRef.current;
    const approach = progress * 0.15;
    DOLOR2_CLUSTERS.forEach((cluster, i) => {
      const el = clusterRefs.current[i];
      if (!el) return;
      const clusterX = (parseFloat(cluster.left) / 100) * width;
      const clusterY = (parseFloat(cluster.top) / 100) * height;
      const dx = (width / 2 - clusterX) * approach;
      const dy = (height / 2 - clusterY) * approach;
      el.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    });
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

        <div ref={sceneRef} className="dolor-scene order-1 md:order-2">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            {DOLOR2_LINES.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--pink)"
                strokeOpacity="0.25"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {DOLOR2_CLUSTERS.map((cluster, ci) => (
            <div
              key={ci}
              ref={(el) => {
                clusterRefs.current[ci] = el;
              }}
              className="dolor-cluster"
              style={{ top: cluster.top, left: cluster.left, transform: "translate(-50%, -50%)" }}
            >
              {cluster.fragments.map((fragment, fi) => (
                <DolorFragment key={fi} fragment={fragment} index={ci * 10 + fi} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Dolor1, Dolor2 };
