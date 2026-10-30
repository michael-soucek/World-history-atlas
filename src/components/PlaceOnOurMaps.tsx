import Link from "next/link";
import { MAP_COUNT, drawnContinuously, formatArea, placeMaps, sizeComparison, withArticle, type MapLabel } from "@/lib/placeMaps";

function fmtYear(y: number) {
  return y > 0 ? `${y} CE` : `${Math.abs(y)} BCE`;
}

/** A map name in running text: "the" where it reads naturally, linked when it has a page. */
function Name({ label }: { label: MapLabel }) {
  const text = withArticle(label.name);
  const article = text.slice(0, text.length - label.name.length);
  return label.slug ? (
    <>
      {article}
      <Link href={`/place/${label.slug}`} className="underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors">
        {label.name}
      </Link>
    </>
  ) : (
    <>{text}</>
  );
}

/** "a, b and c" with each item rendered by `render`. */
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && (i === items.length - 1 ? " and " : ", ")}
          {render(item)}
        </span>
      ))}
    </>
  );
}

/**
 * "On our maps": how this place appears across the atlas's own snapshots.
 * Original to the site (see src/lib/placeMaps.ts), shown above the
 * encyclopedia text. Renders nothing for places the snapshots never draw.
 */
export default function PlaceOnOurMaps({ slug, name, regionId }: { slug: string; name: string; regionId?: string }) {
  const data = placeMaps(slug);
  if (!data || !data.years.length) return null;
  const { years, area, peak, neighbours, before, after } = data;
  const first = years[0];
  const last = years[years.length - 1];
  const single = years.length === 1;
  const comparison = sizeComparison(peak.km2);
  // Other snapshot names counted in the peak figure: provinces, colonies, khanates.
  const extraParts = peak.parts.filter((p) => p !== name && p !== data.name);
  const max = Math.max(...area.map(([, km2]) => km2));
  const subject = withArticle(name);
  const peakHref = `/map?year=${peak.year}${regionId ? `&region=${regionId}` : ""}`;

  return (
    <section className="mb-14 border-y border-ink/15 py-8" aria-labelledby="on-our-maps">
      <p className="label text-accent mb-3">From the atlas</p>
      <h2 id="on-our-maps" className="font-display text-2xl sm:text-[28px] leading-tight tracking-tight text-ink">
        {name} on our maps
      </h2>
      <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/80">
        <p>
          {single ? (
            <>Borders of Time draws {subject} on one of its {MAP_COUNT} world maps, the one for {fmtYear(first)}.</>
          ) : (
            <>
              Borders of Time draws {subject} on {years.length} of its {MAP_COUNT} world maps, from {fmtYear(first)} to{" "}
              {fmtYear(last)}
              {drawnContinuously(years) ? "" : ", with gaps where it doesn’t appear"}.
            </>
          )}{" "}
          {single ? "There" : <>Its largest extent is on the {fmtYear(peak.year)} map</>}
          {single ? " it covers" : ", covering"} about {formatArea(peak.km2)}
          {comparison ? <>, roughly the size of {comparison} today</> : null}.
          {extraParts.length > 0 && (
            <>
              {" "}
              That figure counts everything the map assigns to it, including{" "}
              <List items={extraParts.slice(0, 8)} render={(p) => withArticle(p)} />
              {extraParts.length > 8 ? <> and {extraParts.length - 8} more</> : null}.
            </>
          )}
        </p>
        {neighbours.length > 0 && (
          <p>
            On that map it borders <List items={neighbours.slice(0, 10)} render={(n) => <Name label={n} />} />
            {neighbours.length > 10 ? <>, among others</> : null}.
          </p>
        )}
        {(before || after) && (
          <p>
            {before && (
              <>
                On the map before it appears ({fmtYear(before.year)}), the same area belongs to <Name label={before} />.{" "}
              </>
            )}
            {after && (
              <>
                On the map after its last appearance ({fmtYear(after.year)}), it belongs to <Name label={after} />.
              </>
            )}
          </p>
        )}
      </div>

      {area.length > 1 && (
        <figure className="mt-7">
          <figcaption className="label text-ink/64 !text-[10px] mb-3">Area on each map</figcaption>
          <ol className="space-y-1.5">
            {area.map(([year, km2]) => (
              <li key={year} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-[13px]">
                <span className="font-mono text-ink/70 tabular-nums">{fmtYear(year)}</span>
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`h-2 rounded-full ${year === peak.year ? "bg-accent" : "bg-ink/25"}`}
                    style={{ width: `${Math.max(2, (km2 / max) * 100) * 0.7}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-ink/72 tabular-nums whitespace-nowrap">{formatArea(km2).split(" (")[0]}</span>
                </span>
              </li>
            ))}
          </ol>
        </figure>
      )}

      <p className="mt-6 text-sm">
        <Link href={peakHref} className="font-medium text-accent hover:underline underline-offset-4">
          Open the {fmtYear(peak.year)} map →
        </Link>
      </p>
      <p className="mt-3 text-xs text-ink/66 leading-relaxed">
        Measured from the historical-basemaps snapshots this atlas uses. Borders in those maps are approximate,
        especially for early periods.
      </p>
    </section>
  );
}
