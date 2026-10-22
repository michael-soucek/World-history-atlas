import type { Metadata } from "next";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonLd";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroMapPreview from "@/components/HeroMapPreview";
import AdSlot from "@/components/AdSlot";
import { ADS_ENABLED } from "@/lib/monetization";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { TIMELINE_ILLUSTRATIONS } from "@/data/timelineIllustrations";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { EXPLORERS } from "@/data/voyages";
import { TOURS } from "@/data/tours";
import { getEntityImages, type EntityImage } from "@/lib/entityImages";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import { ERA_HEX } from "@/lib/palette";
import { commonsSrcSet } from "@/lib/commonsImage";

const HOME_OG_DESCRIPTION = "An interactive world history atlas. Watch the world's empires rise and fall — year by year.";

export const metadata: Metadata = {
  title: "Borders of Time: Interactive World History Map & Atlas",
  description:
    "An interactive world history map: watch empires rise and fall across 5,000 years, take guided tours of history's biggest events, and explore every era.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Borders of Time",
    description: HOME_OG_DESCRIPTION,
    siteName: "Borders of Time",
    type: "website",
    images: [{ url: DEFAULT_SOCIAL_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Borders of Time",
    description: HOME_OG_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

/** Featured empires, each with the picture chosen for its card. */
const FEATURED_EMPIRES = [
  { name: "Roman Empire",      span: "27 BCE – 476 CE", image: "Augustus_of_Prima_Porta", pos: "50% 12%" },
  { name: "Mongol Empire",     span: "1206 – 1368",     image: "Temüjin_proclaimed", pos: "50% 30%" },
  { name: "Achaemenid Empire", span: "550 – 330 BCE",   image: "Pasargad_Tomb_Cyrus", pos: "50% 50%" },
  { name: "Mughal Empire",     span: "1526 – 1857",     image: "Humayun_and_Babur", pos: "50% 20%" },
  { name: "Mali Empire",       span: "c. 1235 – 1670",  image: "Catalan_Atlas_BNF_Sheet_6_Mansa_Musa", pos: "40% 50%" },
  { name: "Byzantine Empire",  span: "330 – 1453",      image: "Mosaic_of_Justinianus", pos: "50% 25%" },
];

const FEATURED_EXPLORERS: { slug: string; image: string }[] = [
  { slug: "james-cook",         image: "Captainjamescookportrait" },
  { slug: "ibn-battuta",        image: "Ibn_Battuta_in_Egypt" },
  { slug: "ferdinand-magellan", image: "Ferdinand_Magellan.jpg" },
  { slug: "zheng-he",           image: "2016_Malakka" },
];

/** Years worth stopping at. All are snapshot years, so each opens a real map. */
const LANDMARK_YEARS = [
  { year: -500, note: "Persia rules from the Aegean to the Indus" },
  { year: -1,   note: "The eve of the Common Era" },
  { year: 800,  note: "Charlemagne is crowned in Rome" },
  { year: 1279, note: "The Yuan conquest of Song China" },
  { year: 1492, note: "Columbus reaches the Caribbean" },
  { year: 1783, note: "American independence is recognised" },
  { year: 1914, note: "The First World War begins" },
  { year: 1945, note: "The Second World War ends" },
];


const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function fmt(y: number) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

async function pickImage(qid: string | undefined, match: string): Promise<EntityImage | undefined> {
  if (!qid) return undefined;
  const all = await getEntityImages(qid);
  return all.find(i => i.file.includes(match)) ?? all[0];
}

/** Commons author strings carry wiki chrome ("talk · contribs") and repeats. */
function cleanAuthor(a?: string): string {
  if (!a) return "";
  const t = a.replace(/\(\s*talk[^)]*\)/gi, "").replace(/\s+/g, " ").trim();
  const half = t.slice(0, t.length / 2).trim();
  const out = t === `${half} ${half}` ? half : t;
  return /^unknown/i.test(out) ? "" : ` by ${out}`;
}

function countTopics() {
  const slugs = new Set<string>();
  for (const e of Object.values(CROSSWALK)) slugs.add(`p:${e.slug}`);
  for (const e of Object.values(PEOPLE_CROSSWALK)) slugs.add(`pe:${e.slug}`);
  for (const e of Object.values(EVENTS_CROSSWALK)) slugs.add(`ev:${e.slug}`);
  for (const e of Object.values(CULTURES_CROSSWALK)) slugs.add(`cu:${e.slug}`);
  return slugs.size;
}

export default async function HomePage() {
  const empires = await Promise.all(
    FEATURED_EMPIRES.map(async f => {
      const entry = CROSSWALK[f.name];
      return { ...f, entry, img: await pickImage(entry?.wikidataId, f.image) };
    }),
  );
  const explorers = await Promise.all(
    FEATURED_EXPLORERS.map(async f => {
      const ex = EXPLORERS.find(e => e.slug === f.slug);
      return ex ? { ex, img: await pickImage(ex.wikidataId, f.image) } : null;
    }),
  );
  const eras = ERA_LIST.map((e, i) => ({ era: e, art: TIMELINE_ILLUSTRATIONS[e.label], n: ROMAN[i] }));
  const tours = TOURS.slice(0, 6);
  const topicCount = Math.floor(countTopics() / 10) * 10;

  const credits = [
    ...empires.map(e => e.img),
    ...explorers.map(e => e?.img),
  ].filter((i): i is EntityImage => Boolean(i));

  return (
    <>
      <SiteHeader tone="night" />
      <main className="bg-parchment">
        <JsonLd data={[websiteLd, organizationLd]} />

        {/* ── I. Hero: the live atlas ───────────────────────────────────── */}
        <section data-hero className="relative bg-night text-parchment overflow-hidden h-[min(92svh,900px)] min-h-[640px] -mt-16 pt-16">
          <HeroMapPreview />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pointer-events-none">
            <div className="pt-[9vh] sm:pt-[13vh] max-w-[38rem] pointer-events-auto">
              <p className="label text-glow mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-glow/60" aria-hidden="true" />
                An atlas of five thousand years
              </p>
              <h1 className="font-display font-light text-[44px] leading-[1.02] sm:text-6xl lg:text-[80px] lg:leading-[0.98] tracking-[-0.03em]">
                Watch the world <span className="italic text-glow">redraw</span> itself.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-parchment/65 leading-relaxed max-w-md">
                Scrub through {SNAPSHOT_YEARS.length} maps from the first cities to today, or{" "}
                <Link href="/borders-over-time" className="text-parchment underline decoration-glow/50 underline-offset-4 hover:decoration-glow">
                  watch every year since 2000 BCE
                </Link>{" "}
                play out on an animated map. See every empire, kingdom and nation rise, spread and break apart.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/map?year=1700"
                  className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-glow text-night text-[15px] font-semibold hover:bg-parchment transition-colors"
                >
                  Open the atlas
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link href="/tour" className="text-[15px] text-parchment/75 hover:text-parchment link-draw pb-0.5">
                  or take a guided tour
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Index figures ────────────────────────────────────────────── */}
        <section className="border-b border-ink/10">
          <dl className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
            {[
              { n: String(SNAPSHOT_YEARS.length), l: "Historical maps", s: "123,000 BCE to 2010, plus every year since 2000 BCE animated" },
              { n: `${topicCount}+`, l: "Places, people & events", s: "Each with its own page" },
              { n: String(TOURS.length), l: "Guided tours", s: "Narrated, step by step" },
              { n: String(EXPLORERS.length), l: "Voyages traced", s: "Charted stop by stop" },
            ].map((f, i) => (
              <div
                key={f.l}
                className={`py-8 sm:py-10 ${i % 2 ? "pl-5 sm:pl-8 border-l border-ink/10" : "pr-5 sm:pr-8"} ${i >= 2 ? "max-lg:border-t max-lg:border-ink/10" : ""} lg:px-8 lg:first:pl-0 ${i === 2 ? "lg:border-l lg:border-ink/10" : ""}`}
              >
                <dd className="font-display font-light text-5xl sm:text-6xl tracking-tight tabular-nums text-ink">{f.n}</dd>
                <dt className="mt-3 text-sm font-medium text-ink">{f.l}</dt>
                <p className="mt-0.5 text-xs text-ink/45">{f.s}</p>
              </div>
            ))}
          </dl>
        </section>

        {/* ── II. The six ages ─────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              n="II"
              title={<>Six ages of <span className="italic">the human story</span></>}
              lede="The atlas is organised the way historians divide the past. Pick an age to see its maps, its empires and its people."
              link={{ href: "/timeline", label: "The full timeline" }}
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
              {eras.map(({ era, art, n }) => {
                const finite = isFinite(era.start);
                const href = finite ? `/era/${eraSlug(era.label)}` : "/timeline/prehistoric";
                return (
                  <Link key={era.label} href={href} className="reveal group relative bg-parchment p-6 sm:p-7 flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                      {art && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={art.src}
                          alt={art.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover grayscale-[0.85] sepia-[0.25] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.04]"
                          style={{ objectPosition: art.objectPosition }}
                        />
                      )}
                      <div
                        className="absolute inset-0 mix-blend-multiply opacity-[0.18] transition-opacity duration-700 group-hover:opacity-0"
                        style={{ background: ERA_HEX[era.label] }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <span className="label" style={{ color: ERA_HEX[era.label] }}>Age {n}</span>
                      <span className="font-mono text-[11px] text-ink/45 tabular-nums">
                        {finite ? fmt(era.start) : "Before 3000 BCE"}
                        {finite && <> – {isFinite(era.end) ? fmt(era.end) : "today"}</>}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-3xl tracking-tight text-ink group-hover:text-accent transition-colors">
                      {era.label}
                    </h3>
                    <p className="mt-3 text-sm text-ink/60 leading-relaxed line-clamp-3">{era.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── III. Empires ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-surface/60 border-y border-ink/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              n="III"
              title={<>Empires, <span className="italic">rise and fall</span></>}
              lede="Every territory on the map has a page: its story, its rulers, its pictures, and a link straight to its borders."
              link={{ href: "/browse?type=place", label: "All places & empires" }}
            />

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-12 gap-x-4 sm:gap-x-6 gap-y-10">
              {empires.map((e, i) => {
                if (!e.entry) return null;
                const big = i < 2;
                return (
                  <Link
                    key={e.name}
                    href={`/place/${e.entry.slug}`}
                    className={`reveal group block ${big ? "col-span-2 lg:col-span-6" : "col-span-1 lg:col-span-3"}`}
                  >
                    <div className={`relative overflow-hidden bg-night ${big ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
                      {e.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={e.img.thumb}
                          srcSet={commonsSrcSet(e.img.thumb)}
                          sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                          decoding="async"
                          alt={e.img.description || e.name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                          style={{ objectPosition: e.pos }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/35 via-35% to-transparent to-70%" aria-hidden="true" />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-parchment">
                        <p className="font-mono text-[10px] sm:text-[11px] tracking-wider text-glow/90 tabular-nums">{e.span}</p>
                        <h3 className={`mt-1 font-display tracking-tight leading-[1.05] ${big ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"}`}>
                          {e.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── IV. Tours ────────────────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 bg-night text-parchment overflow-hidden">
          <div className="absolute inset-0 graticule-night pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              dark
              n="IV"
              title={<>Let the map <span className="italic text-glow">tell the story</span></>}
              lede="Guided tours move the map for you — year, place and zoom — while a short narration explains what changed and why."
              link={{ href: "/tour", label: `All ${TOURS.length} tours` }}
            />

            <ol className="mt-12 border-t border-white/12">
              {tours.map((t, i) => {
                const years = t.steps.map(s => s.mapState.year);
                return (
                  <li key={t.slug} className="border-b border-white/12">
                    <Link href={`/tour/${t.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[4rem_1fr_12rem_2rem] items-baseline gap-x-4 py-6 sm:py-7">
                      <span className="font-mono text-xs text-glow/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-display text-2xl sm:text-[34px] leading-tight tracking-tight group-hover:text-glow transition-colors">
                          {t.title}
                        </span>
                        <span className="block mt-1.5 text-sm text-parchment/50 max-w-2xl leading-relaxed">{t.description}</span>
                      </span>
                      <span className="hidden sm:block font-mono text-[11px] tracking-wider text-parchment/45 tabular-nums text-right">
                        {fmt(Math.min(...years))} → {fmt(Math.max(...years))}
                        <span className="block mt-1 text-parchment/30">{t.steps.length} stops · {t.duration} min</span>
                      </span>
                      <ArrowUpRight size={20} className="text-parchment/30 group-hover:text-glow group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all justify-self-end" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ol>
            <Link href="/world-wars" className="group mt-8 inline-flex items-center gap-2 text-[15px] text-parchment/75 hover:text-glow transition-colors">
              New: World War I and World War II, stage by stage, with every front line and battle
              <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ── V. Voyages ───────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              n="V"
              title={<>The voyages that <span className="italic">joined the world</span></>}
              lede="Follow explorers port by port, with every landfall dated and plotted along the route they actually sailed or walked."
              link={{ href: "/theme/age-of-exploration", label: "All voyages" }}
            />
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
              {explorers.map(x => x && (
                <Link key={x.ex.slug} href={`/explorer/${x.ex.slug}`} className="reveal group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    {x.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={x.img.thumb}
                        srcSet={commonsSrcSet(x.img.thumb)}
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        decoding="async"
                        alt={x.img.description || x.ex.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover grayscale-[0.6] sepia-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <p className="mt-4 font-mono text-[11px] tracking-wider text-ink/45 tabular-nums">{x.ex.lifespan}</p>
                  <h3 className="mt-1 font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors">{x.ex.name}</h3>
                  <p className="mt-1.5 text-sm text-ink/55 leading-snug line-clamp-2">{x.ex.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {ADS_ENABLED && (
          <section className="border-t border-ink/10 py-8">
            <div className="max-w-5xl mx-auto px-6">
              <AdSlot id="home-mid-content" format="in-content" />
            </div>
          </section>
        )}

        {/* ── VI. Pick a year ──────────────────────────────────────────── */}
        <section className="pt-20 sm:pt-28 pb-16 sm:pb-20 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              n="VI"
              title={<>Or simply <span className="italic">pick a year</span></>}
              lede="Each one opens the atlas at that moment."
              link={{ href: "/map", label: "Open the atlas" }}
            />
            <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-l border-t border-ink/10">
              {LANDMARK_YEARS.map(y => (
                <li key={y.year} className="border-r border-b border-ink/10">
                  <Link href={`/map?year=${y.year}`} className="group flex flex-col h-full p-5 sm:p-7 hover:bg-card transition-colors">
                    <span className="font-display font-light text-5xl sm:text-7xl tracking-[-0.04em] tabular-nums text-ink group-hover:text-accent transition-colors">
                      {Math.abs(y.year)}
                      <span className="text-[0.3em] italic tracking-normal text-ink/40 ml-1 align-top">{y.year < 0 ? "BCE" : "CE"}</span>
                    </span>
                    <span className="mt-3 text-sm text-ink/55 leading-snug">{y.note}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {credits.length > 0 && (
              <details className="group mt-10 text-[12px] text-ink/45">
                <summary className="cursor-pointer list-none inline-flex items-center gap-2 hover:text-ink transition-colors [&::-webkit-details-marker]:hidden">
                  <span className="w-4 h-4 grid place-items-center rounded-full border border-ink/20 text-[10px] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  Picture credits
                </summary>
                <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 leading-snug">
                  {credits.map(c => (
                    <li key={c.file}>
                      <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent">
                        {c.file.replace(/\.[a-z]+$/i, "").replace(/_/g, " ").replace(/\s*\((?:cropped|\d+)\)/gi, "")}
                      </a>
                      {cleanAuthor(c.author)} · {c.license}
                    </li>
                  ))}
                  <li>Era pictures: public domain, via Wikimedia Commons</li>
                </ul>
              </details>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHead({
  n,
  title,
  lede,
  link,
  dark = false,
}: {
  n: string;
  title: React.ReactNode;
  lede: string;
  link?: { href: string; label: string };
  dark?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
      <div className="lg:col-span-7">
        <p className={`label mb-5 flex items-center gap-3 ${dark ? "text-glow" : "text-accent"}`}>
          <span className="font-display normal-case tracking-normal italic text-base">{n}</span>
          <span className={`h-px w-8 ${dark ? "bg-glow/50" : "bg-accent/50"}`} aria-hidden="true" />
        </p>
        <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em]">{title}</h2>
      </div>
      <div className="lg:col-span-5 lg:pb-2">
        <p className={`text-base leading-relaxed max-w-md ${dark ? "text-parchment/60" : "text-ink/60"}`}>{lede}</p>
        {link && (
          <Link
            href={link.href}
            className={`group mt-4 inline-flex items-center gap-2 text-sm font-medium ${dark ? "text-glow hover:text-parchment" : "text-accent hover:text-ink"} transition-colors`}
          >
            <span className="link-draw pb-0.5">{link.label}</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
