// Sección 01 — Hero. Copy, CTA, píldoras y geometría aprobados en
// docs/PLAN_MAIN_HOME.txt (bloque MOCKUP APROBADO, 2026-08-31) y en
// docs/home-mockups/01-hero-mockup-final.html.
//
// Es el ÚNICO lugar donde viven estos datos: los consumen tanto el fallback
// estático (src/components/hero/Hero.tsx) como el beat pinned
// (sequenceA/HeroBeat.tsx) a través de HeroComposition. Un cambio de copy o
// de píldora se hace una sola vez, acá.
//
// Todas las medidas están en píxeles del viewport de referencia 1440 × 900.
// En render se multiplican por la unidad CSS `--u` (ver .hero-canvas en
// styles.css): a 1440 × 900 valen exactamente lo que dice el mockup y por
// encima escalan en proporción.

import { PILL_CAPABILITIES, PILL_SVG, type PillId } from "@/components/scene/pillCatalog";
import { u } from "@/components/scene/sceneUnits";

export const HERO_COPY = {
  eyebrow: "Equipo de crecimiento",
  headlineLine1: "Estamos en el negocio de",
  /** Va en --pink. El punto final que la sigue queda en blanco, fuera del acento. */
  headlineLine2Accent: "hacer crecer negocios",
  subtitle:
    "Estrategia, creatividad, adquisición y medición. Primero analizamos tu negocio. Después armamos el plan.",
} as const;

export const HERO_CTAS = {
  primary: { label: "Hablemos", to: "/", hash: "contacto" },
  secondary: { label: "Ver método", to: "/metodo" },
} as const;

/** Lienzo de referencia del mockup. */
export const HERO_CANVAS = { width: 1440, height: 900 } as const;

/** Stage de Crystal 5: 500 px de ancho, centrado en x=720, y=470, base en y≈853. */
export const HERO_STAGE = {
  left: 470,
  top: 470,
  width: 500,
  /** viewBox 0 0 240 184 → 500 × 383.33 */
  height: (500 * 184) / 240,
} as const;

/** Zona protegida del copy: ninguna píldora ni el fragmento guía la invaden. */
export const HERO_COPY_ZONE = { left: 195, top: 112, right: 1245, bottom: 464 } as const;

/** Origen de la explosión radial, ≈ centro del Crystal 5 en pantalla. */
export const HERO_EXPLOSION_ORIGIN = { x: 720, y: 662 } as const;

/**
 * Trayectoria aprobada del fragmento guía dentro del Hero: desde su centroide
 * (789, 715) hacia (1258, 884) por una curva suave (control points del HTML
 * del mockup), y desde ahí sale de cuadro por el carril inferior derecho
 * (x 1150–1370), reservado para su recorrido en las secciones siguientes.
 */
export const HERO_GUIDE_PATH = {
  start: { x: 789, y: 715 },
  control1: { x: 900, y: 762 },
  control2: { x: 1060, y: 812 },
  end: { x: 1258, y: 884 },
  /** Prolongación por el carril hasta quedar completamente fuera del lienzo. */
  exitControl1: { x: 1322, y: 908 },
  exitControl2: { x: 1350, y: 985 },
  exit: { x: 1342, y: 1064 },
} as const;

export type HeroPillPlane = "far" | "mid" | "near";
export type HeroPillSide = "left" | "right";

export type HeroPillDef = {
  id: PillId;
  label: string;
  /** Glifo del icono tal como está en official/pills/<id>.svg. */
  icon: string;
  plane: HeroPillPlane;
  side: HeroPillSide;
  /** Distancia al borde `side` del lienzo, en px de referencia. */
  inset: number;
  top: number;
  width: number;
  rotate: number;
};

/** Sólo la disposición: la etiqueta y el icono salen del catálogo compartido. */
type HeroPillLayout = Omit<HeroPillDef, "label" | "icon">;

/**
 * Tres planos de profundidad aprobados. El plano lejano queda aprobado como
 * elemento atmosférico aunque su texto no sea del todo legible: no se sube la
 * opacidad ni se baja el blur para forzar legibilidad.
 */
export const HERO_PILL_PLANES: Record<
  HeroPillPlane,
  { opacity: number; blur: number; parallax: number }
> = {
  far: { opacity: 0.32, blur: 2.5, parallax: 18 },
  mid: { opacity: 0.6, blur: 0, parallax: 36 },
  near: { opacity: 0.9, blur: 0, parallax: 58 },
};

/** Orden de entrada: primero el plano lejano, después el medio, al final el cercano. */
const HERO_PILL_LAYOUT: readonly HeroPillLayout[] = [
  { id: "strategy", plane: "far", side: "left", inset: 60, top: 470, width: 190, rotate: -7 },
  { id: "analysis", plane: "far", side: "right", inset: 66, top: 442, width: 180, rotate: 6 },
  { id: "content", plane: "mid", side: "left", inset: 96, top: 620, width: 210, rotate: 4 },
  { id: "acquisition", plane: "mid", side: "right", inset: 104, top: 656, width: 205, rotate: -5 },
  { id: "web", plane: "near", side: "left", inset: 232, top: 786, width: 195, rotate: -3 },
  { id: "design", plane: "near", side: "right", inset: 60, top: 736, width: 188, rotate: 5 },
];

export const HERO_PILLS: readonly HeroPillDef[] = HERO_PILL_LAYOUT.map((layout) => ({
  ...layout,
  label: PILL_CAPABILITIES[layout.id].label,
  icon: PILL_CAPABILITIES[layout.id].icon,
}));

/**
 * Geometría del SVG oficial de píldora. Vive en el catálogo compartido: la usan
 * también las Secciones 02 y 03.
 */
export const HERO_PILL_SVG = PILL_SVG;

export { u };
