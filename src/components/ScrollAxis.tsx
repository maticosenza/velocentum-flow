import { useEffect, useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";

type ScrollAxisProps = {
  /** Tick labels, distributed evenly top to bottom. */
  labels?: string[];
};

/**
 * Fixed 1px measurement axis on the left margin.
 * Progress is painted with transform: scaleY (never height).
 */
export function ScrollAxis({ labels = [] }: ScrollAxisProps) {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [compact, setCompact] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mqCompact = window.matchMedia("(max-width: 899px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCompact(mqCompact.matches);
      setReduced(mqMotion.matches);
    };
    sync();
    mqCompact.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqCompact.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  useScrollSubscription((state) => {
    const el = fillRef.current;
    if (!el) return;
    el.style.transform = `scaleY(${reduced ? 1 : state.progress})`;
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 z-40 h-screen"
      style={{ left: compact ? 0 : 26, width: compact ? 2 : 1 }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,75,141,0.18)" }} />
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top"
        style={{
          backgroundColor: "var(--pink)",
          transform: reduced ? "scaleY(1)" : "scaleY(0)",
          willChange: "transform",
        }}
      />

      {!compact &&
        labels.map((labelText, i) => {
          const top = labels.length === 1 ? 50 : (i / (labels.length - 1)) * 100;
          return (
            <div
              key={labelText + i}
              className="absolute flex items-center gap-2"
              style={{ top: `${top}%`, left: 0, transform: "translateY(-50%)" }}
            >
              <span
                className="block"
                style={{
                  width: 8,
                  height: 1,
                  backgroundColor: "rgba(255,75,141,0.35)",
                }}
              />
              <span
                className="whitespace-nowrap font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "var(--on-dark-2)",
                }}
              >
                {labelText}
              </span>
            </div>
          );
        })}
    </div>
  );
}
