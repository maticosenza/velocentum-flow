import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";

// Mirrors the two-half geometry from HeroIsotype, flattened into a static
// solid mark (no gradient, no assembly animation) for the nav wordmark.
const LEFT_HALF =
  "M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 Z";
const RIGHT_HALF = "M 49.65 58 L 82.9 0 L 100 0 L 49.65 87.6 Z";

const NAV_LINKS = [
  { label: "Método", href: "/metodo" },
  { label: "Trabajos", href: "/#trabajos" },
  { label: "Casos", href: "/casos" },
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
          <svg
            viewBox="0 0 100 87.6"
            className="block"
            style={{ height: 22, width: "auto" }}
            aria-hidden="true"
          >
            <path d={LEFT_HALF} fill="#F7F7FB" />
            <path d={RIGHT_HALF} fill="#F7F7FB" />
          </svg>
          <span className="nav-wordmark">velocentum</span>
        </Link>

        <nav className="hidden items-center gap-8 min-[900px]:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="nav-cta inline-flex shrink-0 items-center gap-2 rounded-full bg-brand text-on-dark"
        >
          Reservá tu análisis
          <span className="nav-cta-arrow" style={{ color: "#B9AEFF" }} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </header>
  );
}
