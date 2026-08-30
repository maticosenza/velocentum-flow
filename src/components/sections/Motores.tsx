import { CrystalV } from "@/components/brand/CrystalV";
import { useReveal } from "@/hooks/useReveal";

type Motor = { name: string; text: string };

// Copy grounded in what's already established elsewhere in the site, not
// invented for this section: Estrategia/Contenido/Pauta/Medición are the
// same four terms from the Hero subtitle and pill labels, and each line
// below reuses or lightly adapts an existing sentence (Hero subtitle,
// Trabajos headline, the old Servicios card copy) instead of introducing
// new claims. The Plan Maestro PDF that presumably names these engines in
// more detail wasn't accessible in this session — see the PR/handoff notes.
const MOTORES: Motor[] = [
  {
    name: "Estrategia",
    text: "Primero entendemos el negocio. Después armamos el plan.",
  },
  {
    name: "Contenido",
    text: "Piezas pensadas para pautar, no para llenar el feed.",
  },
  {
    name: "Pauta",
    text: "Campañas que se miden por venta real, no por clics.",
  },
  {
    name: "Medición",
    text: "Un mismo tablero para ver qué está funcionando y qué no.",
  },
];

function MotorCard({ motor, index }: { motor: Motor; index: number }) {
  const cardRef = useReveal<HTMLDivElement>({ delay: index * 90 });

  return (
    <article ref={cardRef} className="motores-card reveal">
      <span className="motores-icon" aria-hidden="true">
        <CrystalV variant="mark" className="h-full w-full" />
      </span>
      <h3 className="motores-card-title text-on-dark">{motor.name}</h3>
      <p className="motores-card-text text-on-dark-2">{motor.text}</p>
    </article>
  );
}

export function Motores() {
  const headingRef = useReveal<HTMLDivElement>();

  return (
    <section className="section-v bg-ink-deep">
      <div className="container-v text-center">
        <div ref={headingRef} className="reveal" data-revealed="false">
          <span className="eyebrow text-on-dark-2">Cómo trabajamos</span>
          <h2 className="display-l motores-headline mx-auto mt-4 text-on-dark">
            Un equipo, cuatro motores
            <br />
            funcionando juntos.
          </h2>
          <p className="body-l mx-auto mt-4 max-w-[52ch] text-on-dark-2">
            Estrategia, contenido, pauta y medición no se activan por separado.
          </p>
        </div>

        <div className="motores-grid mt-16">
          <div className="motores-spine" aria-hidden="true" />
          {MOTORES.map((motor, i) => (
            <MotorCard key={motor.name} motor={motor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
