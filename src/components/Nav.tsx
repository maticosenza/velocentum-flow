import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useScrollSubscription } from "@/hooks/useScrollEngine";
import { subscribeNavLight } from "@/hooks/useNavLight";
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
  const headerRef = useRef<HTMLElement | null>(null);

  // Variante clara del nav: UN ÚNICO COMPONENTE que solo cambia de tema. El
  // valor 0..1 se escribe como custom property y el CSS interpola pieles y
  // tinta con él, sin re-renderizar y sin tocar geometría, altura ni padding.
  useEffect(
    () =>
      subscribeNavLight((light) => {
        headerRef.current?.style.setProperty("--nav-light", String(light));
      }),
    [],
  );

  useScrollSubscription((state) => {
    const isScrolled = state.y > SCROLL_THRESHOLD;
    if (isScrolled !== scrolledRef.current) {
      scrolledRef.current = isScrolled;
      setScrolled(isScrolled);
    }
  });

  return (
    <header
      ref={headerRef}
      className="nav-fixed fixed inset-x-0 top-0 z-50"
      data-scrolled={scrolled ? "true" : "false"}
    >
      {/* Las dos pieles del nav. Se cruzan SOLO con opacity: el fondo oscuro y
          el claro son el mismo rectángulo, con la misma geometría. */}
      <span className="nav-skins" aria-hidden="true">
        <span className="nav-skin-dark" />
        <span className="nav-skin-light" />
      </span>

      <div className="container-v relative flex items-center justify-between py-5">
        {/* Lockup sin bajada: la bajada de marca vive solo como eyebrow del
            Hero y no se repite acá (Mockup 01). */}
        <Link to="/" className="nav-wordmark-lockup shrink-0" aria-label="Velocentum, inicio">
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
