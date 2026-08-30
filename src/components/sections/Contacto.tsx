import { useReveal } from "@/hooks/useReveal";
import { CrystalV } from "@/components/brand/CrystalV";

// No hay backend de formulario, endpoint ni integración confirmados en
// este repo (se buscó mailto:/wa.me/tel: y ningún endpoint de envío — no
// existen). Por eso el submit de abajo es un preventDefault() que no
// manda nada a ningún lado todavía, en vez de inventar una acción real:
// cuando exista un canal/endpoint real, reemplazar handleSubmit.
// TODO(contacto): conectar al canal/endpoint real una vez definido.
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

type FieldDef = { id: string; label: string; type: "text" | "email" };

// Campos exactos aprobados — no agregar ni sacar ninguno.
const FIELDS: FieldDef[] = [
  { id: "nombre", label: "Nombre", type: "text" },
  { id: "empresa", label: "Empresa / Marca", type: "text" },
  { id: "web", label: "Web o Instagram", type: "text" },
  { id: "objetivo", label: "¿Qué querés hacer crecer?", type: "text" },
  { id: "medio", label: "Email o WhatsApp", type: "text" },
];

// Closes the arc opened by CrystalIntro (complete -> fracture -> scatter)
// and continued through Dolor1/Dolor2/Reveal (scatter -> gather ->
// assemble): this is the last time the Crystal V appears, already
// resolved, not fracturing or reassembling again. No facet scatter/convert
// choreography here on purpose — that gesture already happened in Reveal;
// repeating it would read as a new animation, not the same system's
// output. Just a settle (scale .88 -> 1, no overshoot) so it reads calm
// and controlled, then a thread grows down into the copy and form, so the
// form reads as this system's output rather than a form under a title.
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

        <form
          className="contacto-item contacto-form mt-10 w-full max-w-[480px] text-left"
          style={{ transitionDelay: "840ms" }}
          onSubmit={handleSubmit}
        >
          {FIELDS.map((field) => (
            <div key={field.id} className="contacto-field">
              <label htmlFor={field.id} className="label-mono text-on-dark-2">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                required
                className="contacto-input"
                autoComplete="off"
              />
            </div>
          ))}

          <button
            type="submit"
            className="hero-cta contacto-cta mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink px-6 py-3 font-medium text-ink"
          >
            Quiero analizar mi negocio
            <span className="hero-cta-arrow" style={{ color: "var(--ink)" }} aria-hidden="true">
              →
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
