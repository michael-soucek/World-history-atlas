/**
 * Wikimedia Commons thumbnails are served at fixed widths. For a thumbnail URL
 * like ".../960px-Name.jpg", offer the smaller standard widths too so phones
 * and small cards don't download the large one. Never offers anything wider
 * than the URL we were given (Commons won't upscale).
 */
const BUCKETS = [330, 500, 960];

export function commonsSrcSet(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(/^(.*\/)(\d+)px-([^/]+)$/);
  if (!m || !/wikimedia\.org/.test(url)) return undefined;
  const [, base, w, rest] = m;
  const max = Number(w);
  const widths = BUCKETS.filter((b) => b < max);
  return [...widths.map((b) => `${base}${b}px-${rest} ${b}w`), `${url} ${max}w`].join(", ");
}
