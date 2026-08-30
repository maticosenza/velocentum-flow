import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";
import { CrystalV } from "@/components/brand/CrystalV";

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
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Velocentum, inicio">
          <CrystalV variant="mark" className="block" style={{ height: 22, width: "auto" }} />
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

        <Link
          to="/"
          hash="contacto"
          className="nav-cta inline-flex shrink-0 items-center gap-2 rounded-full bg-pink text-ink"
        >
          Reservá tu análisis
          <span className="nav-cta-arrow" style={{ color: "var(--ink)" }} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
