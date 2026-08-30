import { useEffect, useRef, type ComponentType } from "react";
import { beatVisibility } from "@/components/narrative/narrativeMotion";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { CrystalV } from "@/components/brand/CrystalV";
import {
  ConnectedClusterIcon,
  FragmentClusterIcon,
  LightningIcon,
  PrismIcon,
  TargetStructureIcon,
} from "@/components/brand/motorIcons";
import { BEATS } from "./poses";

type Servicio = { name: string; text: string; Icon: ComponentType<{ className?: string }> };

// Same six services/copy as the pre-V3 Servicios.tsx (staticFallback).
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

/**
 * Pinned-mode Servicios overlay: the four motor objects don't map 1:1 onto
 * six different services (a growth/paid/branding/influencer capability
 * set isn't "the same four things, rearranged"), so this beat crossfades
 * in as MotoresBeat crossfades out — the "relevo espacial" the V3
 * architecture calls for when objects are genuinely incompatible, not a
 * forced per-object morph.
 */
export function ServiciosBeat() {
  const { subscribe } = useNarrativeContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ isDown: false, moved: false });

  useEffect(() => {
    return subscribe((progress) => {
      const visibility = beatVisibility(progress, BEATS.servicios.start, BEATS.servicios.end);
      if (rootRef.current) rootRef.current.style.opacity = visibility.toFixed(3);
    });
  }, [subscribe]);

  // Same drag-to-scroll gesture as the pre-V3 Servicios/Trabajos tracks.
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
    <div ref={rootRef} className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="container-v text-center">
        <span className="eyebrow text-on-dark-2">Qué activamos</span>
        <h2 className="display-m mx-auto mt-3 text-on-dark">
          Activamos lo que tu negocio necesita para crecer.
        </h2>
        <p className="body-base mx-auto mt-3 max-w-[56ch] text-on-dark-2">
          No todos los negocios necesitan lo mismo. Primero entendemos dónde estás; después
          definimos qué capacidades activar.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="servicios-track-viewport mt-8"
        onMouseDown={handleMouseDown}
      >
        <div className="servicios-track">
          {SERVICIOS.map((servicio) => (
            <article key={servicio.name} className="servicios-card">
              <span className="servicios-icon" aria-hidden="true">
                <servicio.Icon className="h-full w-full" />
              </span>
              <h3 className="servicios-card-title text-on-dark">{servicio.name}</h3>
              <p className="servicios-card-text text-on-dark-2">{servicio.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
