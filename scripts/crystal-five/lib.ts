/**
 * Harness de verificación de CrystalFiveApproved.
 *
 * Reglas de diseño (a raíz de la auditoría del harness heredado):
 *  1. El BASELINE se materializa desde el commit 49fc3dc, nunca desde el working tree.
 *     Renderizar el working tree y llamarlo "baseline" produce un espejo, no una referencia.
 *  2. Los datos visuales se extraen del DOM RENDERIZADO, no del texto fuente. Un extractor
 *     por regex sobre el .tsx se rompe con cualquier refactor de sintaxis (tuplas, `as const`,
 *     ramas de JSX) y produciría falsos fallos.
 *  3. El hash publicado es siempre sha256 del CONTENIDO EXACTO del archivo de artefacto,
 *     para que `shasum -a 256 <archivo>` lo reproduzca sin conocer el harness.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement, type ComponentType, type CSSProperties } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const HERE = dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = resolve(HERE, "../..");
export const ARTIFACTS_DIR = resolve(HERE, "artifacts");
export const BASELINE_DIR = resolve(HERE, "baseline");

export const COMPONENT_PATH = "src/components/brand/CrystalFiveApproved.tsx";
export const BASELINE_COMMIT = "49fc3dc79a0a09761004fecaf5adfb676284e705";
/** git blob sha1 de COMPONENT_PATH en BASELINE_COMMIT: fija la procedencia del baseline. */
export const BASELINE_BLOB = "35dd78422808950292dd161a1d51c1a76e857a9d";

export const BASELINE_COMPONENT_FILE = resolve(BASELINE_DIR, "CrystalFiveApproved.baseline.tsx");

