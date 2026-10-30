import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TourPlayer from "@/components/TourPlayer";
import RelatedResources from "@/components/RelatedResources";
import { TOURS, getTourBySlug } from "@/data/tours";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { JsonLd, SITE_URL, breadcrumbLd } from "@/lib/jsonLd";
import type { Tour } from "@/data/tours";
import Link from "next/link";
import { mentionedIn, fmtSpan, type TimedEntry } from "@/lib/entityContext";
import { getCanonicalNameByQid, lookupByQid, resolveFeature } from "@/data/crosswalk";

interface Props { params: Promise<{ slug: string }> }

// A couple of the full descriptions in tours.ts run past the ~160-char
// meta-description budget — shortened here without touching the source
// copy, which still renders in full on the /tour hub page.
const META_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "silk-road-and-trade":
    "Long before oceans were crossed, overland caravans and monsoon-driven ships linked China, India, the Islamic world, Africa, and Europe in trade and ideas.",
  "chinese-dynasties":
    "For over two thousand years, Chinese history moved through unification, flourishing, decline, and renewal — a succession of dynasties that shaped East Asia.",
};

/**
 * Search titles and social images for the war tours, written for what people
 * search ("WW1 map", "World War 2 front lines") rather than the on-page title.
 */
const WAR_SEO: Record<string, { title: string; description: string; about: { name: string; wiki: string }; image: string }> = {
  "first-world-war": {
    title: "World War I Map: Every Stage of WW1, 1914–1918",
    description:
      "An interactive WW1 map, stage by stage: the Western and Eastern Fronts, Gallipoli, Verdun, the Somme, the Middle East and the Armistice, with every battle.",
    about: { name: "World War I", wiki: "https://en.wikipedia.org/wiki/World_War_I" },
    image: "/og/first-world-war.jpg",
  },
  "second-world-war-europe": {
    title: "World War II Map of Europe: Every Front Line, 1939–1945",
    description:
      "An interactive WW2 map of Europe and North Africa: Poland, the fall of France, Barbarossa, Stalingrad, El Alamein, Kursk, D-Day and Berlin.",
    about: { name: "World War II", wiki: "https://en.wikipedia.org/wiki/World_War_II" },
    image: "/og/second-world-war-europe.jpg",
  },
  "second-world-war-pacific": {
    title: "WW2 Pacific War Map: Japan and the War in Asia, 1937–1945",
    description:
      "An interactive map of WW2 in Asia and the Pacific: China, Pearl Harbor, Midway, Burma, island hopping, Okinawa and Hiroshima, with the territory each side held.",
    about: { name: "Pacific War", wiki: "https://en.wikipedia.org/wiki/Pacific_War" },
    image: "/og/second-world-war-pacific.jpg",
  },
};

