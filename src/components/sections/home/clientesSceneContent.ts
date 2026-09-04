// Sección 08 — Con quiénes trabajamos. GEOMETRÍA y copy aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/08-clientes-mockup-final.html.
//
// Los DOCE clientes con sus rutas de logo NO viven acá: siguen en
// src/components/sections/Clientes.tsx, que AGENTS.md fija como fuente
// funcional de ese dato.
//
// Medidas en píxeles del lienzo de referencia 1440 × 900.

import { easeInOutSine, easeOutCubic, type ScenePath } from "@/components/scene/scenePath";

export const CLIENTES_COPY = {
  eyebrow: "Con quiénes trabajamos",
  headline: "Detrás de cada una hay un plan escrito.",
} as const;

/** Copy centrado. Eyebrow en --ink-2 y headline en --ink: la sección es clara. */
export const CLIENTES_COPY_BOX = { top: 186, paddingInline: 72 } as const;

/**
 * ALTURA DE CONTENIDO, NO 100VH.
 *
 * La sección termina donde termina su contenido: el frame cierra en y=592 y
 * quedan 20 px de aire. El vacío inferior del PNG pertenece al lienzo aislado
 * de 900 px del mockup y NO existe en el sitio, así que el bloque siguiente
 * arranca inmediatamente después de estos 612.
 */
export const CLIENTES_CANVAS_HEIGHT = 612;

/**
 * El frame es una CARD, no una fila desnuda: le da al muro de logos estructura
 * de prueba de autoridad. Borde #E1DCE5 y sombra 0 16px 44px rgba(20,14,26,.07),
 * más presencia que el pase anterior, que sobre blanco puro casi no se percibía.
 */
export const CLIENTES_FRAME = {
  left: 72,
  top: 392,
  width: 1296,
  height: 200,
} as const;

/** Segundos de una vuelta completa del marquee. */
export const CLIENTES_MARQUEE_DURATION = 42;

/**
 * Pose aprobada del fragmento guía: left 1398, top 300, ancho 60.
 *
 * SE MANTIENE A 60 PX, por debajo de los 78–84 del resto del recorrido: el
 * container deja un gutter de 72 y con su tamaño habitual pisaría el frame.
 */
export const CLIENTES_GUIDE_BOX = { left: 1398, top: 300, width: 60 } as const;

/** La orientación más cercana a la vertical de todo el recorrido. */
export const CLIENTES_GUIDE_ROTATION = -6;

const KEY = {
  x: CLIENTES_GUIDE_BOX.left + CLIENTES_GUIDE_BOX.width / 2,
  y: CLIENTES_GUIDE_BOX.top + (CLIENTES_GUIDE_BOX.width * 90) / 88 / 2,
};

/**
 * Entra por el borde exterior superior con el que cerró la Sección 07 —que sale
 * por la derecha a y≈250 con rotación -10°— y DESCIENDE CASI VERTICALMENTE por
 * el gutter derecho, saliendo parcialmente de cuadro por el borde derecho.
 *
 * ZONA PROHIBIDA: todo el rectángulo del frame, x 72–1368 e y 392–592. El
 * recorrido se mantiene en x ≥ 1256 en su punto más a la izquierda y a partir
 * del reposo nunca baja de x=1398 en su borde izquierdo, así que no roza el
 * frame ni se superpone a un logo.
 *
 * TRAMO DE DESCANSO: la desaceleración del recorrido se expresa acá, no en el
 * ángulo. Amplitud mínima (≈150 px de deriva horizontal contra los 1760 de la
 * Sección 07), tramos casi rectos, y una velocidad angular de 5° en todo el
 * paso. La salida usa easeInOutSine en vez del easeInCubic de la 07: se va más
 * suave de lo que se fue de la sección anterior.
 */
export const CLIENTES_GUIDE_PATH: ScenePath = {
  width: CLIENTES_GUIDE_BOX.width,
  path: [
    {
      from: { x: 1286, y: -96 },
      c1: { x: 1330, y: 30 },
      c2: { x: 1394, y: 196 },
      to: KEY,
      sFrom: 0,
      sTo: 0.72,
    },
    {
      from: KEY,
      c1: { x: 1434, y: 470 },
      c2: { x: 1436, y: 600 },
      to: { x: 1434, y: 748 },
      sFrom: 0.72,
      sTo: 1,
    },
  ],
  timing: [
    { from: 0, to: 0.55, sFrom: 0, sTo: 0.72, ease: easeOutCubic },
    { from: 0.55, to: 1, sFrom: 0.72, sTo: 1, ease: easeInOutSine },
  ],
  rotation: [
    { s: 0, deg: -10 },
    { s: 0.72, deg: CLIENTES_GUIDE_ROTATION },
    { s: 1, deg: -5 },
  ],
};

/** Progreso local en el que el fragmento está en la pose aprobada del mockup. */
export const CLIENTES_GUIDE_REST = 0.55;
