import type { Metadata } from "next";
import Link from "next/link";
import {
  Castle, Landmark, Mountain, Globe, Globe2, Leaf, Sun, Compass,
  Sword, Star, Ship, Shield, FlaskConical, Palette, Flag,
  Users, Zap, ScrollText,
  type LucideIcon,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import Gazetteer from "@/components/Gazetteer";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { buildPageMetadata } from "@/lib/seo";
import type { EntityType } from "@/types";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { readableNameFromSlug } from "@/lib/entityResolver";
import { ERA_HEX } from "@/lib/palette";
import { EXPLORERS } from "@/data/voyages";
import { PHILOSOPHY_ERAS } from "@/data/philosophy";
import { COUNTRY_LIST } from "@/lib/countries";
import { publishedCountries } from "@/lib/countryPages";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

const TYPE_META: Record<EntityType, { label: string; singular: string; route: string; Icon: LucideIcon; desc: string }> = {
  place:   { label: "Places & Empires", singular: "Place",   route: "place",   Icon: Landmark,   desc: "Kingdoms, nations, and empires across history." },
  person:  { label: "People",           singular: "Person",  route: "person",  Icon: Users,      desc: "Rulers, thinkers, conquerors, and explorers." },
  event:   { label: "Events",           singular: "Event",   route: "event",   Icon: Zap,        desc: "Battles, treaties, revolutions, and turning points." },
  culture: { label: "Cultures",         singular: "Culture", route: "culture", Icon: ScrollText, desc: "Civilizations, movements, and traditions." },
};

function isEntityType(v: string | undefined): v is EntityType {
  return v === "place" || v === "person" || v === "event" || v === "culture";
}

/** Build a de-duplicated, alphabetically sorted list of entities for a type. */
function listForType(type: EntityType): { slug: string; name: string; href?: string }[] {
  const seenQid = new Set<string>();
  const seenSlug = new Set<string>();
  const out: { slug: string; name: string; href?: string }[] = [];

  const push = (slug: string, name: string, qid: string) => {
    if (seenSlug.has(slug) || seenQid.has(qid)) return;
    seenSlug.add(slug);
    seenQid.add(qid);
    out.push({ slug, name });
  };

  if (type === "place") {
    for (const [name, entry] of Object.entries(CROSSWALK)) {
      push(entry.slug, name, entry.wikidataId);
    }
  } else {
    const source =
      type === "person" ? PEOPLE_CROSSWALK :
      type === "event"  ? EVENTS_CROSSWALK :
      CULTURES_CROSSWALK;
    for (const entry of Object.values(source)) {
      push(entry.slug, entry.name ?? readableNameFromSlug(entry.slug), entry.wikidataId);
    }
  }

  // Explorers are people too; their pages live under /explorer.
  if (type === "person") {
    for (const e of EXPLORERS) {
      if (seenSlug.has(e.slug) || seenQid.has(e.wikidataId)) continue;
      seenSlug.add(e.slug);
      out.push({ slug: e.slug, name: e.name, href: `/explorer/${e.slug}` });
    }
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Search-friendly titles for each filtered list ("Historical Figures: 70 People in World History"). */
const TYPE_SEO: Record<EntityType, (n: number) => { title: string; description: string }> = {
  place: (n) => ({
    title: `${n} Empires, Kingdoms & States in History — Borders of Time`,
    description: `An A–Z of ${n} empires, kingdoms and states from world history, from the Achaemenids to the Zulu Kingdom, each with its story and its borders on the map.`,
  }),
  person: (n) => ({
    title: `${n} Historical Figures: Rulers, Conquerors & Thinkers — Borders of Time`,
    description: `An A–Z of ${n} people who shaped world history: rulers, conquerors, explorers and thinkers, each linked to the map of their world.`,
  }),
  event: (n) => ({
    title: `${n} Key Events in World History: Battles, Treaties & Revolutions — Borders of Time`,
    description: `An A–Z of ${n} turning points in world history, from battles and treaties to revolutions and the fall of empires, each placed on the map.`,
  }),
  culture: (n) => ({
    title: `${n} Civilizations & Cultures in World History — Borders of Time`,
    description: `An A–Z of ${n} civilizations, movements and traditions from world history, each with its story and where it flourished on the map.`,
  }),
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type } = await searchParams;
  if (isEntityType(type)) {
    return {
      ...buildPageMetadata(TYPE_SEO[type](listForType(type).length)),
      alternates: { canonical: `/browse?type=${type}` },
    };
  }
  const total = (["place", "person", "event", "culture"] as const).reduce((n, t) => n + listForType(t).length, 0);
  return {
    ...buildPageMetadata({
      title: "Browse World History: Empires, People, Events & Cultures — Borders of Time",
      description: `Browse ${total} empires, people, events and cultures from world history, by era, region or theme, each linked to the interactive map.`,
    }),
    alternates: { canonical: "/browse" },
  };
}

const REGIONS: { slug: string; label: string; Icon: LucideIcon }[] = [
  { slug: "europe",         label: "Europe",         Icon: Castle    },
  { slug: "middle-east",    label: "Middle East",     Icon: Landmark  },
  { slug: "east-asia",      label: "East Asia",       Icon: Mountain  },
  { slug: "south-asia",     label: "South Asia",      Icon: Sun       },
  { slug: "africa",         label: "Africa",          Icon: Globe     },
  { slug: "americas",       label: "The Americas",    Icon: Globe2    },
  { slug: "central-asia",   label: "Central Asia",    Icon: Compass   },
  { slug: "southeast-asia", label: "Southeast Asia",  Icon: Leaf      },
  { slug: "oceania",        label: "Oceania",         Icon: Ship      },
];

const THEMES: { slug: string; label: string; Icon: LucideIcon }[] = [
  { slug: "empires",      label: "Empires & Conquests",  Icon: Sword         },
  { slug: "religions",    label: "Religion & Belief",    Icon: Star          },
  { slug: "trade-routes", label: "Trade Routes",         Icon: Ship          },
  { slug: "conflicts",    label: "Wars & Conflicts",     Icon: Shield        },
  { slug: "science",      label: "Science & Invention",  Icon: FlaskConical  },
  { slug: "art-culture",  label: "Art & Culture",        Icon: Palette       },
  { slug: "revolutions",  label: "Revolutions & Independence", Icon: Flag },
  { slug: "age-of-exploration", label: "Age of Exploration", Icon: Compass    },
];


const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`);

export default async function BrowsePage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type;
  if (isEntityType(type)) {
    return <BrowseByType type={type} />;
  }
  return <BrowseHub />;
}

function BrowseByType({ type }: { type: EntityType }) {
  const meta = TYPE_META[type];
  const items = listForType(type);
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <PageIntro
          crumbs={[{ href: "/browse", label: "Browse" }]}
          label="Index"
          title={meta.label}
          lede={meta.desc}
          aside={<p className="font-mono text-[12px] tracking-wide text-ink/50">{items.length} entries</p>}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Type switcher */}
          <nav className="flex gap-x-8 mb-12 border-b border-ink/10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]" aria-label="Type">
            {(Object.keys(TYPE_META) as EntityType[]).map((t) => (
              <Link
                key={t}
                href={`/browse?type=${t}`}
                aria-current={t === type ? "page" : undefined}
                className={`relative shrink-0 whitespace-nowrap text-[15px] pb-4 border-b-2 -mb-px transition-colors ${
                  t === type ? "text-ink font-medium border-accent" : "text-ink/50 hover:text-ink border-transparent"
                }`}
              >
                {TYPE_META[t].label}
              </Link>
            ))}
          </nav>

          <Gazetteer grouped items={items.map(item => ({ href: item.href ?? `/${meta.route}/${item.slug}`, name: item.name }))} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function BrowseHub() {
  const counts: Record<EntityType, number> = {
    place: listForType("place").length,
    person: listForType("person").length,
    event: listForType("event").length,
    culture: listForType("culture").length,
  };
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <PageIntro
          label="Browse"
          title={<>The index <span className="italic">of the atlas</span></>}
          lede="Every empire, person, event and culture in Borders of Time — by kind, by age, by region or by theme."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-20 sm:space-y-28">
          {/* By type */}
          <section aria-labelledby="by-type">
            <SectionRule count="4 kinds"><span id="by-type">By kind</span></SectionRule>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
              {(Object.keys(TYPE_META) as EntityType[]).map(t => {
                const m = TYPE_META[t];
                return (
                  <Link key={t} href={`/browse?type=${t}`} className="group bg-parchment hover:bg-card p-6 sm:p-8 flex flex-col min-h-[220px] transition-colors">
                    <m.Icon size={22} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                    <span className="mt-auto pt-10 font-display font-light text-5xl sm:text-6xl tracking-tight tabular-nums text-ink">{counts[t]}</span>
                    <span className="mt-2 font-display text-xl text-ink group-hover:text-accent transition-colors">{m.label}</span>
                    <span className="mt-1 text-sm text-ink/50 leading-snug">{m.desc}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Histories */}
          <section aria-labelledby="histories">
            <SectionRule><span id="histories">Histories</span></SectionRule>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
              <Link href="/countries" className="group bg-parchment hover:bg-card p-6 sm:p-8 flex flex-col min-h-[200px] transition-colors">
                <span className="font-display font-light text-5xl sm:text-6xl tracking-tight tabular-nums text-ink">{publishedCountries().size}</span>
                <span className="mt-2 font-display text-2xl text-ink group-hover:text-accent transition-colors">Country histories</span>
                <span className="mt-1 text-sm text-ink/50 leading-snug">The whole history of every country, from its first peoples to today{publishedCountries().size < COUNTRY_LIST.length ? `; ${COUNTRY_LIST.length} in all as they are written` : ""}.</span>
              </Link>
              <Link href="/philosophy" className="group bg-parchment hover:bg-card p-6 sm:p-8 flex flex-col min-h-[200px] transition-colors">
                <span className="font-display font-light text-5xl sm:text-6xl tracking-tight tabular-nums text-ink">{PHILOSOPHY_ERAS.length}</span>
                <span className="mt-2 font-display text-2xl text-ink group-hover:text-accent transition-colors">History of philosophy</span>
                <span className="mt-1 text-sm text-ink/50 leading-snug">Every era and tradition, from the first Greek, Indian and Chinese thinkers to the twentieth century.</span>
              </Link>
            </div>
          </section>

          {/* By era */}
          <section id="eras" aria-labelledby="by-era" className="scroll-mt-24">
            <SectionRule count={`${ERA_LIST.length} ages`}><span id="by-era">By age</span></SectionRule>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {ERA_LIST.map((era, i) => {
                const finite = isFinite(era.start);
                return (
                  <li key={era.label} className="border-b border-ink/10">
                    <Link href={finite ? `/era/${eraSlug(era.label)}` : "/timeline/prehistoric"} className="group flex items-start gap-5 py-6">
                      <span className="w-1 self-stretch shrink-0" style={{ background: ERA_HEX[era.label] }} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="font-mono text-[11px] tracking-wider text-ink/45 tabular-nums">
                          {["I", "II", "III", "IV", "V", "VI"][i]} · {finite ? `${fmtYear(era.start)} – ${isFinite(era.end) ? fmtYear(era.end) : "today"}` : "before 3000 BCE"}
                        </span>
                        <span className="block mt-1 font-display text-3xl tracking-tight text-ink group-hover:text-accent transition-colors">{era.label}</span>
                        <span className="block mt-2 text-sm text-ink/55 leading-relaxed line-clamp-2">{era.blurb}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* By region */}
          <section id="regions" aria-labelledby="by-region" className="scroll-mt-24">
            <SectionRule count={`${REGIONS.length} regions`}><span id="by-region">By region</span></SectionRule>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {REGIONS.map((r, i) => (
                <li key={r.slug} className="border-b border-ink/10">
                  <Link href={`/region/${r.slug}`} className="group flex items-center gap-4 py-5">
                    <span className="font-mono text-[11px] text-ink/35 tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                    <r.Icon size={18} strokeWidth={1.5} className="text-ink/40 group-hover:text-accent transition-colors" aria-hidden="true" />
                    <span className="font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors">{r.label}</span>
                    <span className="ml-auto text-ink/20 group-hover:text-accent group-hover:translate-x-1 transition-all" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* By theme */}
          <section id="themes" aria-labelledby="by-theme" className="scroll-mt-24">
            <SectionRule count={`${THEMES.length} themes`}><span id="by-theme">By theme</span></SectionRule>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {THEMES.map((t, i) => (
                <li key={t.slug} className="border-b border-ink/10">
                  <Link href={`/theme/${t.slug}`} className="group flex items-center gap-4 py-5">
                    <span className="font-mono text-[11px] text-ink/35 tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                    <t.Icon size={18} strokeWidth={1.5} className="text-ink/40 group-hover:text-accent transition-colors" aria-hidden="true" />
                    <span className="font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors">{t.label}</span>
                    <span className="ml-auto text-ink/20 group-hover:text-accent group-hover:translate-x-1 transition-all" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
