import { useEffect, useRef } from "react";

/**
 * Velocentum scroll engine.
 *
 * The single source of scroll for the whole site.
 * - One global rAF loop that sleeps when there is nothing to animate.
 * - The 'scroll' listener is passive and only flips a boolean flag; it never
 *   reads layout.
 * - Layout measurements are cached on mount and on resize, never inside the
 *   scroll handler or the rAF tick.
 * - Only transform/opacity should be written by subscribers.
 */

export type ScrollState = {
  /** Raw scroll position in px. */
  y: number;
  /** Lerp-smoothed scroll position in px (equals y with reduced motion). */
  smoothY: number;
  /** Global scroll progress, 0 to 1. */
  progress: number;
  /** Scroll direction: 1 down, -1 up, 0 idle. */
  direction: 1 | -1 | 0;
  viewportHeight: number;
  viewportWidth: number;
  reducedMotion: boolean;
};

type Subscriber = (state: ScrollState) => void;

export type RangeTarget = {
  element: HTMLElement;
  /** Called with progress 0..1 while the element travels through the range. */
  onProgress: (progress: number, state: ScrollState) => void;
  /** Offsets in viewport fractions. Default: enters at bottom, exits at top. */
  start?: number;
  end?: number;
};

export const LERP_FACTOR = 0.12;

export function lerp(from: number, to: number, factor = LERP_FACTOR) {
  return from + (to - from) * factor;
}

const RESIZE_DEBOUNCE_MS = 150;

type Measured = RangeTarget & { top: number; height: number };

class ScrollEngine {
  private subscribers = new Set<Subscriber>();
  private targets = new Set<RangeTarget>();
  private measured: Measured[] = [];
  private rafId: number | null = null;
  private dirty = true;
  private needsFrames = true;
  private idle = false;
  private docHeight = 0;
  private started = false;
  private measureQueued = false;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;

  state: ScrollState = {
    y: 0,
    smoothY: 0,
    progress: 0,
    direction: 0,
    viewportHeight: 0,
    viewportWidth: 0,
    reducedMotion: false,
  };

  private onScroll = () => {
    // Flag only. No layout reads here.
    this.dirty = true;
    this.wake();
  };

  private onResize = () => {
    // Wake immediately so repaint doesn't stall, but debounce the actual
    // re-measurement: iOS fires resize repeatedly during ordinary scroll.
    this.wake();
    if (this.resizeTimer !== null) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;
      this.measure();
      this.dirty = true;
      this.wake();
    }, RESIZE_DEBOUNCE_MS);
  };

  /** All layout reads live here: mount + debounced resize + queued register(). */
  private measure() {
    if (typeof window === "undefined") return;
    this.state.viewportHeight = window.innerHeight;
    this.state.viewportWidth = window.innerWidth;
    this.state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    this.measured = [];
    this.targets.forEach((target) => {
      const rect = target.element.getBoundingClientRect();
      this.measured.push({
        ...target,
        top: rect.top + window.scrollY,
        height: rect.height,
      });
    });
  }

  /**
   * Collapse any number of register()/unregister() calls within the same
   * tick into a single measure() on the next frame, instead of a full pass
   * per call.
   */
  private queueMeasure() {
    if (this.measureQueued || typeof window === "undefined") return;
    this.measureQueued = true;
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        this.measureQueued = false;
        this.measure();
        this.dirty = true;
        this.wake();
      });
    });
  }

  private wake() {
    if (!this.idle) return;
    this.idle = false;
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private tick = () => {
    if (this.dirty) {
      this.dirty = false;
      const y = window.scrollY;
      const prev = this.state.y;
      this.state.y = y;
      this.state.direction = y === prev ? 0 : y > prev ? 1 : -1;
      this.state.progress = Math.min(Math.max(y / this.docHeight, 0), 1);
      this.needsFrames = true;
    }

    if (this.needsFrames) {
      const s = this.state;
      if (s.reducedMotion) {
        s.smoothY = s.y;
        this.needsFrames = false;
      } else {
        s.smoothY = lerp(s.smoothY, s.y);
        if (Math.abs(s.smoothY - s.y) < 0.05) {
          s.smoothY = s.y;
          this.needsFrames = false;
        }
      }

      for (const target of this.measured) {
        const start = target.start ?? 1;
        const end = target.end ?? 0;
        const startY = target.top - s.viewportHeight * start;
        const endY = target.top + target.height - s.viewportHeight * end;
        const span = Math.max(endY - startY, 1);
        const p = Math.min(Math.max((s.y - startY) / span, 0), 1);
        target.onProgress(p, s);
      }

      this.subscribers.forEach((fn) => fn(s));
    }

    if (!this.dirty && !this.needsFrames) {
      this.rafId = null;
      this.idle = true;
      return;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    this.measure();
    this.state.smoothY = window.scrollY;
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    if (this.resizeTimer !== null) clearTimeout(this.resizeTimer);
    this.resizeTimer = null;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.idle = false;
  }

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    this.dirty = true;
    this.wake();
    return () => {
      this.subscribers.delete(fn);
    };
  }

  register(target: RangeTarget) {
    this.targets.add(target);
    this.queueMeasure();
    return () => {
      this.targets.delete(target);
      this.queueMeasure();
    };
  }

  /** Re-measure after layout-changing content updates. */
  refresh() {
    this.measure();
    this.dirty = true;
    this.wake();
  }
}

const engine = new ScrollEngine();

export function getScrollEngine() {
  return engine;
}

/** Subscribe imperatively without re-rendering React. */
export function useScrollSubscription(fn: Subscriber) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    engine.start();
    return engine.subscribe((s) => ref.current(s));
  }, []);
}

/** Track progress (0..1) of one element through the viewport. */
export function useScrollRange(
  elementRef: React.RefObject<HTMLElement | null>,
  onProgress: (progress: number, state: ScrollState) => void,
  options?: { start?: number; end?: number },
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    engine.start();
    const target: RangeTarget = {
      element,
      onProgress: (p, s) => cb.current(p, s),
    };
    if (options?.start !== undefined) target.start = options.start;
    if (options?.end !== undefined) target.end = options.end;
    return engine.register(target);
  }, [elementRef, options?.start, options?.end]);
}