function git(args: string[]): string {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

/** Materializa un archivo tal como estaba en BASELINE_COMMIT. */
export function materializeFromBaseline(repoRelPath: string, outFile: string): string {
  const source = git(["show", `${BASELINE_COMMIT}:${repoRelPath}`]);
  mkdirSync(BASELINE_DIR, { recursive: true });
  const dest = resolve(BASELINE_DIR, outFile);
  writeFileSync(dest, source);
  return dest;
}

/**
 * Extrae `COMPONENT_PATH` tal como estaba en `BASELINE_COMMIT` y verifica su blob sha1.
 * Devuelve la ruta del archivo materializado.
 */
export function materializeBaselineComponent(): string {
  const dest = materializeFromBaseline(COMPONENT_PATH, "CrystalFiveApproved.baseline.tsx");
  const actualBlob = git(["hash-object", dest]).trim();
  if (actualBlob !== BASELINE_BLOB) {
    throw new Error(`blob del baseline ${actualBlob} != esperado ${BASELINE_BLOB}`);
  }
  return dest;
}

// ---------------------------------------------------------------------------
// Módulos materializados desde el commit
// ---------------------------------------------------------------------------

/** Props de los componentes de marca en 49fc3dc: ahí todavía no existía `control`. */
type BrandComponentProps = { className?: string; style?: CSSProperties };

/** La superficie que este harness consume de CrystalFiveApproved.tsx en 49fc3dc. */
export type BaselineCrystalModule = {
  CrystalFiveApproved: ComponentType<BrandComponentProps>;
  CrystalFiveFragmentsApproved: ComponentType<BrandComponentProps>;
};

/** Ídem para CrystalFragments.tsx en 49fc3dc. */
export type BaselineFragmentsModule = {
  CrystalFragments: ComponentType<BrandComponentProps & { layout?: string }>;
};

/**
 * Importa un módulo materializado y comprueba que exporte lo que se declara.
 *
 * El archivo se genera en runtime con `git show`, así que su tipo no se puede inferir
 * estáticamente. En vez de dejarlo en `any`, se declara la superficie esperada y se
 * verifica antes de devolverla: si el commit dejara de exportar alguno de esos nombres,
 * falla acá con un mensaje claro en vez de romper más adelante.
 */
async function importBaselineModule<T extends object>(
  file: string,
  exportNames: Array<keyof T>,
): Promise<T> {
  const loaded: unknown = await import(file);
  if (typeof loaded !== "object" || loaded === null) {
    throw new TypeError(`${file} no exporta un módulo`);
  }
  const record = loaded as Record<string, unknown>;
  for (const name of exportNames) {
    if (typeof record[String(name)] !== "function") {
      throw new TypeError(`${file} no exporta el componente ${String(name)}`);
    }
  }
  return loaded as T;
}

/** El CrystalFiveApproved.tsx de 49fc3dc, materializado y verificado. */
export function importBaselineCrystal(): Promise<BaselineCrystalModule> {
  return importBaselineModule<BaselineCrystalModule>(materializeBaselineComponent(), [
    "CrystalFiveApproved",
    "CrystalFiveFragmentsApproved",
  ]);
}

/** El CrystalFragments.tsx de 49fc3dc, materializado y verificado. */
export function importBaselineFragments(): Promise<BaselineFragmentsModule> {
  return importBaselineModule<BaselineFragmentsModule>(
    materializeFromBaseline(
      "src/components/brand/CrystalFragments.tsx",
      "CrystalFragments.baseline.tsx",
    ),
    ["CrystalFragments"],
  );
}

/** El fuente del componente en el working tree, para comparaciones de procedencia. */
export function currentComponentSource(): string {
  return readFileSync(resolve(REPO_ROOT, COMPONENT_PATH), "utf8");
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

/**
 * Render estático. Cada llamada a renderToStaticMarkup reinicia el contador de useId,
 * así que baseline y actual comparten el mismo uid y son comparables byte a byte.
 */
export function renderMarkup<P extends object>(component: ComponentType<P>, props?: P): string {
  return renderToStaticMarkup(createElement(component, props ?? ({} as P)));
}

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// ---------------------------------------------------------------------------
// Parser SVG mínimo sobre markup de React
// ---------------------------------------------------------------------------

export type SvgNode = {
  tag: string;
  attrs: Record<string, string>;
  children: SvgNode[];
};

const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z][a-zA-Z0-9-]*="[^"]*")*)\s*(\/?)>/g;
const ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"/g;

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  ATTR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ATTR_RE.exec(raw)) !== null) {
    attrs[match[1] as string] = match[2] as string;
  }
  return attrs;
}

/**
 * Parsea el markup a un árbol. Falla si queda un solo byte fuera de los tags
 * reconocidos: esa cobertura total es lo que hace confiable la extracción.
 */
export function parseSvg(markup: string): SvgNode {
  const root: SvgNode = { tag: "#root", attrs: {}, children: [] };
  const stack: SvgNode[] = [root];
  let cursor = 0;
  TAG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TAG_RE.exec(markup)) !== null) {
    if (match.index !== cursor) {
      const stray = markup.slice(cursor, match.index);
      throw new Error(
        `markup no cubierto por el parser en ${cursor}: ${JSON.stringify(stray.slice(0, 80))}`,
      );
    }
    cursor = match.index + match[0].length;

    const closing = match[1] === "/";
    const tag = match[2] as string;
    const selfClosing = match[4] === "/";
    const parent = stack[stack.length - 1] as SvgNode;

    if (closing) {
      if (parent.tag !== tag) {
        throw new Error(`cierre </${tag}> no coincide con <${parent.tag}>`);
      }
      stack.pop();
      continue;
    }

    const node: SvgNode = { tag, attrs: parseAttrs(match[3] ?? ""), children: [] };
    parent.children.push(node);
    if (!selfClosing) {
      stack.push(node);
    }
  }

  if (cursor !== markup.length) {
    throw new Error(
      `markup con cola sin parsear: ${JSON.stringify(markup.slice(cursor, cursor + 80))}`,
    );
  }
  if (stack.length !== 1) {
    throw new Error(
      `tags sin cerrar: ${stack
        .slice(1)
        .map((n) => n.tag)
        .join(", ")}`,
    );
  }
  const svg = root.children[0];
  if (!svg || svg.tag !== "svg" || root.children.length !== 1) {
    throw new Error("el markup no tiene un único <svg> raíz");
  }
  return svg;
}