const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y}`);

/** "1095–1291", "336–323 BCE", "300,000 BCE–20,000 BCE": the span a tour covers. */
function tourSpan(tour: Tour): string {
  const years = tour.steps.map((s) => s.mapState.year);
  const [from, to] = [Math.min(...years), Math.max(...years)];
  if (from < 0 && to < 0) return `${Math.abs(from).toLocaleString("en-US")}–${Math.abs(to).toLocaleString("en-US")} BCE`;
  return `${fmtYear(from)}–${fmtYear(to)}`;
}

export async function generateStaticParams() {
  return TOURS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour not found — Borders of Time" };
  const war = WAR_SEO[slug];
  if (war) return buildPageMetadata({ title: war.title, description: war.description, path: `/tour/${slug}`, type: "article", imageUrl: war.image });
  return buildPageMetadata({
    // Titles that already have a subtitle ("Out of Africa: How Humans…") skip the extra one.
    title: tour.title.includes(":")
      ? `${tour.title} (${tourSpan(tour)}) — Borders of Time`
      : `${tour.title} (${tourSpan(tour)}): Interactive Map Tour — Borders of Time`,
    // Two tour descriptions run past Google's ~160-char meta-description
    // display width; shortened here for the meta tag specifically (a blind
    // slice(0, 160) cuts both mid-word). The full description still renders
    // in full on the /tour hub page.
    description: META_DESCRIPTION_OVERRIDES[slug] ?? metaDescription(tour.description)!,
    path: `/tour/${slug}`,
  });
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();
  const war = WAR_SEO[tour.slug];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            {
              "@type": "Article",
              headline: tour.title,
              description: tour.description,
              url: `${SITE_URL}/tour/${tour.slug}`,
              timeRequired: `PT${tour.duration}M`,
              ...(war
                ? {
                    about: { "@type": "Thing", name: war.about.name, sameAs: war.about.wiki },
                    image: `${SITE_URL}${war.image}`,
                    isPartOf: { "@type": "CollectionPage", name: "The world wars on the map", url: `${SITE_URL}/world-wars` },
                  }
                : {}),
              learningResourceType: "Guided tour",
              isAccessibleForFree: true,
              publisher: { "@type": "Organization", name: "Borders of Time", url: SITE_URL },
            },
            breadcrumbLd(
              war
                ? [["Guided tours", "/tour"], ["The world wars", "/world-wars"], [tour.title, `/tour/${tour.slug}`]]
                : [["Guided tours", "/tour"], [tour.title, `/tour/${tour.slug}`]],
            ),
          ]}
        />
        <TourPlayer tour={tour} />
        <TourTranscript tour={tour} />
        <InThisTour tour={tour} />
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <RelatedResources resourceKey={`tour:${tour.slug}`} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * The whole tour as plain text, folded away under the player: for readers who
 * prefer to read straight through, screen readers, and search engines (the
 * player itself only shows one stop at a time).
 */
function TourTranscript({ tour }: { tour: Tour }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
      <details className="group border-t border-ink/80">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
          <span className="font-display text-2xl tracking-tight text-ink">Read the whole tour</span>
          <span className="font-mono text-[11px] tracking-wide text-ink/66 group-open:hidden">{tour.steps.length} stops ▾</span>
          <span className="font-mono text-[11px] tracking-wide text-ink/66 hidden group-open:inline">Close ▴</span>
        </summary>
        <ol className="pb-4">
          {tour.steps.map((step, i) => (
            <li key={i} className="py-6 border-t border-ink/10">
              <p className="font-mono text-[11px] tracking-wide text-accent">
                Stop {String(i + 1).padStart(2, "0")} · {step.date ?? `${fmtYear(step.mapState.year)}${step.mapState.year > 0 ? " CE" : ""}`}
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl tracking-tight text-ink">{step.title}</h2>
              <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink/75">{step.text}</p>
              {step.markers?.some((m) => m.kind === "battle") ? (
                <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-ink/70">
                  <span className="label text-ink/64 !text-[10px] mr-2">Battles</span>
                  {step.markers.filter((m) => m.kind === "battle").map((m) => m.label).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

/**
 * Every person, event and culture the narration names, and every state the
 * map highlights, linked to its page: a way into the rest of the atlas, and
 * for search engines, what the tour is about.
 */
async function InThisTour({ tour }: { tour: Tour }) {
  const text = tour.steps.map((s) => `${s.title} ${s.text}`).join(" ");
  const mentioned = await mentionedIn(text);
  const places = new Map<string, string>();
  for (const step of tour.steps) {
    const year = step.mapState.mapYear ?? step.mapState.year;
    const byRegion = step.mapState.regionId ? lookupByQid(step.mapState.regionId) : undefined;
    // War tours: the states each side holds in its own right at this stop.
    const zoneNames = tour.zoneYear ? (step.zones ?? []).filter((z) => !z.occupied).flatMap((z) => z.countries ?? []) : [];
    const zoned = zoneNames.map((n) => resolveFeature(n, n, tour.zoneYear!));
    for (const entry of [byRegion, ...(step.highlight ?? []).map((n) => resolveFeature(n, n, year)), ...zoned]) {
      if (entry) places.set(entry.slug, getCanonicalNameByQid(entry.wikidataId) ?? entry.slug);
    }
  }
  const groups: [string, React.ReactNode[]][] = [
    ["People", mentioned.filter((e) => e.kind === "person").map((e) => <EntryLink key={e.slug} e={e} />)],
    ["Events", mentioned.filter((e) => e.kind === "event").map((e) => <EntryLink key={e.slug} e={e} />)],
    ["Cultures and religions", mentioned.filter((e) => e.kind === "culture").map((e) => <EntryLink key={e.slug} e={e} />)],
    ["States on the map", [...places].sort((a, b) => a[1].localeCompare(b[1])).map(([slug, name]) => (
      <Link key={slug} href={`/place/${slug}`} className={linkClass}>{name}</Link>
    ))],
  ];
  const shown = groups.filter(([, items]) => items.length);
  if (!shown.length) return null;
  return (
    <div className="max-w-5xl mx-auto px-6 pb-10">
      <div className="border-t border-ink/80 pt-5">
        <h2 className="font-display text-2xl tracking-tight text-ink">People and places in this tour</h2>
        <dl className="mt-5 space-y-5">
          {shown.map(([title, items]) => (
            <div key={title}>
              <dt className="label text-ink/64">{title}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-ink/75">
                {items.map((item, i) => <span key={i}>{i > 0 && " · "}{item}</span>)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const linkClass = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

function EntryLink({ e }: { e: TimedEntry }) {
  return (
    <>
      <Link href={`/${e.kind}/${e.slug}`} className={linkClass}>{e.name}</Link>
      {e.start !== undefined && e.end !== undefined ? <span className="text-ink/66"> ({fmtSpan(e.start, e.end)})</span> : null}
    </>
  );
}
