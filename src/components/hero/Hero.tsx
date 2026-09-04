import { useEffect, useState } from "react";
import { HeroComposition } from "./HeroComposition";

/**
 * Sección 01 — Hero, fallback estático. Lo renderiza NarrativeSequence en modo
 * "static" (viewports por debajo de 900 px y prefers-reduced-motion): la misma
 * composición aprobada del Mockup 01, con el Crystal 5 armado adentro y sin
 * explosión ni trayectoria. Ningún contenido esencial depende de la animación:
 * el `reveal` y la entrada de las píldoras quedan en su estado final bajo
 * reduced motion por CSS, sin esperar a JavaScript.
 *
 * El copy, los CTA y las píldoras salen de heroContent.ts, compartidos con el
 * beat pinned (sequenceA/HeroBeat.tsx).
 */
export function Hero() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="hero hero-static">
      <HeroComposition mode="static" play={play} />
    </section>
  );
}
