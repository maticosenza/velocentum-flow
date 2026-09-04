import { useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CrystalFiveApproved } from "@/components/brand/CrystalFiveApproved";
import { HERO_CANVAS } from "./heroContent";
import { HERO_DUST_COUNT, HERO_TIMELINE, heroCrystalControl, heroDust } from "./heroChoreography";
import { HERO_ENTRY_DELAYS } from "./HeroComposition";

/** Por debajo de este paso de progreso local no hay re-render de las piezas. */
const PROGRESS_STEP = 1 / 2000;

type HeroCrystalProps = {
  /** Suscripción al progreso LOCAL del beat Hero (0 a 1), ya recortado por el llamador. */
  subscribe: (fn: (local: number) => void) => () => void;
};

/**
 * Rama Hero de CrystalStage: el Crystal 5 aprobado, pintado sobre el mismo
 * lienzo de 1440 × 900 unidades que HeroComposition, en la posición del stage
 * (470, 470, 500 px de referencia). Vive sólo mientras el beat activo es el
 * Hero: al terminar el beat todo salió de cuadro y la capa se oculta.
 *
 * Estados del plan, todos funciones puras del progreso local
 * (ver heroChoreography.ts):
 *   A — armado, entrada contenida (transición CSS al montar) y respiración
 *       mínima (animación CSS de transform, sólo mientras dura el estado A);
 *   B — explosión radial de las 17 facetas libres, tres planos, timings
 *       distintos; 12 salen de cuadro;
 *   C — polvo residual, 30 motas en una capa SVG liviana;
 *   D — FACETS[15] con INCLUSIONS[6] permanece y sale por el carril inferior
 *       derecho.
 *
 * Cómo llega el movimiento al DOM. La API por faceta de CrystalFiveApproved
 * es declarativa (`control` como prop), así que la pose de las piezas entra
 * por estado de React. Ese estado vive en ESTE componente hoja: el re-render
 * abarca sólo el SVG del Crystal 5, ocurre únicamente cuando el progreso
 * cuantizado cambia (nunca durante el asentamiento del lerp del motor) y se
 * commitea con flushSync dentro del mismo tick del rAF que las escrituras
 * directas del polvo, para que las capas no queden un frame desfasadas. No
 * se lee layout en ningún momento; sólo cambian transform y opacity.
 */
export function HeroCrystal({ subscribe }: HeroCrystalProps) {
  const gradientId = `hero-dust-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [progress, setProgress] = useState(0);
  const [play, setPlay] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const breathRef = useRef<HTMLDivElement | null>(null);
  const dustRefs = useRef<Array<SVGCircleElement | null>>([]);
  const lastLocalRef = useRef(-1);
  const lastQuantizedRef = useRef(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    return subscribe((local) => {
      // El motor sigue llamando con el mismo progreso mientras asienta el lerp.
      if (local === lastLocalRef.current) return;
      lastLocalRef.current = local;

      // Terminado el beat todo está fuera de cuadro: la capa no se pinta más.
      const layer = layerRef.current;
      if (layer) layer.style.visibility = local >= 1 ? "hidden" : "visible";

      // Respiración mínima sólo en estado A (armado).
      const breath = breathRef.current;
      if (breath) breath.classList.toggle("hero-stage-breathing", local <= HERO_TIMELINE.holdEnd);

      // Estado C — polvo: escritura directa al DOM, transform y opacity.
      const dust = heroDust(local);
      dustRefs.current.forEach((el, index) => {
        const mote = dust[index];
        if (!el || !mote) return;
        el.style.transform = `translate(${mote.x.toFixed(1)}px, ${mote.y.toFixed(1)}px) scale(${mote.scale.toFixed(2)})`;
        el.style.opacity = mote.opacity.toFixed(3);
      });

      // Estados B y D — piezas, por la API por faceta.
      const quantized = Math.round(local / PROGRESS_STEP) * PROGRESS_STEP;
      if (quantized === lastQuantizedRef.current) return;
      lastQuantizedRef.current = quantized;
      flushSync(() => setProgress(quantized));
    });
  }, [subscribe]);

  const control = useMemo(() => heroCrystalControl(progress), [progress]);

  return (
    <div
      ref={layerRef}
      className="hero-canvas hero-canvas-overlay hero-crystal-layer"
      aria-hidden="true"
    >
      <svg
        className="hero-dust"
        viewBox={`0 0 ${HERO_CANVAS.width} ${HERO_CANVAS.height}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop stopColor="#FFF7FA" />
            <stop offset=".4" stopColor="#FFB1CE" stopOpacity=".9" />
            <stop offset="1" stopColor="#FF4B8D" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: HERO_DUST_COUNT }, (_, index) => (
          <circle
            key={index}
            ref={(el) => {
              dustRefs.current[index] = el;
            }}
            r="1"
            fill={`url(#${gradientId})`}
            className="hero-dust-mote"
          />
        ))}
      </svg>

      <div
        className="hero-stage hero-stage-enter"
        data-revealed={play ? "true" : "false"}
        style={{ transitionDelay: `${HERO_ENTRY_DELAYS.stage}ms` }}
      >
        <div ref={breathRef} className="hero-stage-breath hero-stage-breathing">
          <CrystalFiveApproved control={control} className="hero-crystal-svg" />
        </div>
      </div>
    </div>
  );
}
