import { useRef, type ComponentType } from "react";
import { useReveal } from "@/hooks/useReveal";
import {
  FragmentClusterIcon,
  LightningIcon,
  PrismIcon,
  TargetStructureIcon,
} from "@/components/brand/motorIcons";

type Servicio = { name: string; text: string; Icon: ComponentType<{ className?: string }> };

// Cuatro motores, no seis capacidades. La Sección 06 "Qué activamos" se
// absorbió dentro de la Sección 05 "Cómo trabajamos": Branding quedó dentro
// de Creatividad e Influencer Marketing sale del sitio por ahora. Estos son
// los mismos cuatro motores que define Motores.tsx, con el mismo lenguaje de
// objetos por motor, para que el sistema se lea como uno solo.
const SERVICIOS: Servicio[] = [
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

function ServicioCard({ servicio, index }: { servicio: Servicio; index: number }) {
  const cardRef = useReveal<HTMLDivElement>({ delay: index * 70 });
  const { Icon } = servicio;

  return (
    <article ref={cardRef} className="servicios-card reveal">
      <span className="servicios-icon" aria-hidden="true">
        <Icon className="h-full w-full" />
      </span>
      <h3 className="servicios-card-title text-on-dark">{servicio.name}</h3>
      <p className="servicios-card-text text-on-dark-2">{servicio.text}</p>
    </article>
  );
}

export function Servicios() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ isDown: false, moved: false });

  // Same drag-to-scroll gesture as Trabajos' video track — one proven
  // interaction pattern for every horizontal module row on the page,
  // instead of a second one invented just for this section.
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const startX = e.clientX;
    const scrollLeftStart = viewport.scrollLeft;
    dragRef.current = { isDown: true, moved: false };
    viewport.dataset["dragging"] = "true";

    function handleMove(ev: MouseEvent) {
      if (!dragRef.current.isDown || !viewport) return;
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 5) dragRef.current.moved = true;
      viewport.scrollLeft = scrollLeftStart - dx;
    }

    function handleUp() {
      dragRef.current.isDown = false;
      if (viewport) delete viewport.dataset["dragging"];
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  return (
    <section className="section-v bg-ink-deep">
      <div className="container-v text-center">
        <span className="eyebrow text-on-dark-2">Cómo trabajamos</span>
        <h2 className="display-l mx-auto mt-4 text-on-dark">
          Un equipo. Cuatro motores
          <br />
          funcionando juntos.
        </h2>
        <p className="body-l mx-auto mt-4 max-w-[56ch] text-on-dark-2">
          No son áreas separadas que se pasan el trabajo. Es un mismo equipo empujando desde cuatro
          lados.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="servicios-track-viewport mt-16"
        onMouseDown={handleMouseDown}
      >
        <div className="servicios-track">
          {SERVICIOS.map((servicio, i) => (
            <ServicioCard key={servicio.name} servicio={servicio} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
