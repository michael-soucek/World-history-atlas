import Link from "next/link";
import type { RulerSpan } from "@/lib/cityHistory";

/** "-123000" → "123,000 BCE": snapshot years reach far into prehistory. */
export const formatYear = (y: number) => (y < 0 ? `${Math.abs(y) >= 10000 ? Math.abs(y).toLocaleString("en-US") : -y} BCE` : `${y} CE`);

/** Link to the atlas at this snapshot year, centred on a point. */
export const mapHref = (point: { lat: number; lng: number }, year: number) => `/map?year=${year}&lat=${point.lat}&lng=${point.lng}&z=5`;

/**
 * One row of a "who held it" timeline: the years, the ruler (linked to its
 * atlas page when it has one) and a link to that year's map. `mapYear` is the
 * snapshot to open when the span starts between snapshots (a site's build year).
 */
export function SpanRow({ point, span, mapYear }: { point: { lat: number; lng: number }; span: RulerSpan; mapYear?: number }) {
  const years = `${formatYear(span.from)} – ${span.to === null ? "today" : formatYear(span.to)}`;
  const year = mapYear ?? span.from;
  return (
    <li className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[11rem_1fr_auto] gap-x-6 items-baseline py-4 border-b border-ink/10">
      <span className="font-mono text-[12px] tracking-wide text-ink/68 tabular-nums">{years}</span>
      <span className="min-w-0">
        {span.name ? (
          span.href ? (
            <Link href={span.href} className="font-display text-xl sm:text-2xl tracking-tight text-ink hover:text-accent transition-colors">
              {span.name}
            </Link>
          ) : (
            <span className="font-display text-xl sm:text-2xl tracking-tight text-ink">{span.name}</span>
          )
        ) : (
          <span className="text-[15px] italic text-ink/64">No state drawn here on the map</span>
        )}
        {span.sovereign && <span className="block text-[13px] text-ink/68 mt-0.5">under {span.sovereign}</span>}
      </span>
      <Link
        href={mapHref(point, year)}
        className="col-start-2 sm:col-start-auto mt-1 sm:mt-0 font-mono text-[11px] tracking-wide text-ink/64 hover:text-accent transition-colors"
      >
        Map of {formatYear(year)} →
      </Link>
    </li>
  );
}
