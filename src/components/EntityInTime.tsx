import Link from "next/link";
import { fmtSpan, fmtYear, largest, type EntityContext, type TimedEntry } from "@/lib/entityContext";
import { withArticle } from "@/lib/placeMaps";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";

const link = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

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

function Entry({ e }: { e: TimedEntry }) {
  return (
    <>
      <Link href={`/${e.kind}/${e.slug}`} className={link}>{e.name}</Link>
      {e.start !== undefined && e.end !== undefined ? <span className="text-ink/66"> ({fmtSpan(e.start, e.end)})</span> : null}
    </>
  );
}

function MapYear({ year, regionId }: { year: number; regionId?: string }) {
  return (
    <Link href={`/map?year=${year}${regionId ? `&region=${regionId}` : ""}`} className={link}>
      {fmtYear(year)}
    </Link>
  );
}

/**
 * "In time and on the map": a person's, event's or culture's place in the
 * atlas (see src/lib/entityContext.ts). Original to the site, shown above
 * the encyclopedia text. Renders nothing when there's nothing to say.
 */
export default function EntityInTime({ ctx }: { ctx: EntityContext }) {
  const { name, start, end, maps, before, after, place, people, events, tours, kind } = ctx;
  const dated = start !== undefined && end !== undefined;
  const peak = place ? largest(place.area) : null;
  if (!dated && !place && !tours.length) return null;

  const placeName = place ? withArticle(place.name) : "";
  const placeArticle = placeName.slice(0, placeName.length - (place?.name.length ?? 0));

  return (
    <section className="mb-14 border-y border-ink/15 py-8" aria-labelledby="in-time">
      <p className="label text-accent mb-3">From the atlas</p>
      <h2 id="in-time" className="font-display text-2xl sm:text-[28px] leading-tight tracking-tight text-ink">
        {name} in time and on the map
      </h2>
      <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink/80">
        {dated && (
          <p>
            {kind === "person" ? (
              <>{name} lived from {fmtYear(start!)} to {fmtYear(end!)}.</>
            ) : start === end ? (
              <>{name} took place in {fmtYear(start!)}.</>
            ) : (
              <>{name} {kind === "event" ? "lasted" : "ran"} from {fmtYear(start!)} to {fmtYear(end!)}.</>
            )}{" "}
            {maps.length > 0 ? (
              <>
                Borders of Time has {maps.length === 1 ? "one world map" : `${maps.length} world maps`} from those years:{" "}
                <List items={maps} render={(y) => <MapYear year={y} regionId={place?.qid} />} />.
              </>
            ) : kind !== "event" ? (
              <>
                None of the atlas&rsquo;s world maps falls within those years; the nearest is{" "}
                <MapYear year={nearest(start!)} regionId={place?.qid} />.
              </>
            ) : null}
            {kind === "event" && before !== undefined && after !== undefined && before !== after && (
              <>
                {" "}The nearest maps from before and after are <MapYear year={before} /> and <MapYear year={after} />;{" "}
                <Link href={`/compare?a=${before}&b=${after}`} className={link}>compare them side by side</Link>.
              </>
            )}
          </p>
        )}

        {place && (
          <p>
            The state most associated with {name} is {placeArticle}
            <Link href={`/place/${place.slug}`} className={link}>{place.name}</Link>
            {peak ? (
              <>
                . {place.area.length > 1 ? (
                  <>It appears on the <List items={place.area.map(([y]) => y)} render={(y) => fmtYear(y)} /> maps; at its largest there, in {fmtYear(peak.year)}, it covers about {peak.text}</>
                ) : (
                  <>On the {fmtYear(peak.year)} map it covers about {peak.text}</>
                )}
                {peak.like ? <>, roughly the size of {peak.like} today</> : null}.
              </>
            ) : (
              "."
            )}
          </p>
        )}

        {people.length > 0 && (
          <p>
            {kind === "person" ? "Living at the same time" : kind === "event" ? "Living through it" : "Living in those years"}
            , among others on this site: <List items={people} render={(e) => <Entry e={e} />} />.
          </p>
        )}

        {events.length > 0 && (
          <p>
            {kind === "person" ? "Events of those years" : "Other events of the same years"}:{" "}
            <List items={events} render={(e) => <Entry e={e} />} />.
          </p>
        )}

        {tours.length > 0 && (
          <p>
            {name} comes up in {tours.length === 1 ? "the guided tour" : "the guided tours"}{" "}
            <List
              items={tours}
              render={(t) => (
                <Link href={`/tour/${t.slug}${t.stops[0] > 1 ? `?stop=${t.stops[0]}` : ""}`} className={link}>
                  {t.title}
                </Link>
              )}
            />
            {/[?!]$/.test(tours[tours.length - 1].title) ? "" : "."}
          </p>
        )}
      </div>
    </section>
  );
}

/** The atlas map closest to a year. */
function nearest(year: number) {
  return SNAPSHOT_YEARS.filter((y) => y >= -10000).reduce((a, b) => (Math.abs(b - year) < Math.abs(a - year) ? b : a));
}
