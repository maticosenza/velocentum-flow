import { useReveal } from "@/hooks/useReveal";
import { CrystalV } from "@/components/brand/CrystalV";

// No hay backend de formulario, dirección de contacto, WhatsApp ni link de
// agenda confirmados en este repo (se buscó mailto:/wa.me/tel: y ningún
// endpoint de envío — no existen). Por eso el CTA de abajo es un <button>
// que no pretende ir a ningún lado todavía, en vez de inventar un
// mailto:/href real: cuando exista un canal real (email, WhatsApp,
// Calendly, un endpoint propio), reemplazar el onClick de handleContactCta.
// Ver freno documentado en el reporte de este bloque.
function handleContactCta() {
  // TODO(contacto): conectar al canal real una vez definido.
}

// Closes the arc opened by CrystalIntro (complete -> fracture -> scatter)
// and continued through Dolor1/Dolor2/Reveal (scatter -> gather ->
// assemble): this is the last time the Crystal V appears, already
// resolved, not fracturing or reassembling again. No facet scatter/convert
// choreography here on purpose — that gesture already happened in Reveal;
// repeating it would read as a new animation, not the same system's
// output. Just a settle (scale .88 -> 1, no overshoot) so it reads calm
// and controlled, then a thread grows down into the copy and CTA, so the
// action reads as this system's output rather than a button under a title.
export function Contacto() {
  const contentRef = useReveal<HTMLDivElement>();

  return (
    <section id="contacto" className="section-v bg-ink-deep">
      <div
        ref={contentRef}
        data-revealed="false"
        className="contacto-sequence container-v flex flex-col items-center text-center"
      >
        <div className="contacto-crystal-wrap hero-crystal-wrap">
          <CrystalV variant="object" className="w-full" />
        </div>

        <span className="contacto-thread" aria-hidden="true" />

        <span className="contacto-item eyebrow text-on-dark-2" style={{ transitionDelay: "480ms" }}>
          Empecemos
        </span>
        <h2
          className="contacto-item display-l mx-auto mt-4 max-w-[20ch] text-on-dark"
          style={{ transitionDelay: "600ms" }}
        >
          Hagamos crecer tu negocio.
        </h2>
        <p
          className="contacto-item body-l mx-auto mt-4 max-w-[48ch] text-on-dark-2"
          style={{ transitionDelay: "720ms" }}
        >
          Primero analizamos tu negocio. Después armamos el plan.
        </p>

        <button
          type="button"
          onClick={handleContactCta}
          className="contacto-item hero-cta contacto-cta mt-8 inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 font-medium text-ink"
          style={{ transitionDelay: "880ms" }}
        >
          Reservá tu análisis de negocio
          <span className="hero-cta-arrow" style={{ color: "var(--ink)" }} aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
