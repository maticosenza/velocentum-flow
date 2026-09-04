import { useEffect, useRef, type RefObject } from "react";
import { useScrollSubscription } from "./useScrollEngine";

/**
 * Tema del nav: 0 = tratamiento oscuro, 1 = variante clara.
 *
 * EL NAV ES UN ÚNICO COMPONENTE Y SOLO CAMBIA DE TEMA. No hay un segundo nav ni
 * una variante alternativa: esto publica un número 0..1 y el nav interpola sus
 * estilos con él, conservando geometría, altura y padding.
 *
 * Vive en un store propio, minúsculo, en vez de en un contexto de React porque
 * el valor cambia por frame de scroll: el nav lo escribe como custom property y
 * nunca re-renderiza.
 */

type Listener = (value: number) => void;

let current = 0;
const listeners = new Set<Listener>();

export function subscribeNavLight(fn: Listener): () => void {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}

export function setNavLight(value: number): void {
  if (value === current) return;
  current = value;
  listeners.forEach((fn) => fn(value));
}

/**
 * Alto del nav aprobado. La línea de referencia del cruce es su borde inferior:
 * el tema cambia cuando el borde de la sección clara pasa POR DEBAJO del nav,
 * no cuando toca el borde del viewport.
 */
const NAV_REFERENCE_LINE = 80;

/**
 * Franja del cruce progresivo, en píxeles de scroll.
 *
 * EL CAMBIO NO PUEDE SER ABRUPTO. El nav es fijo y la Sección 08 es la única
 * clara de la HOME, así que la transición ocurre DOS VECES —al entrar y al
 * salir—: con un umbral simple de posición el cambio salta justo en el borde.
 */
const BAND = 100;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const RESIZE_DEBOUNCE_MS = 150;

/**
 * Declara que `ref` es una región clara: mientras atraviesa el nav, el nav usa
 * su variante clara.
 *
 * El scroll sigue viniendo ÚNICAMENTE de `useScrollEngine`. Las medidas de
 * layout se cachean en el montaje y en el resize, nunca dentro del callback de
 * scroll, igual que hace el propio motor.
 */
export function useNavLightRegion(ref: RefObject<HTMLElement | null>): void {
  const geometryRef = useRef({ top: 0, height: 0, reducedMotion: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function measure() {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      geometryRef.current = {
        top: rect.top + window.scrollY,
        height: rect.height,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
    }

    measure();

    let timer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(measure, RESIZE_DEBOUNCE_MS);
    }
    window.addEventListener("resize", onResize, { passive: true });

    // El alto del documento cambia cuando cargan los logos y las fuentes: sin
    // esto la posición cacheada quedaría corrida respecto del layout final.
    const observer = new ResizeObserver(onResize);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (timer !== null) clearTimeout(timer);
      // Al desmontar la región —cambio de ruta— el nav vuelve a oscuro.
      setNavLight(0);
    };
  }, [ref]);

  useScrollSubscription((state) => {
    const geometry = geometryRef.current;
    if (geometry.height === 0) return;
    const topInViewport = geometry.top - state.y;
    const bottomInViewport = topInViewport + geometry.height;
    // Cruce progresivo: sube al entrar el borde superior y baja al salir el
    // inferior, cada uno sobre su propia franja de BAND píxeles.
    const entering = clamp01((NAV_REFERENCE_LINE - topInViewport) / BAND);
    const leaving = clamp01((NAV_REFERENCE_LINE - bottomInViewport) / BAND);
    const light = clamp01(entering - leaving);
    // Con reduced motion no hay cruce: el tema cambia sin animación.
    setNavLight(geometry.reducedMotion ? (light >= 0.5 ? 1 : 0) : Number(light.toFixed(3)));
  });
}
