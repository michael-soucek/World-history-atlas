/**
 * Draws a game result as a 1200×630 PNG (the size social sites preview),
 * in the site's night palette, for "Share image" and "Save image".
 */
export interface ShareImageSpec {
  game: string;
  /** e.g. "Daily #12" or "Practice". */
  edition: string;
  score: string;
  /** e.g. "/ 5,000", or "" for a streak. */
  outOf: string;
  rank: string;
  /** One square per round, as CSS colours. */
  tiles: string[];
  url: string;
}

/** The font a page element actually renders with (next/font gives hashed family names). */
function fontOf(selector: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const el = document.querySelector(selector);
  return el ? getComputedStyle(el).fontFamily : fallback;
}

export async function drawShareImage(spec: ShareImageSpec): Promise<Blob | null> {
  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  await document.fonts?.ready;
  const display = fontOf(".font-display", "Georgia, serif");
  const mono = fontOf(".font-mono, .label", "ui-monospace, monospace");

  // Night background with a faint graticule, like the map.
  ctx.fillStyle = "#0b1424";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(159,183,255,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const left = 80;
  ctx.fillStyle = "#9fb7ff";
  ctx.font = `500 22px ${mono}`;
  ctx.fillText(`BORDERS OF TIME  ·  ${spec.edition.toUpperCase()}`, left, 100);

  ctx.fillStyle = "#eef0f2";
  ctx.font = `400 64px ${display}`;
  ctx.fillText(spec.game, left, 180);

  ctx.font = `300 150px ${display}`;
  ctx.fillText(spec.score, left, 340);
  const scoreW = ctx.measureText(spec.score).width;
  if (spec.outOf) {
    ctx.fillStyle = "rgba(238,240,242,0.4)";
    ctx.font = `300 56px ${display}`;
    ctx.fillText(` ${spec.outOf}`, left + scoreW, 340);
  }

  ctx.fillStyle = "#eef0f2";
  ctx.font = `italic 400 40px ${display}`;
  ctx.fillText(spec.rank, left, 410);

  const size = Math.min(72, (W - left * 2 - (spec.tiles.length - 1) * 14) / Math.max(1, spec.tiles.length));
  spec.tiles.forEach((c, i) => {
    ctx.fillStyle = c;
    const x = left + i * (size + 14);
    ctx.beginPath();
    ctx.roundRect?.(x, 460, size, size, 8);
    if (!ctx.roundRect) ctx.rect(x, 460, size, size);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(238,240,242,0.55)";
  ctx.font = `500 22px ${mono}`;
  ctx.textAlign = "right";
  ctx.fillText(spec.url, W - left, H - 50);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
