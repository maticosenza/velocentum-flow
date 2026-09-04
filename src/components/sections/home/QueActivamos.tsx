import { useEffect, useRef, useState } from "react";
import { CrystalFacetPiece } from "@/components/brand/CrystalFacetPiece";
import { SceneGuideFragment } from "@/components/scene/SceneGuideFragment";
import { u } from "@/components/scene/sceneUnits";
import { useReveal } from "@/hooks/useReveal";
import { useScrollRange } from "@/hooks/useScrollEngine";
import { cn } from "@/lib/utils";
import {
  QUE_ACTIVAMOS_ACTIVE_INDEX,
  QUE_ACTIVAMOS_CAPACIDADES,
  QUE_ACTIVAMOS_COPY,
  QUE_ACTIVAMOS_COPY_BOX,
  QUE_ACTIVAMOS_GUIDE_PATH,
  QUE_ACTIVAMOS_GUIDE_REST,
  QUE_ACTIVAMOS_RAIL,
  queActivamosRailOffset,
  type CapacidadDef,
} from "./queActivamosContent";

/**
 * Módulo de capacidad.
 *
 * EL ESTADO INACTIVO BAJA EL CONTENIDO, NO EL MÓDULO ENTERO: el texto va a .62 y
 * la pieza a .80, por separado. Con una opacidad global en el contenedor las
 * facetas más oscuras — Estrategia & Growth y Branding — desaparecían del todo
 * sobre el fondo.
 */
function CapacidadModule({ capacidad, active }: { capacidad: CapacidadDef; active: boolean }) {
  return (
    <article
      className={cn("scene-module", active && "scene-module-active")}
      style={{ left: u(capacidad.left) }}
    >
      {active && (
        // UN ÚNICO REFLEJO en toda la sección, recortado al módulo activo.
        // Coordinado con la entrada del módulo, no con el paso del fragmento.
        <span className="scene-module-sheen" aria-hidden="true">
          <span className="scene-module-sheen-band" />
        </span>
      )}
      <div className="scene-module-piece" aria-hidden="true">
        <CrystalFacetPiece index={capacidad.facet} className="scene-module-piece-svg" />
      </div>
      <span className="scene-module-num">{capacidad.numero}</span>
      <h3 className="scene-module-title">{capacidad.titulo}</h3>
      <p className="scene-module-text">{capacidad.texto}</p>
    </article>
  );
}

/**
 * Sección 06 — Qué activamos.
 *
 * Seis capacidades en carrusel, cortadas en ambos bordes: se lee que hay más de
 * las que entran. Una sola está activa — la combinación se elige, no se muestra
 * entera. Cada capacidad lleva una pieza volumétrica distinta del Crystal 5; los
 * objetos del sistema quedan asignados a la Sección 05.
 *
 * El fragmento guía NO ACTIVA, NO SEÑALA Y NO SELECCIONA nada acá: cruza el
 * canal en deriva lenta, más despacio que el carrusel, en una capa narrativa
 * independiente.
 *
 * Es una sección de SCROLL NORMAL, no un beat pinned.
 */
export function QueActivamos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useReveal<HTMLDivElement>();
  // El reflejo entra con el módulo, por IntersectionObserver: nunca queda atado
  // al progreso de scroll con el que se mueve el fragmento.
  const railRevealRef = useReveal<HTMLDivElement>({ delay: 160 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useScrollRange(sectionRef, (progress) => {
    if (reducedMotion || !railRef.current) return;
    railRef.current.style.transform = `translate3d(calc(${queActivamosRailOffset(progress).toFixed(2)} * var(--u)), 0, 0)`;
  });

  return (
    <section ref={sectionRef} className="scene-static" id="servicios">
      <div className="scene-canvas scene-canvas-static">
        <div
          ref={railRevealRef}
          className="scene-rail-viewport reveal"
          data-revealed="false"
          style={{ top: u(QUE_ACTIVAMOS_RAIL.top), height: u(QUE_ACTIVAMOS_RAIL.height) }}
        >
          <div ref={railRef} className="scene-rail">
            {QUE_ACTIVAMOS_CAPACIDADES.map((capacidad, index) => (
              <CapacidadModule
                key={capacidad.numero}
                capacidad={capacidad}
                active={index === QUE_ACTIVAMOS_ACTIVE_INDEX}
              />
            ))}
          </div>
        </div>

        {/* Corte en ambos bordes con máscara de degradado de 120 px. */}
        <div
          className="scene-rail-fade scene-rail-fade-left"
          style={{
            top: u(QUE_ACTIVAMOS_RAIL.fadeTop),
            height: u(QUE_ACTIVAMOS_RAIL.fadeHeight),
            width: u(QUE_ACTIVAMOS_RAIL.fade),
          }}
          aria-hidden="true"
        />
        <div
          className="scene-rail-fade scene-rail-fade-right"
          style={{
            top: u(QUE_ACTIVAMOS_RAIL.fadeTop),
            height: u(QUE_ACTIVAMOS_RAIL.fadeHeight),
            width: u(QUE_ACTIVAMOS_RAIL.fade),
          }}
          aria-hidden="true"
        />

        {/* Por encima del rail y de su máscara: el degradado no lo tapa. */}
        <SceneGuideFragment
          sectionRef={sectionRef}
          spec={QUE_ACTIVAMOS_GUIDE_PATH}
          restLocal={QUE_ACTIVAMOS_GUIDE_REST}
          zIndex={26}
        />

        <div
          ref={copyRef}
          className="scene-copy scene-copy-center reveal"
          data-revealed="false"
          style={{
            top: u(QUE_ACTIVAMOS_COPY_BOX.top),
            paddingInline: u(QUE_ACTIVAMOS_COPY_BOX.paddingInline),
          }}
        >
          <span className="scene-eyebrow scene-eyebrow-tight">{QUE_ACTIVAMOS_COPY.eyebrow}</span>
          <h2 className="scene-h2 scene-h2-module">
            {QUE_ACTIVAMOS_COPY.headlineBefore}
            <span className="scene-h2-accent">{QUE_ACTIVAMOS_COPY.headlineAccent}</span>
            {QUE_ACTIVAMOS_COPY.headlineAfter}
          </h2>
          <p
            className="scene-sub scene-sub-tight"
            style={{
              maxWidth: `${QUE_ACTIVAMOS_COPY.subtitleMeasureCh}ch`,
              marginInline: "auto",
            }}
          >
            {QUE_ACTIVAMOS_COPY.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
