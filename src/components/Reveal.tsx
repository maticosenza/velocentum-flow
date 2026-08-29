import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index; multiplied by 60ms. */
  index?: number;
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  index = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>({ delay: index * 60 });

  return (
    <Tag ref={ref} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
