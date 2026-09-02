import { Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrandCTAProps = {
  children: ReactNode;
  to?: "/" | "/metodo" | "/casos";
  hash?: string;
  variant?: "primary" | "outline";
  size?: "default" | "compact";
  className?: string;
  style?: CSSProperties;
  dataRevealed?: boolean;
};

export function BrandCTA({
  children,
  to = "/",
  hash,
  variant = "primary",
  size = "default",
  className,
  style,
  dataRevealed,
}: BrandCTAProps) {
  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      className={cn(
        "brand-cta",
        variant === "primary" ? "brand-cta-primary" : "brand-cta-outline",
        size === "compact" && "brand-cta-compact",
        className,
      )}
      style={style}
      {...(dataRevealed === undefined ? {} : { "data-revealed": dataRevealed ? "true" : "false" })}
    >
      <span>{children}</span>
      <span className="brand-cta-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
