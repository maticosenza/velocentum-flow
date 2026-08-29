import { useEffect, useRef, useState } from "react";
import { HeroIsotype } from "./HeroIsotype";

const EYEBROW = "Equipo de crecimiento";
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
      className="hero-trazado relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink-deep"
      data-play={play ? "true" : "false"}
      data-motion={reducedMotion ? "reduced" : "full"}
    >
      <div className="container-v flex w-full flex-col items-center gap-4 md:gap-5">
        <span
          className="eyebrow reveal w-full text-on-dark-2"
          data-revealed={play ? "true" : "false"}
          style={{ transitionDelay: "700ms" }}
        >
          {EYEBROW}
        </span>

        <h1 className="display-xl w-full text-on-dark">
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
          className="reveal body-l w-full max-w-[56ch] text-on-dark-2"
          data-revealed={play ? "true" : "false"}
          style={{ transitionDelay: "1300ms" }}
        >
          Estrategia, creatividad, pauta y medición.
          <br />
          Primero analizamos tu negocio. Después armamos el plan.
        </p>

        <div className="mx-auto w-full max-w-[200px] md:max-w-[280px]">
          <HeroIsotype sectionRef={sectionRef} reducedMotion={reducedMotion} />
        </div>

        <a
          href="#contacto"
          className="hero-cta reveal body-base inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-on-dark"
          data-revealed={play ? "true" : "false"}
          style={{ transitionDelay: "1450ms" }}
        >
          Reservá tu análisis de negocio
          <span className="hero-cta-arrow" style={{ color: "#B9AEFF" }} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
