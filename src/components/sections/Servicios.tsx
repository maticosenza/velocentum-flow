import { useRef, type ComponentType } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CrystalV } from "@/components/brand/CrystalV";
import {
  ConnectedClusterIcon,
  FragmentClusterIcon,
  LightningIcon,
  PrismIcon,
  TargetStructureIcon,
} from "@/components/brand/motorIcons";

type Servicio = { name: string; text: string; Icon: ComponentType<{ className?: string }> };

// Six approved services, no seventh — tracking/medición is transversal to
// the whole operation (see Motores), not its own card here either.
// Object language deliberately overlaps with Motores where the capability
// does (Estrategia -> Prism, Web & Conversión -> Target, etc.): Motores
// explains how the team works, this section explains what gets activated,
// so reusing the same object per capability keeps one system legible
// instead of inventing a second icon language.
const SERVICIOS: Servicio[] = [
  {
    name: "Estrategia & Growth",
    text: "El plan que conecta objetivos de negocio con decisiones de marketing.",
    Icon: PrismIcon,
  },
  {
    name: "Contenido & Creatividad",
    text: "Piezas pensadas para cada plataforma, no un mismo asset reciclado.",
    Icon: FragmentClusterIcon,
  },
  {
    name: "Paid Media",
    text: "Presupuesto distribuido donde el dato dice que rinde, no donde parece.",
    Icon: LightningIcon,
  },
  {
    name: "Web & Conversión",
    text: "Sitios y fichas que le sacan fricción al camino de compra.",
    Icon: TargetStructureIcon,
  },
  {
    name: "Branding",
    text: "Una identidad que se sostiene igual en cada punto de contacto.",
    Icon: (props) => <CrystalV variant="object" {...props} />,
  },
  {
    name: "Influencer Marketing",
    text: "Voces reales para audiencias reales, no números inflados.",
    Icon: ConnectedClusterIcon,
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
        <span className="eyebrow text-on-dark-2">Qué activamos</span>
        <h2 className="display-l mx-auto mt-4 text-on-dark">
          Activamos lo que tu negocio
          <br />
          necesita para crecer.
        </h2>
        <p className="body-l mx-auto mt-4 max-w-[56ch] text-on-dark-2">
          No todos los negocios necesitan lo mismo. Primero entendemos dónde estás; después
          definimos qué capacidades activar.
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
