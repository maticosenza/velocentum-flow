/**
 * Verificaciones del contrato de la API por faceta (comportamiento en runtime).
 * La exclusión por tipo de las claves 15 y 6 se verifica aparte, en type-contract.ts.
 */
import { resolve } from "node:path";
import { REPO_ROOT, parseSvg, renderMarkup, walk, type SvgNode } from "./lib.ts";

const mod = (await import(resolve(REPO_ROOT, "src/components/brand/CrystalFiveApproved.tsx"))) as Record<string, any>;
const Crystal = mod["CrystalFiveApproved"];
const IDENTITY = mod["CRYSTAL_PIECE_POSE_IDENTITY"];

let failures = 0;
const check = (name: string, ok: boolean, detail: string) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}\n      ${detail}`);
};

const shape = (markup: string): string =>
  walk(parseSvg(markup))
    .map((n) => `${n.tag}[${Object.keys(n.attrs).sort().join(",")}]`)
    .join(" ");

const pose = (over: Partial<Record<string, number>> = {}) => ({ ...IDENTITY, ...over });

const vacio = renderMarkup(Crystal, { control: {} });
const cargado = renderMarkup(Crystal, {
  control: {
    facetPoses: { 0: pose({ x: 12, rotate: 30 }), 7: pose({ opacity: 0 }), 17: pose({ scale: 0.4 }) },
    inclusionPoses: { 2: pose({ y: -8, opacity: 0.3 }) },
    guidePose: pose({ x: 5, y: -3, rotate: 12, scale: 1.2, opacity: 0.8 }),
    glowOpacity: 0.5,
    groundOpacity: 0.2258064516,
    edgesOpacity: 0.25,
  },
});

check(
  "el DOM con control no varía según qué poses se pasen",
  shape(vacio) === shape(cargado),
  `${shape(vacio).split(" ").length} nodos, misma forma en ambos renders`,
);

// --- fragmento guía: dos wrappers hermanos, mismo transform ------------------
const svg = parseSvg(cargado);
const wrappers = walk(svg).filter((n) => n.tag === "g" && n.attrs["transform"] !== undefined);
const guideFacetPoints = "139,102 164,89 193,116 117,166";
const guideInclusionPoints = "148,118 167,101 158,126";
const wrapperOf = (points: string): SvgNode | undefined =>
  wrappers.find((w) => w.children.some((c) => c.attrs["points"] === points));
const wFacet = wrapperOf(guideFacetPoints);
const wInclusion = wrapperOf(guideInclusionPoints);

check(
  "guía: faceta 15 e inclusión 6 comparten transform y opacity",
  !!wFacet &&
    !!wInclusion &&
    wFacet.attrs["transform"] === wInclusion.attrs["transform"] &&
    wFacet.attrs["opacity"] === wInclusion.attrs["opacity"],
  `${wFacet?.attrs["transform"]}  opacity=${wFacet?.attrs["opacity"]}`,
);
check(
  "guía: el origen es el centroide de FACETS[15] (153.25 118.25), no el de la inclusión",
  (wFacet?.attrs["transform"] ?? "").includes("153.25 118.25"),
  wFacet?.attrs["transform"] ?? "(sin wrapper)",
);

const indexOfNode = (node: SvgNode | undefined) => (node ? wrappers.indexOf(node) : -1);
check(
  "guía: wrappers HERMANOS, la inclusión no está anidada en la faceta",
  !!wFacet && !!wInclusion && !walk(wFacet).includes(wInclusion) && indexOfNode(wInclusion) === 24,
  `faceta en posición ${indexOfNode(wFacet)}, inclusión en ${indexOfNode(wInclusion)} de 25 (última)`,
);

// --- nada se ausenta del DOM -------------------------------------------------
const apagado = renderMarkup(Crystal, {
  control: {
    facetPoses: Object.fromEntries([...Array(18).keys()].filter((i) => i !== 15).map((i) => [i, pose({ opacity: 0 })])),
    inclusionPoses: Object.fromEntries([...Array(7).keys()].filter((i) => i !== 6).map((i) => [i, pose({ opacity: 0 })])),
    guidePose: pose({ opacity: 0 }),
    glowOpacity: 0,
    groundOpacity: 0,
    edgesOpacity: 0,
  },
});
const apagadoNodes = walk(parseSvg(apagado));
check(
  "todo apagado: las 25 piezas y las 3 capas siguen en el árbol",
  apagadoNodes.filter((n) => n.tag === "polygon").length === 25 && shape(apagado) === shape(vacio),
  `polígonos=${apagadoNodes.filter((n) => n.tag === "polygon").length}, misma forma de árbol que control vacío`,
);

// --- opacidades como factores ------------------------------------------------
const layerOpacityOf = (markup: string) => {
  const nodes = walk(parseSvg(markup));
  const glow = nodes.find((n) => n.tag === "path" && n.attrs["filter"]?.includes("cp-glow-"));
  const ground = nodes.find((n) => n.tag === "ellipse");
  const edges = nodes.find((n) => n.tag === "g" && n.attrs["fill"] === "none");
  return { glow: glow?.attrs["opacity"], ground: ground?.attrs["opacity"], edges: edges?.attrs["opacity"] };
};

const factor1 = layerOpacityOf(vacio);
check(
  "factor 1 devuelve exactamente el valor aprobado (0.28 / 0.62 / 1)",
  Number(factor1.glow) === 0.28 && Number(factor1.ground) === 0.62 && Number(factor1.edges) === 1,
  `glow=${factor1.glow} suelo=${factor1.ground} aristas=${factor1.edges}`,
);

const conFactores = layerOpacityOf(cargado);
check(
  "suelo: factor 0.2258064516 da la efectiva 0.14 del Mockup 09",
  Math.abs(Number(conFactores.ground) - 0.14) < 1e-9,
  `0.62 * 0.2258064516 = ${conFactores.ground}`,
);

const excedido = layerOpacityOf(renderMarkup(Crystal, { control: { glowOpacity: 4, groundOpacity: -2, edgesOpacity: 9 } }));
check(
  "los factores no pueden superar el original ni bajar de cero",
  Number(excedido.glow) === 0.28 && Number(excedido.ground) === 0 && Number(excedido.edges) === 1,
  `glow(4)=${excedido.glow} suelo(-2)=${excedido.ground} aristas(9)=${excedido.edges}`,
);

// --- el fillOpacity base del polígono nunca se toca --------------------------
const fillOpacities = (markup: string) =>
  walk(parseSvg(markup))
    .filter((n) => n.tag === "polygon")
    .map((n) => n.attrs["fill-opacity"])
    .join(",");
check(
  "el fillOpacity base de los polígonos no cambia con las poses ni con los factores",
  fillOpacities(vacio) === fillOpacities(cargado) && fillOpacities(vacio) === fillOpacities(apagado),
  fillOpacities(vacio),
);

// --- constantes exportadas ---------------------------------------------------
const c = mod as Record<string, any>;
check(
  "constantes de la coreografía",
  c["CRYSTAL_FIVE_FACET_COUNT"] === 18 &&
    c["CRYSTAL_FIVE_INCLUSION_COUNT"] === 7 &&
    c["GUIDE_FACET_INDEX"] === 15 &&
    c["GUIDE_INCLUSION_INDEX"] === 6 &&
    JSON.stringify(c["CRYSTAL_FIVE_T2_ARRIVING_FACETS"]) === "[1,7,10,11,16,17]" &&
    JSON.stringify(c["CRYSTAL_FIVE_T2_VISIBLE_FACETS"]) === "[1,7,10,11,15,16,17]" &&
    c["FACETS"][15].points === guideFacetPoints &&
    c["INCLUSIONS"][6].points === guideInclusionPoints &&
    c["CRYSTAL_FIVE_EDGE_PATHS"].length === 4,
  `18/7 piezas, guía 15/6, T2 llegan ${c["CRYSTAL_FIVE_T2_ARRIVING_FACETS"]?.length} y visibles ${c["CRYSTAL_FIVE_T2_VISIBLE_FACETS"]?.length}`,
);

console.log(`\n${failures === 0 ? "todas" : "faltan"}: ${failures} fallos`);
if (failures > 0) process.exit(1);
