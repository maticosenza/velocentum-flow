import { useEffect, useRef } from "react";
import { GuideFragment } from "@/components/brand/GuideFragment";
import { guideFragmentHeight } from "@/components/brand/guideFragmentGeometry";
import { useNarrativeContext } from "@/components/narrative/NarrativeSequence";
import { u } from "@/components/scene/sceneUnits";
import { guideFragmentPose } from "./guideFragmentPath";

/**
 * El fragmento guía compartido por las Secciones 02, 03 y 04.
 *
 * Es UN SOLO elemento del DOM, montado una vez y movido por el progreso global
 * de la secuencia: así la pieza que sale del Hero es literalmente la misma que
 * cruza las tres escenas siguientes. Los empalmes entre tramos ocurren fuera del
 * lienzo (ver guideFragmentPath.ts), de modo que nunca se ve un salto.
 *
 * Escribe únicamente `transform` y `opacity`, sin leer layout: el tamaño lo fija
 * el CSS en unidades del lienzo y la posición viaja en el propio transform.
 */
export function GuideFragmentStage() {
  const { subscribe } = useNarrativeContext();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const lastRef = useRef(-1);

  useEffect(() => {
    return subscribe((progress) => {
      if (progress === lastRef.current) return;
      lastRef.current = progress;
      const node = nodeRef.current;
      if (!node) return;

      const pose = guideFragmentPose(progress);
      if (!pose.active) {
        node.style.opacity = "0";
        return;
      }
      const halfWidth = pose.width / 2;
      const halfHeight = guideFragmentHeight(pose.width) / 2;
      node.style.opacity = "1";
      node.style.transform =
        `translate3d(calc(${(pose.x - halfWidth).toFixed(2)} * var(--u)), ` +
        `calc(${(pose.y - halfHeight).toFixed(2)} * var(--u)), 0) ` +
        `rotate(${pose.rotate.toFixed(2)}deg)`;
    });
  }, [subscribe]);

  const initial = guideFragmentPose(0);

  return (
    <div className="scene-canvas scene-canvas-overlay scene-guide-layer" aria-hidden="true">
      <div
        ref={nodeRef}
        className="scene-guide-node"
        style={{
          width: u(initial.width),
          height: u(guideFragmentHeight(initial.width)),
          opacity: 0,
        }}
      >
        <GuideFragment className="scene-guide-svg" />
      </div>
    </div>
  );
}
