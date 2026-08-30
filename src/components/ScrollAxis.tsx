import { useEffect, useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";

type ScrollAxisProps = {
  /** Tick labels, distributed evenly top to bottom. */
  labels?: string[];
};

type AxisMode = "compact" | "mid" | "wide";

const COMPACT_BREAKPOINT = 900;
// container-v caps at 1440px; a tick+label (~8px tick + 8px gap + up to
// ~100px of mono text) needs roughly 120px of clearance before that centered
// box's edge. (vw - 1440) / 2 >= ~130px of buffer only holds from ~1700px,
// so below that there's no genuinely safe rail — line only, no labels.
const WIDE_BREAKPOINT = 1700;

/**
 * Fixed 1px measurement axis on the left margin.
 * Progress is painted with transform: scaleY (never height).
 */
export function ScrollAxis({ labels = [] }: ScrollAxisProps) {
  const fillRef = useRef<HTMLDivElement | null>(null);
  // Default to "compact" (no ticks/labels) rather than "wide": on first
  // paint, before the sync effect below corrects it, this is the only
  // default that can never render a label over content.
  const [mode, setMode] = useState<AxisMode>("compact");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mqCompact = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT - 1}px)`);
    const mqWide = window.matchMedia(`(min-width: ${WIDE_BREAKPOINT}px)`);
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMode(mqCompact.matches ? "compact" : mqWide.matches ? "wide" : "mid");
      setReduced(mqMotion.matches);
    };
    sync();
    mqCompact.addEventListener("change", sync);
    mqWide.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqCompact.removeEventListener("change", sync);
      mqWide.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  useScrollSubscription((state) => {
    const el = fillRef.current;
    if (!el) return;
    el.style.transform = `scaleY(${reduced ? 1 : state.progress})`;
  });

  const compact = mode === "compact";
  // Mid range (tablet/small-medium desktop, ~900-1699px): a rail exists but
  // isn't safely clear of container-v's content, so ticks+labels hide and
  // only the progress line stays — never risk sitting on top of copy.
  const showLabels = mode === "wide";

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

      {showLabels &&
        labels.map((labelText, i) => {
          const top = labels.length === 1 ? 50 : (i / (labels.length - 1)) * 100;
          return (
            <div
              key={labelText + i}
              className="absolute flex items-center gap-2"
              style={{ top: `${top}%`, left: 0, transform: "translateY(-50%)", maxWidth: 140 }}
            >
              <span
                className="block shrink-0"
                style={{
                  width: 8,
                  height: 1,
                  backgroundColor: "rgba(255,75,141,0.3)",
                }}
              />
              {/* Reduced protagonism on very wide screens: dimmer than the
                  usual --on-dark-2, this is a measurement rail, not copy. */}
              <span
                className="whitespace-nowrap font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.4)",
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
