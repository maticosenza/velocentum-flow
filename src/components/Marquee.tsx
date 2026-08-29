import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/** Infinite horizontal marquee. transform-only, pauses on hover. */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  className,
}: MarqueeProps) {
  return (
    <div className={cn("marquee-viewport", className)}>
      <div
        className="marquee-track"
        data-direction={reverse ? "reverse" : "forward"}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
