import { useEffect, useRef, useState, type RefObject } from "react";
import { GuideFragment } from "@/components/brand/GuideFragment";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { useScrollRange } from "@/hooks/useScrollEngine";
import { scenePoseAt, type ScenePath } from "./scenePath";
import { u } from "./sceneUnits";

/**
 * El fragmento guía dentro de una sección de scroll normal (05, 06 y 07).
 *
 * Las Secciones 02 a 04 comparten un pin y un solo elemento; de la 05 en
 * adelante cada sección es independiente, así que cada una monta su propio
 * fragmento y lo mueve con su propio progreso. La CONTINUIDAD se mantiene igual:
 * cada tramo empieza y termina FUERA del lienzo de 1440 × 900, de modo que el
 * empalme entre secciones nunca se ve.
 *
 * Escribe únicamente `transform` y `opacity`, sin leer layout. Con
 * prefers-reduced-motion no se suscribe al scroll: pinta la pose aprobada del
 * mockup y se queda quieto.
 */
export function SceneGuideFragment({
  sectionRef,
  spec,
  restLocal = 0.5,
  opacity = 1,
  zIndex = 24,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  spec: ScenePath;
  /** Progreso local en el que el fragmento está en la pose aprobada del mockup. */
  restLocal?: number;
  opacity?: number;
  zIndex?: number;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const lastRef = useRef(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function write(local: number) {
    const node = nodeRef.current;
    if (!node) return;
    const pose = scenePoseAt(spec, local);
    const halfWidth = pose.width / 2;
    const halfHeight = guideFragmentHeight(pose.width) / 2;
    node.style.transform =
      `translate3d(calc(${(pose.x - halfWidth).toFixed(2)} * var(--u)), ` +
      `calc(${(pose.y - halfHeight).toFixed(2)} * var(--u)), 0) ` +
      `rotate(${pose.rotate.toFixed(2)}deg)`;
  }

  useEffect(() => {
    write(reducedMotion ? restLocal : 0);
    // La escritura inicial depende sólo del modo: el resto lo maneja el scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, restLocal]);

  useScrollRange(sectionRef, (progress) => {
    if (reducedMotion) return;
    if (progress === lastRef.current) return;
    lastRef.current = progress;
    write(progress);
  });

  return (
    <div className="scene-guide-field" style={{ zIndex }} aria-hidden="true">
      <div
        ref={nodeRef}
        className="scene-guide-node"
        style={{
          width: u(spec.width),
          height: u(guideFragmentHeight(spec.width)),
          opacity,
        }}
      >
        <GuideFragment className="scene-guide-svg" />
      </div>
    </div>
  );
}
