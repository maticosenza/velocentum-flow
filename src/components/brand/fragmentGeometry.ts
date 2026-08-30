// Fragment silhouettes for Dolor 1 / Dolor 2 — the sixteen shard polygons
// are copied verbatim from the Asset Pack V2's fragment-cluster-board.svg
// (viewBox 0 0 280 240), not approximated as generic triangles/blobs. Each
// fragment keeps a fixed identity across both scenes: Dolor 1 renders them
// at these native board coordinates (already a natural, premium-quality
// scatter); Dolor 2 translates the same shapes toward one of three cluster
// anchors, computed below rather than hand-placed, so "the same pieces
// group up" is literally true of the geometry, not just the story.

export type FragmentTreatment = "solid" | "graded" | "translucent" | "dark";

export type FragmentDef = {
  points: string;
  treatment: FragmentTreatment;
  /** Which of the three Dolor 2 clusters this shard joins. */
  group: 0 | 1 | 2;
  centroid: { x: number; y: number };
  /** Dolor 2 translate delta (board units), from native position to cluster. */
  clusterDelta: { x: number; y: number };
};

export const FRAGMENT_VIEWBOX = "0 0 280 240";

type RawFragment = { points: string; treatment: FragmentTreatment; group: 0 | 1 | 2 };

const RAW: RawFragment[] = [
  { points: "30,35 42,27 48,42", treatment: "graded", group: 0 },
  { points: "66,22 82,20 76,38", treatment: "solid", group: 0 },
  { points: "106,13 124,34 98,36", treatment: "solid", group: 1 },
  { points: "150,37 160,28 168,44", treatment: "translucent", group: 1 },
  { points: "46,72 78,56 84,88 60,105", treatment: "graded", group: 0 },
  { points: "98,63 128,47 145,79 116,96", treatment: "dark", group: 0 },
  { points: "164,66 183,54 191,82", treatment: "translucent", group: 1 },
  { points: "211,62 230,52 236,76", treatment: "solid", group: 1 },
  { points: "29,120 50,110 57,134", treatment: "translucent", group: 0 },
  { points: "77,119 102,105 111,140 87,148", treatment: "dark", group: 2 },
  { points: "136,112 159,96 166,130", treatment: "graded", group: 2 },
  { points: "197,113 224,99 219,138", treatment: "solid", group: 1 },
  { points: "51,171 70,160 76,182", treatment: "solid", group: 2 },
  { points: "104,169 130,153 136,190 111,196", treatment: "translucent", group: 2 },
  { points: "158,174 180,157 190,186", treatment: "solid", group: 2 },
  { points: "220,170 239,159 245,181", treatment: "dark", group: 2 },
];

// Percentages match Dolor 2's connecting-line anchors (see DOLOR2_LINES) so
// the lines drawn between clusters land exactly on where the shards gather.
const CLUSTER_TARGETS: Record<0 | 1 | 2, { x: number; y: number }> = {
  0: { x: 26, y: 28 },
  1: { x: 72, y: 24 },
  2: { x: 42, y: 72 },
};
const VB_W = 280;
const VB_H = 240;

function centroidOf(points: string): { x: number; y: number } {
  const pairs = points.split(" ").map((p) => p.split(",").map(Number));
  const x = pairs.reduce((sum, [px]) => sum + (px ?? 0), 0) / pairs.length;
  const y = pairs.reduce((sum, [, py]) => sum + (py ?? 0), 0) / pairs.length;
  return { x, y };
}

function buildFragments(): FragmentDef[] {
  const withCentroid = RAW.map((f) => ({ ...f, centroid: centroidOf(f.points) }));

  const groupAverages: Record<0 | 1 | 2, { x: number; y: number }> = {
    0: { x: 0, y: 0 },
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
  };
  ([0, 1, 2] as const).forEach((g) => {
    const members = withCentroid.filter((f) => f.group === g);
    groupAverages[g] = {
      x: members.reduce((s, f) => s + f.centroid.x, 0) / members.length,
      y: members.reduce((s, f) => s + f.centroid.y, 0) / members.length,
    };
  });

  return withCentroid.map((f) => {
    const target = CLUSTER_TARGETS[f.group];
    const targetPx = { x: (target.x / 100) * VB_W, y: (target.y / 100) * VB_H };
    const avg = groupAverages[f.group];
    // Shrink each shard's offset from its group's average to 45% before
    // recentering on the cluster target — tightens the group without every
    // shard colliding at one exact point.
    const gatheredX = targetPx.x + (f.centroid.x - avg.x) * 0.45;
    const gatheredY = targetPx.y + (f.centroid.y - avg.y) * 0.45;
    return {
      ...f,
      clusterDelta: {
        x: gatheredX - f.centroid.x,
        y: gatheredY - f.centroid.y,
      },
    };
  });
}

export const FRAGMENTS: FragmentDef[] = buildFragments();