/** Todos los descendientes en orden de documento, incluido el propio nodo. */
export function walk(node: SvgNode): SvgNode[] {
  const out: SvgNode[] = [node];
  for (const child of node.children) {
    out.push(...walk(child));
  }
  return out;
}

/** El uid que useId inyectó en los ids de defs, para poder normalizarlo. */
export function detectUid(svg: SvgNode): string {
  const withId = walk(svg).find(
    (n) => typeof n.attrs["id"] === "string" && n.attrs["id"].startsWith("cp-light-"),
  );
  if (!withId) {
    throw new Error("no se encontró el gradiente cp-light-<uid> para detectar el uid");
  }
  return (withId.attrs["id"] as string).slice("cp-light-".length);
}

// ---------------------------------------------------------------------------
// Datos visuales canónicos
// ---------------------------------------------------------------------------

export type PolygonData = {
  points: string;
  material: string;
  fill: string;
  fillOpacity: string;
  strokeWidth?: string;
  strokeOpacity?: string;
};

export type VisualData = {
  svg: Record<string, string>;
  defs: Array<{
    tag: string;
    id: string;
    attrs: Record<string, string>;
    children: Array<{ tag: string; attrs: Record<string, string> }>;
  }>;
  glow: Record<string, string>;
  ground: Record<string, string>;
  facetGroup: Record<string, string>;
  facets: PolygonData[];
  inclusions: PolygonData[];
  edgesGroup: Record<string, string>;
  edgePaths: string[];
  paintOrder: string[];
};

const FILL_URL_RE = /^url\(#cp-([a-z]+)-UID\)$/;

function normalizeAttrs(attrs: Record<string, string>, uid: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(attrs).sort()) {
    out[key] = (attrs[key] as string).split(uid).join("UID");
  }
  return out;
}

function polygonData(node: SvgNode, uid: string): PolygonData {
  const attrs = normalizeAttrs(node.attrs, uid);
  const fill = attrs["fill"] ?? "";
  const material = FILL_URL_RE.exec(fill)?.[1] ?? "";
  if (!material) {
    throw new Error(`fill de polígono no reconocido: ${fill}`);
  }
  const data: PolygonData = {
    points: attrs["points"] ?? "",
    material,
    fill,
    fillOpacity: attrs["fill-opacity"] ?? "",
  };
  if (attrs["stroke-width"] !== undefined) data.strokeWidth = attrs["stroke-width"];
  if (attrs["stroke-opacity"] !== undefined) data.strokeOpacity = attrs["stroke-opacity"];
  return data;
}

/**
 * Extrae los datos visuales efectivos del DOM renderizado.
 *
 * Se recorre en orden de documento y se ignora la anidación: así el mismo extractor
 * sirve para la rama sin control (polígonos sueltos) y para la rama con control
 * (polígonos dentro de wrappers <g>), y los datos del asset se comparan igual.
 */
