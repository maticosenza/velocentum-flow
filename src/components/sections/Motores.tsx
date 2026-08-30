import { useReveal } from "@/hooks/useReveal";
import {
  BarsMotif,
  FragmentClusterIcon,
  LightningIcon,
  PrismIcon,
  TargetStructureIcon,
} from "@/components/brand/motorIcons";
import type { ComponentType } from "react";

type Motor = { name: string; text: string; Icon: ComponentType<{ className?: string }> };

// Four motors, not seven cards, not the old "Servicios" list — Motores
// explains how the team works, Servicios (its own section, see
// Servicios.tsx) explains what capabilities exist. Medición is
// deliberately not a fifth motor here: it's the transversal layer,
// expressed as the Bars motif running behind all four instead of its own
// card (see .motores-bars).
const MOTORES: Motor[] = [
  {
    name: "Estrategia",
    text: "Primero entendemos el negocio. Después armamos el plan.",
    Icon: PrismIcon,
  },
  {
    name: "Creatividad",
    text: "Piezas pensadas para funcionar, no solo para llenar el feed.",
    Icon: FragmentClusterIcon,
  },
  {
    name: "Adquisición",
    text: "Campañas que se miden por venta real, no por clics.",
    Icon: LightningIcon,
  },
  {
    name: "Web & Conversión",
    text: "Sitios y fichas pensados para convertir, no solo para existir.",
    Icon: TargetStructureIcon,
  },
];

function MotorCard({ motor, index }: { motor: Motor; index: number }) {
  const cardRef = useReveal<HTMLDivElement>({ delay: index * 90 });
  const { Icon } = motor;

  return (
    <article ref={cardRef} className="motores-card reveal">
      <span className="motores-icon" aria-hidden="true">
        <Icon className="h-full w-full" />
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
            Un equipo. Cuatro motores
            <br />
            funcionando juntos.
          </h2>
          <p className="body-l mx-auto mt-4 max-w-[56ch] text-on-dark-2">
            Estrategia, creatividad, adquisición y web &amp; conversión no se activan por separado.
            Medición los conecta a todos.
          </p>
        </div>

        <div className="motores-grid mt-16">
          {MOTORES.map((motor, i) => (
            <MotorCard key={motor.name} motor={motor} index={i} />
          ))}
          {/* Medición as a dedicated transversal strip under all four
              motors — not behind their text (an overlay there either hid
              behind the cards' opaque background or fought their
              legibility) and not a fifth card of its own. */}
          <div className="motores-bars-row" aria-hidden="true">
            <BarsMotif className="motores-bars" />
          </div>
        </div>
      </div>
    </section>
  );
}
