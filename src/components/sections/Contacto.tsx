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

export function Contacto() {
  const contentRef = useReveal<HTMLDivElement>();

  return (
    <section id="contacto" className="section-v bg-ink-deep">
      <div ref={contentRef} className="reveal container-v flex flex-col items-center text-center">
        <span className="contacto-mark" aria-hidden="true">
          <CrystalV variant="mark" className="h-full w-full" />
        </span>

        <span className="eyebrow mt-6 text-on-dark-2">Empecemos</span>
        <h2 className="display-l mx-auto mt-4 max-w-[20ch] text-on-dark">
          Hagamos crecer tu negocio.
        </h2>
        <p className="body-l mx-auto mt-4 max-w-[48ch] text-on-dark-2">
          Primero analizamos tu negocio. Después armamos el plan.
        </p>

        <button
          type="button"
          onClick={handleContactCta}
          className="hero-cta contacto-cta mt-8 inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 font-medium text-ink"
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