export function extractVisualData(markup: string): VisualData {
  const svg = parseSvg(markup);
  const uid = detectUid(svg);
  const all = walk(svg);

  const defsNode = svg.children.find((n) => n.tag === "defs");
  if (!defsNode) throw new Error("falta <defs>");
  const defsSet = new Set(walk(defsNode));

  const defs = defsNode.children.map((node) => ({
    tag: node.tag,
    id: (node.attrs["id"] ?? "").split(uid).join("UID"),
    attrs: normalizeAttrs(node.attrs, uid),
    children: node.children.map((child) => ({
      tag: child.tag,
      attrs: normalizeAttrs(child.attrs, uid),
    })),
  }));

  const outside = all.filter((n) => !defsSet.has(n) && n !== svg);

  const polygons = outside.filter((n) => n.tag === "polygon");
  if (polygons.length !== 25) {
    throw new Error(`se esperaban 25 polígonos, hay ${polygons.length}`);
  }

  const paths = outside.filter((n) => n.tag === "path");
  if (paths.length !== 5) {
    throw new Error(`se esperaban 5 paths (1 glow + 4 aristas), hay ${paths.length}`);
  }
  const glowNode = paths[0] as SvgNode;
  const edgeNodes = paths.slice(1);

  const ellipseNode = outside.find((n) => n.tag === "ellipse");
  if (!ellipseNode) throw new Error("falta <ellipse> del suelo");

  const groups = outside.filter((n) => n.tag === "g");
  const facetGroupNode = groups.find(
    (n) => typeof n.attrs["filter"] === "string" && n.attrs["filter"].includes("cp-piece-"),
  );
  const edgesGroupNode = groups.find((n) => n.attrs["fill"] === "none");
  if (!facetGroupNode) throw new Error("falta el grupo de piezas (filter cp-piece)");
  if (!edgesGroupNode) throw new Error("falta el grupo de aristas (fill=none)");

  const paintOrder = outside
    .filter(
      (n) => n === glowNode || n === ellipseNode || n.tag === "polygon" || edgeNodes.includes(n),
    )
    .map((n) => {
      if (n === glowNode) return "glow";
      if (n === ellipseNode) return "ground";
      if (n.tag === "polygon") return polygons.indexOf(n) < 18 ? "facet" : "inclusion";
      return "edge";
    });

  return {
    svg: normalizeAttrs(svg.attrs, uid),
    defs,
    glow: normalizeAttrs(glowNode.attrs, uid),
    ground: normalizeAttrs(ellipseNode.attrs, uid),
    facetGroup: normalizeAttrs(facetGroupNode.attrs, uid),
    facets: polygons.slice(0, 18).map((n) => polygonData(n, uid)),
    inclusions: polygons.slice(18).map((n) => polygonData(n, uid)),
    edgesGroup: normalizeAttrs(edgesGroupNode.attrs, uid),
    edgePaths: edgeNodes.map((n) => n.attrs["d"] ?? ""),
    paintOrder,
  };
}

/** JSON estable: claves ordenadas en todo el árbol, 2 espacios, newline final. */
export function canonicalJson(value: unknown): string {
  const sortKeys = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(sortKeys);
    if (input && typeof input === "object") {
      const source = input as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(source).sort()) {
        out[key] = sortKeys(source[key]);
      }
      return out;
    }
    return input;
  };
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

// ---------------------------------------------------------------------------
// Fixture visual
// ---------------------------------------------------------------------------

/**
 * Fixture determinista para la captura con Playwright: viewport fijo, fondo fijo,
 * animaciones y transiciones desactivadas. El SVG no usa fuentes: no hay texto.
 */
export function visualFixtureHtml(svgMarkup: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; background: #0E0E13; }
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }
    .stage {
      width: 800px;
      height: 640px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stage svg { width: 500px; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="stage">${svgMarkup}</div>
</body>
</html>
`;
}

export const ARTIFACT_FILES = {
  commit: resolve(ARTIFACTS_DIR, "baseline-commit.txt"),
  dom: resolve(ARTIFACTS_DIR, "baseline-dom.html"),
  domHash: resolve(ARTIFACTS_DIR, "baseline-dom.sha256"),
  geometry: resolve(ARTIFACTS_DIR, "baseline-geometry.json"),
  geometryHash: resolve(ARTIFACTS_DIR, "baseline-geometry.sha256"),
  fixture: resolve(ARTIFACTS_DIR, "visual-fixture.html"),
} as const;
