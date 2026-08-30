import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";

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
  /** Rendered inside the pinned sticky viewport (mode:"pinned") or inline in normal flow (mode:"static"). */
  children: ReactNode;
};

/**
 * The scroll scaffold shared by every V3 sequence/transition: one outer
 * element sized to `beatCount * 100svh`, one inner sticky viewport, one
 * `useScrollRange` producing a single progress 0..1 across the whole
 * thing. Children ("beats") read that progress via `useNarrativeContext`
 * and mutate their own refs directly — no React re-render per frame,
 * same contract as the rest of useScrollEngine's consumers.
 *
 * In "static" mode (mobile or reduced-motion) this renders the exact same
 * children, but as normal-flow content with no pin and no scroll
 * subscription — beats detect this via `mode` and skip straight to their
 * resolved pose instead of animating.
 */
export function NarrativeSequence({
  beatCount,
  staticBelow,
  className,
  children,
}: NarrativeSequenceProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const listenersRef = useRef(new Set<ProgressListener>());
  const mode = useNarrativeMode(staticBelow);

  useScrollRange(outerRef, (progress) => {
    listenersRef.current.forEach((fn) => fn(progress));
  });

  const subscribe = useCallback((fn: ProgressListener) => {
    listenersRef.current.add(fn);
    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  if (mode === "static") {
    return (
      <NarrativeContext.Provider value={{ mode, subscribe }}>
        <div className={className}>{children}</div>
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
