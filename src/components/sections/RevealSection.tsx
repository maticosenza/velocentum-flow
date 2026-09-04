import { useEffect, useState } from "react";
import { MismoObjetivoComposition } from "@/components/sections/sequenceA/MismoObjetivoComposition";

/**
 * Sección 04 — Un mismo objetivo, fallback estático.
 *
 * Lo renderiza NarrativeSequence en modo "static" (por debajo de 900 px y con
 * prefers-reduced-motion): la misma composición aprobada del Mockup 04, con el
 * fragmento ya orientado hacia la Mira y sin desaceleración, giro ni pulso de
 * luz. Huella y Mira estáticas. Ningún contenido esencial depende de la
 * animación.
 */
export function RevealSection() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="scene-static">
      <MismoObjetivoComposition mode="static" play={play} />
    </section>
  );
}
