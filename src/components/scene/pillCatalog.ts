// Catálogo único de las seis píldoras de capacidad del sistema.
//
// Es la ÚNICA fuente de las etiquetas y de los glifos de icono: los consumen
// el Hero (Sección 01), El problema (02) y El otro problema (03). Cada sección
// aporta solamente su propia disposición — posición, plano y rotación —, nunca
// vuelve a escribir la etiqueta ni el icono.
//
// Los seis SVG maestros de public/brand-approved/official/pills/ quedan
// INTACTOS. De ellos salen la geometría (cápsula, aro e icono) y el glifo; la
// palabra se tipografía en HTML con Manrope 700 encima, porque el `font-family`
// "Arial" embebido en los maestros rompería la tipografía del sitio.

export type PillId = "strategy" | "analysis" | "content" | "acquisition" | "web" | "design";

export type PillCapability = {
  id: PillId;
  label: string;
  /** Glifo tal cual está en el <text> del icono de official/pills/<id>.svg. */
  icon: string;
};

export const PILL_CAPABILITIES: Readonly<Record<PillId, PillCapability>> = {
  strategy: { id: "strategy", label: "ESTRATEGIA", icon: "◉" },
  analysis: { id: "analysis", label: "ANÁLISIS", icon: "◎" },
  content: { id: "content", label: "CONTENIDO", icon: "▣" },
  acquisition: { id: "acquisition", label: "ADQUISICIÓN", icon: "ϟ" },
  web: { id: "web", label: "WEB", icon: "▤" },
  design: { id: "design", label: "DISEÑO", icon: "⌘" },
};

/** Geometría del SVG oficial de píldora (official/pills/*.svg, viewBox 0 0 300 72). */
export const PILL_SVG = {
  viewBox: "0 0 300 72",
  width: 300,
  height: 72,
  /** El <text> de la etiqueta empieza en x=72 y su font-size es 18. */
  labelLeftRatio: 72 / 300,
  labelFontRatio: 18 / 300,
  /** letter-spacing .4 sobre 18 px. */
  labelLetterSpacingEm: 0.4 / 18,
} as const;

/** Alto de una píldora, en las mismas unidades del lienzo que su ancho. */
export function pillHeight(width: number): number {
  return (width * PILL_SVG.height) / PILL_SVG.width;
}
