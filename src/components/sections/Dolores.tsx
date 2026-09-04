import { useEffect, useState } from "react";
import { ProblemaDosComposition } from "@/components/sections/sequenceA/ProblemaDosComposition";
import { ProblemaUnoComposition } from "@/components/sections/sequenceA/ProblemaUnoComposition";

/**
 * Fallbacks estáticos de las Secciones 02 y 03.
 *
 * Los renderiza NarrativeSequence en modo "static" (por debajo de 900 px y con
 * prefers-reduced-motion): las mismas composiciones aprobadas de los Mockups 02
 * y 03, con el fragmento guía en su pose final y sin caída, cruce, giro ni
 * destello. Ningún contenido esencial depende de la animación.
 */
function useEntry() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return play;
}

function Dolor1() {
  const play = useEntry();
  return (
    <section className="scene-static">
      <ProblemaUnoComposition mode="static" play={play} />
    </section>
  );
}

function Dolor2() {
  const play = useEntry();
  return (
    <section className="scene-static">
      <ProblemaDosComposition mode="static" play={play} />
    </section>
  );
}

export { Dolor1, Dolor2 };
