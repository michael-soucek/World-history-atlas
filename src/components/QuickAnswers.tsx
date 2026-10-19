import Link from "next/link";
import { fmtYear, listOf, type EntityContext, type StoredFacts } from "@/lib/entityContext";
import { formatArea, modernName, withArticle, type PlaceMaps } from "@/lib/placeMaps";

/** Capitalise the first letter: Wikidata writes "worldwide", answers start with a capital. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** A description long enough to answer "who was…" on its own (not just "Indian religion"). */
const substantial = (d: string | undefined): d is string => !!d && d.length >= 25;

const link = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

/** "about 330 years", for spans long enough to be worth saying. */
function duration(start: number, end: number): string | null {
  // No year 0: 1 BCE is followed by 1 CE.
  const years = end - start - (start < 0 && end > 0 ? 1 : 0);
  if (years < 2) return null;
  const rounded = years >= 200 ? Math.round(years / 10) * 10 : years;
  return `${years >= 200 ? "about " : ""}${rounded.toLocaleString("en-US")} years`;
}

/** "India (69%) and Pakistan (16%), with smaller parts in Afghanistan and Nepal". */
function whereToday(today: { name: string; share: number }[]): string {
  const main = today.filter((t) => t.share >= 0.1).slice(0, 4);
  const rest = today.filter((t) => !main.includes(t)).slice(0, 6);
  const head = main.length ? listOf(main.map((t) => `${modernName(t.name)} (${Math.round(t.share * 100)}%)`)) : listOf(rest.splice(0, 3).map((t) => modernName(t.name)));
  return rest.length ? `${head}, with smaller parts in ${listOf(rest.map((t) => modernName(t.name)))}` : head;
}

type QA = { q: string; a: React.ReactNode };

function placeAnswers(name: string, facts: StoredFacts, maps: PlaceMaps | undefined): QA[] {
  const subject = withArticle(name);
  const Subject = subject.charAt(0).toUpperCase() + subject.slice(1);
  const out: QA[] = [];
  const first = maps?.years[0];
  const last = maps?.years[maps.years.length - 1];

  if (facts.start !== undefined && facts.end !== undefined && facts.end >= facts.start) {
    const long = duration(facts.start, facts.end);
    out.push({
      q: `When did ${subject} exist?`,
      a: (
        <>
          From {fmtYear(facts.start)} to {fmtYear(facts.end)}{long ? `, ${long}` : ""}.
          {first !== undefined && last !== undefined ? (
            <> The atlas draws it on its maps {first === last ? <>for {fmtYear(first)}</> : <>from {fmtYear(first)} to {fmtYear(last)}</>}.</>
          ) : null}
        </>
      ),
    });
  } else if (first !== undefined && last !== undefined) {
    out.push({
      q: `When did ${subject} exist?`,
      a: first === last ? <>It appears on the atlas&rsquo;s map for {fmtYear(first)}.</> : <>It appears on the atlas&rsquo;s maps from {fmtYear(first)} to {fmtYear(last)}.</>,
    });
  }

  if (maps?.today?.length) {
    const near = maps.neighbours.slice(0, 4);
    out.push({
      q: `Where was ${subject}?`,
      a: (
        <>
          At its largest, on the {fmtYear(maps.peak.year)} map, its land lies in today&rsquo;s {whereToday(maps.today)}.
          {near.length > 0 && (
            <>
              {" "}On that map it borders{" "}
              {near.map((n, i) => (
                <span key={n.name}>
                  {i > 0 && (i === near.length - 1 ? " and " : ", ")}
                  {n.slug ? <>{withArticle(n.name).slice(0, -n.name.length)}<Link href={`/place/${n.slug}`} className={link}>{n.name}</Link></> : withArticle(n.name)}
                </span>
              ))}
              {maps.neighbours.length > near.length ? ", among others" : ""}.
            </>
          )}
        </>
      ),
    });
  }

  if (facts.capitals.length) {
    out.push({
      q: `What was the capital of ${subject}?`,
      a: facts.capitals.length === 1 ? <>{facts.capitals[0]}.</> : <>Its capitals over time included {listOf(facts.capitals)}.</>,
    });
  }

  if (maps) {
    out.push({
      q: `How big was ${subject}?`,
      a: <>{Subject} was largest on the {fmtYear(maps.peak.year)} map, at about {formatArea(maps.peak.km2)}.</>,
    });
  }
  return out;
}

