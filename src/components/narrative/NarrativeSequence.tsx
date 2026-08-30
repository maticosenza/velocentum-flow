import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getScrollEngine } from "@/hooks/useScrollEngine";

export type NarrativeMode = "pinned" | "static";

type ProgressListener = (progress: number) => void;

type NarrativeContextValue = {
  mode: NarrativeMode;
  /** Only meaningful in "pinned" mode — static mode never calls listeners. */
  subscribe: (fn: ProgressListener) => () => void;
};

const NarrativeContext = createContext<NarrativeContextValue | null>(null);

/**
 * A NarrativeSequence child (a "beat") calls this to read the shared
 * progress. In "static" mode there is nothing to subscribe to — beats are
 * expected to check `mode` and render their own final/snapshot pose
 * instead of animating.
 */
export function useNarrativeContext(): NarrativeContextValue {
  const ctx = useContext(NarrativeContext);
  if (!ctx) {
    throw new Error("useNarrativeContext must be used inside a <NarrativeSequence>");
  }
  return ctx;
}

/**
 * One flag decides both the mobile and prefers-reduced-motion fallback,
 * because they want the exact same thing: no scroll-pinned continuous
 * motion, content presented directly in its resolved state. Below
 * `staticBelow`, or with reduced motion on, every NarrativeSequence on the
 * page falls back the same way — one code path to maintain, matching
 * RevealSection's existing sticky->static media-query precedent.
 */
export function useNarrativeMode(staticBelow = 900): NarrativeMode {
  const [mode, setMode] = useState<NarrativeMode>("static");

  useEffect(() => {
    const mqNarrow = window.matchMedia(`(max-width: ${staticBelow - 1}px)`);
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMode(mqNarrow.matches || mqReduced.matches ? "static" : "pinned");
    };
    sync();
    mqNarrow.addEventListener("change", sync);
    mqReduced.addEventListener("change", sync);
    return () => {
      mqNarrow.removeEventListener("change", sync);
      mqReduced.removeEventListener("change", sync);
    };
  }, [staticBelow]);

  return mode;
}

type NarrativeSequenceProps = {
  /** Number of 100svh beats — determines total pin height in "pinned" mode. */
  beatCount: number;
  staticBelow?: number;
  className?: string;
  /** Rendered inside the shared pinned sticky viewport — an overlay per beat, opacity-driven by shared progress. */
  children: ReactNode;
  /**
   * Rendered instead, in normal document flow, for mobile/reduced-motion.
   * A structurally different tree on purpose: pinned beats are absolutely
   * positioned overlays sharing one crystal instance; the static fallback
   * is ordinary stacked sections (closer to pre-V3 Home), which is also
   * just simpler code for a case that must never animate continuously.
   */
  staticFallback: ReactNode;
};

/**
 * The scroll scaffold shared by every V3 sequence/transition: one outer
 * element sized to `beatCount * 100svh`, one inner sticky viewport, one
 * `useScrollRange` producing a single progress 0..1 across the whole
 * thing. Pinned-mode children ("beats") read that progress via
 * `useNarrativeContext` and mutate their own refs directly — no React
 * re-render per frame, same contract as the rest of useScrollEngine's
 * consumers.
 */
export function NarrativeSequence({
  beatCount,
  staticBelow,
  className,
  children,
  staticFallback,
}: NarrativeSequenceProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const listenersRef = useRef(new Set<ProgressListener>());
  const mode = useNarrativeMode(staticBelow);

  // Not useScrollRange: that hook's effect deps are `[elementRef, ...]`, and
  // a ref object's *identity* never changes even though `.current` does —
  // it would never re-run once `mode` flips from "static" (outerRef isn't
  // rendered at all, .current stays null forever) to "pinned" (outerRef
  // finally attaches). Depending on `mode` directly here re-registers at
  // the exact render where the ref becomes real.
  //
  // start:0/end:1 is the exact sticky-pin mapping (not either default):
  // progress 0 the instant the outer's top reaches the viewport top (the
  // pin engages), progress 1 the instant scroll has covered the outer's
  // full height minus one viewport (the pin releases) — see the engine's
  // own startY/endY formula. RevealSection's 0.8/0.75 is a deliberate,
  // narrower, Reveal-specific deviation from this; sequences want the
  // whole pinned duration mapped cleanly to 0..1.
  useEffect(() => {
    if (mode !== "pinned") return;
    const element = outerRef.current;
    if (!element) return;
    const engine = getScrollEngine();
    engine.start();
    return engine.register({
      element,
      onProgress: (p) => listenersRef.current.forEach((fn) => fn(p)),
      start: 0,
      end: 1,
    });
  }, [mode]);

  const subscribe = useCallback((fn: ProgressListener) => {
    listenersRef.current.add(fn);
    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  if (mode === "static") {
    return (
      <NarrativeContext.Provider value={{ mode, subscribe }}>
        {staticFallback}
      </NarrativeContext.Provider>
    );
  }

  return (
    <NarrativeContext.Provider value={{ mode, subscribe }}>
      <div
        ref={outerRef}
        className={className}
        style={{ height: `${beatCount * 100}svh`, position: "relative" }}
      >
        <div className="narrative-sticky">{children}</div>
      </div>
    </NarrativeContext.Provider>
  );
}
