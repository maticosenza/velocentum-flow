/**
 * Contrato verificado por el compilador. Cada `@ts-expect-error` FALLA la compilación si
 * el error que declara deja de producirse: es la prueba de que la adherencia del fragmento
 * guía y la inmutabilidad de los datos las garantiza el TIPO, no la disciplina del llamador.
 *
 * Se corre con: bun x tsc --noEmit -p scripts/crystal-five/tsconfig.contract.json
 */
import type { ComponentProps } from "react";
import {
  CrystalFiveApproved,
  CRYSTAL_FIVE_EDGE_PATHS,
  CRYSTAL_PIECE_POSE_IDENTITY,
  FACETS,
  INCLUSIONS,
  type CrystalFiveControl,
} from "../../src/components/brand/CrystalFiveApproved.tsx";

type Props = ComponentProps<typeof CrystalFiveApproved>;

// Identidad de DOM: omitir control. Modo controlado: control={{}}. Ambos válidos.
const sinControl: Props = { className: "x" };
const controlVacio: Props = { control: {} };

// El fragmento guía se mueve SOLO con guidePose.
const guiaOk: CrystalFiveControl = { guidePose: CRYSTAL_PIECE_POSE_IDENTITY };
const facetasNormales: CrystalFiveControl = {
  facetPoses: { 0: CRYSTAL_PIECE_POSE_IDENTITY, 14: CRYSTAL_PIECE_POSE_IDENTITY, 16: CRYSTAL_PIECE_POSE_IDENTITY },
  inclusionPoses: { 0: CRYSTAL_PIECE_POSE_IDENTITY, 5: CRYSTAL_PIECE_POSE_IDENTITY },
};

const facetaGuiaRechazada: CrystalFiveControl = {
  // @ts-expect-error FACETS[15] no se mueve por facetPoses: es guidePose
  facetPoses: { 15: CRYSTAL_PIECE_POSE_IDENTITY },
};

const inclusionGuiaRechazada: CrystalFiveControl = {
  // @ts-expect-error INCLUSIONS[6] no se mueve por inclusionPoses: es guidePose
  inclusionPoses: { 6: CRYSTAL_PIECE_POSE_IDENTITY },
};

const fueraDeRango: CrystalFiveControl = {
  // @ts-expect-error sólo hay 18 facetas: 0 a 17
  facetPoses: { 18: CRYSTAL_PIECE_POSE_IDENTITY },
};

const inclusionFueraDeRango: CrystalFiveControl = {
  // @ts-expect-error sólo hay 7 inclusiones: 0 a 6
  inclusionPoses: { 7: CRYSTAL_PIECE_POSE_IDENTITY },
};

// Los datos del asset son de sólo lectura desde afuera.
// @ts-expect-error FACETS es readonly
FACETS[0] = FACETS[1];
// @ts-expect-error los elementos de FACETS son readonly
FACETS[0].points = "0,0 1,1 2,2";
// @ts-expect-error FACETS es una tupla readonly: no tiene push
FACETS.push(FACETS[0]);
// @ts-expect-error INCLUSIONS es readonly
INCLUSIONS[0] = INCLUSIONS[1];
// @ts-expect-error CRYSTAL_FIVE_EDGE_PATHS es readonly
CRYSTAL_FIVE_EDGE_PATHS[0] = "M0 0";

void sinControl;
void controlVacio;
void guiaOk;
void facetasNormales;
void facetaGuiaRechazada;
void inclusionGuiaRechazada;
void fueraDeRango;
void inclusionFueraDeRango;