function personAnswers(ctx: EntityContext, facts: StoredFacts): QA[] {
  const out: QA[] = [];
  const { name, start, end } = ctx;
  if (start !== undefined && end !== undefined) {
    const age = end - start - (start < 0 && end > 0 ? 1 : 0);
    out.push({
      q: `When was ${name} born, and when did ${name} die?`,
      a: (
        <>
          {name} was born in {fmtYear(start)}{facts.birthPlace ? ` in ${facts.birthPlace}` : ""} and died in {fmtYear(end)}
          {facts.deathPlace ? ` in ${facts.deathPlace}` : ""}, aged about {age}.
        </>
      ),
    });
  }
  if (substantial(ctx.description)) {
    out.push({ q: `Who was ${name}?`, a: <>{cap(ctx.description)}.</> });
  }
  if (ctx.place) {
    out.push({
      q: `Which state is ${name} linked to on the map?`,
      a: (
        <>
          {cap(withArticle(ctx.place.name).slice(0, -ctx.place.name.length))}
          <Link href={`/place/${ctx.place.slug}`} className={link}>{ctx.place.name}</Link>.
        </>
      ),
    });
  }
  return out;
}

function eventAnswers(ctx: EntityContext, facts: StoredFacts): QA[] {
  const out: QA[] = [];
  const { name, start, end } = ctx;
  if (start !== undefined && end !== undefined) {
    const long = duration(start, end);
    out.push({
      q: `When did ${withArticle(name)} happen?`,
      a: start === end ? <>In {fmtYear(start)}.</> : <>It began in {fmtYear(start)} and ended in {fmtYear(end)}{long ? `, lasting ${long}` : ""}.</>,
    });
  }
  if (facts.locations.length) {
    out.push({ q: `Where did ${withArticle(name)} take place?`, a: <>{cap(listOf(facts.locations))}.</> });
  }
  if (ctx.before !== undefined && ctx.after !== undefined && ctx.before !== ctx.after) {
    out.push({
      q: `How did the map change?`,
      a: (
        <>
          Compare the atlas&rsquo;s maps of {fmtYear(ctx.before)} and {fmtYear(ctx.after)}{" "}
          <Link href={`/compare?a=${ctx.before}&b=${ctx.after}`} className={link}>side by side</Link>.
        </>
      ),
    });
  }
  return out;
}

function cultureAnswers(ctx: EntityContext, facts: StoredFacts): QA[] {
  const out: QA[] = [];
  if (substantial(ctx.description)) out.push({ q: `What is ${withArticle(ctx.name)}?`, a: <>{cap(ctx.description)}.</> });
  if (ctx.start !== undefined) {
    out.push({
      q: `When did ${withArticle(ctx.name)} begin?`,
      a: ctx.end !== undefined && ctx.end !== ctx.start ? <>It dates from {fmtYear(ctx.start)} to {fmtYear(ctx.end)}.</> : <>Around {fmtYear(ctx.start)}.</>,
    });
  }
  if (facts.locations.length) out.push({ q: `Where was ${withArticle(ctx.name)} centred?`, a: <>{cap(listOf(facts.locations))}.</> });
  return out;
}

/**
 * Short answers to the questions people search about a page's subject
 * ("where was the Mughal Empire", "when did Napoleon die"), from the atlas's
 * measurements and the stored Wikidata facts. Renders nothing without at
 * least two answers.
 */
export default function QuickAnswers(
  props:
    | { kind: "place"; name: string; facts: StoredFacts; maps: PlaceMaps | undefined }
    | { kind: "person" | "event" | "culture"; ctx: EntityContext; facts: StoredFacts },
) {
  const items =
    props.kind === "place"
      ? placeAnswers(props.name, props.facts, props.maps)
      : props.kind === "person"
        ? personAnswers(props.ctx, props.facts)
        : props.kind === "event"
          ? eventAnswers(props.ctx, props.facts)
          : cultureAnswers(props.ctx, props.facts);
  if (items.length < 2) return null;
  return (
    <section className="mb-14" aria-labelledby="quick-answers">
      <h2 id="quick-answers" className="label text-ink/45 mb-4">Quick answers</h2>
      <dl className="divide-y divide-ink/10 border-y border-ink/10">
        {items.map(({ q, a }) => (
          <div key={q} className="py-4">
            <dt className="font-display text-[19px] leading-snug tracking-tight text-ink">{q}</dt>
            <dd className="mt-1.5 text-[16px] leading-relaxed text-ink/75">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
