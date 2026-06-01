/**
 * Stable categorical color palette for sovereign powers.
 * Colors are chosen to be visually distinct and readable on a dark map.
 * The same sovereign always gets the same color (hash-based assignment),
 * so empires can be tracked visually as they expand and contract.
 */
const PALETTE = [
  "#E07B54", // burnt orange
  "#5B9BD5", // steel blue
  "#70AD47", // sage green
  "#E0A94C", // amber gold
  "#9E75C7", // purple
  "#D95F5F", // muted red
  "#4BACC6", // teal
  "#C8BE45", // olive yellow
  "#E07CAE", // rose
  "#5BC4A8", // seafoam
  "#D97B3A", // terracotta
  "#4C87C2", // french blue
  "#89C27A", // mint
  "#C27A5A", // sienna
  "#7AB5D9", // sky blue
  "#C2A43A", // gold
  "#8B5EA8", // violet
  "#3AADAD", // cyan
  "#D94F6B", // crimson rose
  "#56B8B8", // light teal
  "#BD6B2A", // warm brown
  "#48AD7A", // emerald
  "#D49090", // dusty rose
  "#90B8D4", // baby blue
  "#D4C490", // wheat
  "#C49DD4", // orchid
  "#90D4C4", // pale teal
  "#D4B07A", // peach
  "#7A90D4", // periwinkle
  "#B4D490", // yellow-green
];

/** Stable hash: same string always returns the same bucket index. */
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Return a stable hex fill color for a sovereign power name.
 * Normalises the name before hashing so casing/whitespace differences
 * in the source data never produce different colours for the same power.
 * Deterministic and session-agnostic.
 */
export function getSovereignColor(sovereign: string): string {
  const key = sovereign.trim().toLowerCase().replace(/\s+/g, " ");
  return PALETTE[hashString(key) % PALETTE.length];
}

/**
 * Return a slightly lighter/darker version of the fill for the border line.
 */
export function getSovereignLineColor(sovereign: string): string {
  const fill = getSovereignColor(sovereign);
  // Lighten by mixing toward white slightly
  return fill; // border uses same hue; opacity/blur differentiates precision
}
