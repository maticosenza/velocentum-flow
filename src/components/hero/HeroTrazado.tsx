import { useEffect, useRef, useState } from "react";
import { HeroIsotype } from "./HeroIsotype";

const HEADLINE_LINE_1 = "Estamos en el negocio";
const HEADLINE_LINE_2_PREFIX = "de ";
const HEADLINE_LINE_2_HIGHLIGHT = "hacer crecer negocios";

export function HeroTrazado() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [play, setPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    if (reduced) {
      setPlay(true);
      return;
    }

    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-trazado relative min-h-screen overflow-hidden bg-ink-deep pt-28 pb-16 md:pt-32"
      data-play={play ? "true" : "false"}
      data-motion={reducedMotion ? "reduced" : "full"}
    >
      <div className="container-v grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1 className="display-xl text-on-dark">
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ transitionDelay: "900ms" }}>
                {HEADLINE_LINE_1}
              </span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ transitionDelay: "980ms" }}>
                {HEADLINE_LINE_2_PREFIX}
                <span className="text-violet">{HEADLINE_LINE_2_HIGHLIGHT}</span>.
              </span>
            </span>
          </h1>

          <p
            className="reveal body-l mt-8 max-w-[56ch] text-on-dark-2"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "1300ms" }}
          >
            Estrategia, creatividad, pauta y medición.
            <br />
            Primero analizamos tu negocio. Después armamos el plan.
          </p>

          <a
            href="#contacto"
            className="hero-cta reveal body-base mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-on-dark"
            data-revealed={play ? "true" : "false"}
            style={{ transitionDelay: "1450ms" }}
          >
            Reservá tu análisis de negocio
            <span className="hero-cta-arrow" style={{ color: "#B9AEFF" }} aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <div className="order-1 mx-auto w-full max-w-[230px] lg:order-2 lg:max-w-none">
          <HeroIsotype sectionRef={sectionRef} reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
