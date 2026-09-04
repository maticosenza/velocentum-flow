/**
 * El fragmento guía de las Secciones 02, 03 y 04 (GuideFragment) tiene que ser
 * la MISMA pieza que `CrystalFiveFragmentsApproved` construye para la faceta 15,
 * más `INCLUSIONS[6]` adherida.
 *
 * GuideFragment redeclara los gradientes de material en vez de importarlos,
 * porque `CrystalFiveApproved.tsx` está bajo contrato verificado byte a byte y su
 * superficie pública está cerrada. Esta verificación es lo que impide que esa
 * copia se desincronice en silencio: compara geometría, material y opacidad
 * pieza por pieza contra el componente vecino, y los stops de cada gradiente
 * contra los del asset.
 */
import {
  CrystalFiveFragmentsApproved,
  FACETS,
  GUIDE_FACET_INDEX,
  GUIDE_INCLUSION_INDEX,
  INCLUSIONS,
} from "../../src/components/brand/CrystalFiveApproved.tsx";
import { GuideFragment } from "../../src/components/brand/GuideFragment.tsx";
import { parseSvg, renderMarkup, walk, type SvgNode } from "./lib.ts";

let failures = 0;
const check = (name: string, ok: boolean, detail: string) => {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"}  ${name}\n      ${detail}`);
};

/** "url(#cp-rose-_R_0_)" y "url(#gf-rose-_R_1_)" son el mismo material. */
function material(fill: string | undefined): string {
  const match = /url\(#(?:cp|gf)-([a-z]+)-/.exec(fill ?? "");
  return match?.[1] ?? fill ?? "";
}

type Piece = { tag: string; points: string; material: string; fillOpacity: string };

function pieces(nodes: SvgNode[]): Piece[] {
  return nodes
    .filter((n) => n.tag === "polygon" || n.tag === "path")
    .map((n) => ({
      tag: n.tag,
      points: n.attrs["points"] ?? n.attrs["d"] ?? "",
      material: material(n.attrs["fill"]),
      fillOpacity: n.attrs["fill-opacity"] ?? "",
    }));
}

// --- la pieza 15 tal como la construye el componente vecino -------------------
const neighbourMarkup = renderMarkup(CrystalFiveFragmentsApproved);
const neighbourGroups = walk(parseSvg(neighbourMarkup)).filter(
  (n) => n.tag === "g" && n.attrs["transform"] !== undefined,
);
const neighbourGroup = neighbourGroups[GUIDE_FACET_INDEX];
if (!neighbourGroup) throw new Error(`no hay grupo ${GUIDE_FACET_INDEX} en el componente vecino`);
const neighbourPieces = pieces(walk(neighbourGroup));

// --- el fragmento guía --------------------------------------------------------
const guideMarkup = renderMarkup(GuideFragment);
const guideSvg = parseSvg(guideMarkup);
const guidePieces = pieces(walk(guideSvg));

// La inclusión adherida es el único añadido: viaja con la faceta y el vecino no
// la dibuja, porque ese componente sólo pinta las 18 facetas.
const inclusion = INCLUSIONS[GUIDE_INCLUSION_INDEX];
const guideWithoutInclusion = guidePieces.filter((p) => p.points !== inclusion.points);
const guideInclusion = guidePieces.filter((p) => p.points === inclusion.points);

check(
  "misma cantidad de piezas que el grupo 15 del componente vecino",
  guideWithoutInclusion.length === neighbourPieces.length,
  `guía ${guideWithoutInclusion.length} (+1 inclusión) · vecino ${neighbourPieces.length}`,
);

const serialize = (list: Piece[]) =>
  list.map((p) => `${p.tag}|${p.points}|${p.material}|${p.fillOpacity}`).join("\n");
const guideSerialized = serialize(guideWithoutInclusion);
const neighbourSerialized = serialize(neighbourPieces);
check(
  "geometría, materiales y opacidades idénticos pieza por pieza",
  guideSerialized === neighbourSerialized,
  guideSerialized === neighbourSerialized
    ? `${guideWithoutInclusion.length} piezas coinciden exactamente`
    : `\n  guía  : ${guideSerialized.replace(/\n/g, "\n          ")}\n  vecino: ${neighbourSerialized.replace(/\n/g, "\n          ")}`,
);

check(
  "INCLUSIONS[6] adherida, con su material y su opacidad base",
  guideInclusion.length === 1 &&
    guideInclusion[0]?.material === inclusion.material &&
    Number(guideInclusion[0]?.fillOpacity) === inclusion.opacity,
  `${guideInclusion[0]?.points} · ${guideInclusion[0]?.material} · ${guideInclusion[0]?.fillOpacity}`,
);

check(
  "la cara principal usa la geometría y la opacidad de FACETS[15]",
  guidePieces.some(
    (p) =>
      p.points === FACETS[GUIDE_FACET_INDEX].points &&
      p.material === FACETS[GUIDE_FACET_INDEX].material &&
      Number(p.fillOpacity) === FACETS[GUIDE_FACET_INDEX].opacity,
  ),
  `${FACETS[GUIDE_FACET_INDEX].points} · ${FACETS[GUIDE_FACET_INDEX].material} · ${FACETS[GUIDE_FACET_INDEX].opacity}`,
);

// --- los gradientes redeclarados tienen que coincidir con los del asset --------
function gradientStops(markup: string, prefix: string): Map<string, string> {
  const out = new Map<string, string>();
  const nodes = walk(parseSvg(markup));
  for (const node of nodes) {
    if (node.tag !== "linearGradient" && node.tag !== "radialGradient") continue;
    const id = node.attrs["id"] ?? "";
    const match = new RegExp(`^${prefix}-([a-z]+)-`).exec(id);
    if (!match?.[1]) continue;
    const stops = node.children
      .map((stop) =>
        [
          stop.attrs["offset"] ?? "0",
          stop.attrs["stop-color"],
          stop.attrs["stop-opacity"] ?? "1",
        ].join(":"),
      )
      .join(",");
    out.set(
      match[1],
      `${node.attrs["x1"]},${node.attrs["y1"]},${node.attrs["x2"]},${node.attrs["y2"]}|${stops}`,
    );
  }
  return out;
}

const assetGradients = gradientStops(neighbourMarkup, "cp");
const guideGradients = gradientStops(guideMarkup, "gf");
const mismatched: string[] = [];
for (const [name, definition] of guideGradients) {
  const reference = assetGradients.get(name);
  if (reference !== definition)
    mismatched.push(`${name}\n        guía  ${definition}\n        asset ${reference}`);
}
check(
  `los ${guideGradients.size} gradientes redeclarados son los del asset`,
  mismatched.length === 0 && guideGradients.size > 0,
  mismatched.length === 0
    ? [...guideGradients.keys()].sort().join(", ")
    : mismatched.join("\n      "),
);

console.log(`\n${failures === 0 ? "todas" : "faltan"}: ${failures} fallos`);
if (failures > 0) process.exit(1);
