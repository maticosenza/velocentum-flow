import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";
import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { BrandCTA } from "@/components/brand/BrandCTA";

const NAV_LINKS: Array<{ label: string; to: string; hash?: string }> = [
  { label: "Método", to: "/metodo" },
  { label: "Trabajos", to: "/", hash: "trabajos" },
  { label: "Casos", to: "/casos" },
];

const SCROLL_THRESHOLD = 80;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useScrollSubscription((state) => {
    const isScrolled = state.y > SCROLL_THRESHOLD;
    if (isScrolled !== scrolledRef.current) {
      scrolledRef.current = isScrolled;
      setScrolled(isScrolled);
    }
  });

  return (
    <header
      className="nav-fixed fixed inset-x-0 top-0 z-50"
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div className="container-v flex items-center justify-between py-5">
        {/* Lockup sin bajada: la bajada de marca vive solo como eyebrow del
            Hero y no se repite acá (Mockup 01). */}
        <Link
          to="/"
          className="nav-wordmark-lockup shrink-0"
          aria-label="Velocentum, inicio"
        >
          <BrandLogoMark className="nav-brand-mark" />
          <span className="nav-wordmark">velocentum</span>
        </Link>

        <nav className="hidden items-center gap-8 min-[900px]:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              {...(link.hash ? { hash: link.hash } : {})}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* BrandCTA ya renderiza su propio Link: no se envuelve en otro. */}
        <BrandCTA to="/" hash="contacto" size="compact" className="shrink-0">
          Hablemos
        </BrandCTA>
      </div>
    </header>
  );
}
