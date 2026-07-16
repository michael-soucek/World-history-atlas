import type { Metadata } from "next";
import Link from "next/link";
import {
  Castle, Landmark, Mountain, Globe, Globe2, Leaf, Sun, Compass,
  Sword, Star, Ship, Shield, FlaskConical, Palette,
  Users, Zap, ScrollText,
  type LucideIcon,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { buildPageMetadata } from "@/lib/seo";
import type { EntityType } from "@/types";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { readableNameFromSlug } from "@/lib/entityResolver";

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
function listForType(type: EntityType): { slug: string; name: string }[] {
  const seenQid = new Set<string>();
  const seenSlug = new Set<string>();
  const out: { slug: string; name: string }[] = [];

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
      push(entry.slug, readableNameFromSlug(entry.slug), entry.wikidataId);
    }
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type } = await searchParams;
  if (isEntityType(type)) {
    return buildPageMetadata({
      title: `${TYPE_META[type].label} — World History Atlas`,
      description: TYPE_META[type].desc,
    });
  }
  return buildPageMetadata({
    title: "Browse History — World History Atlas",
    description: "Browse empires, people, events, and cultures by era, region, or theme.",
  });
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
];

const THEMES: { slug: string; label: string; Icon: LucideIcon }[] = [
  { slug: "empires",      label: "Empires & Conquests",  Icon: Sword         },
  { slug: "religions",    label: "Religion & Belief",    Icon: Star          },
  { slug: "trade-routes", label: "Trade Routes",         Icon: Ship          },
  { slug: "conflicts",    label: "Wars & Conflicts",     Icon: Shield        },
  { slug: "science",      label: "Science & Invention",  Icon: FlaskConical  },
  { slug: "art-culture",  label: "Art & Culture",        Icon: Palette       },
  { slug: "age-of-exploration", label: "Age of Exploration", Icon: Compass    },
];

const ERA_COLORS: Record<string, string> = {
  Ancient:       "from-ancient-wash to-parchment  border-ancient/25  hover:border-ancient/50",
  Classical:     "from-classical-wash to-parchment border-classical/25 hover:border-classical/50",
  Medieval:      "from-medieval-wash to-parchment  border-medieval/25  hover:border-medieval/50",
  "Early Modern":"from-early-modern-wash to-parchment border-early-modern/25 hover:border-early-modern/50",
  Modern:        "from-modern-wash to-parchment    border-modern/25    hover:border-modern/50",
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-display text-xl font-semibold text-ink/70 italic">{children}</h2>
      <div className="flex-1 h-px bg-paper" />
    </div>
  );
}

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
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
            <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
            <span className="text-ink/20">/</span>
            <span className="text-ink/55">{meta.label}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start gap-5 mb-4">
            <meta.Icon size={40} className="text-ink/30 mt-2 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">By type</p>
              <h1 className="font-display text-5xl font-bold text-ink mb-2 italic">{meta.label}</h1>
              <p className="text-ink/45 text-base max-w-xl leading-relaxed">{meta.desc}</p>
            </div>
          </div>

          {/* Type switcher */}
          <div className="flex flex-wrap gap-2.5 mt-8 mb-12">
            {(Object.keys(TYPE_META) as EntityType[]).map((t) => (
              <Link
                key={t}
                href={`/browse?type=${t}`}
                aria-current={t === type ? "page" : undefined}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                  t === type
                    ? "border-ancient/40 bg-ancient-wash text-ancient"
                    : "border-paper bg-white/60 text-ink/55 hover:text-ink hover:border-ancient/30 hover:bg-surface"
                }`}
              >
                {TYPE_META[t].label}
              </Link>
            ))}
          </div>

          {/* Entity grid */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">
                {items.length} {items.length === 1 ? meta.singular.toLowerCase() : meta.label.toLowerCase()}
              </h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${meta.route}/${item.slug}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function BrowseHub() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Page header */}
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Explore</p>
          <h1 className="font-display text-5xl font-bold text-ink mb-3 italic">Browse History</h1>
          <p className="text-ink/40 text-base mb-14 max-w-lg">
            Explore empires, people, events, and cultures — by era, by region, or by theme.
          </p>

          {/* By type */}
          <section className="mb-14">
            <SectionHeader>By type</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { href: "/browse?type=place",   label: "Places & Empires", Icon: Landmark,   desc: "Kingdoms, nations, empires" },
                { href: "/browse?type=person",  label: "People",           Icon: Users,      desc: "Rulers, thinkers, explorers" },
                { href: "/browse?type=event",   label: "Events",           Icon: Zap,        desc: "Battles, treaties, revolutions" },
                { href: "/browse?type=culture", label: "Cultures",         Icon: ScrollText, desc: "Civilizations & traditions" },
              ] as { href: string; label: string; Icon: LucideIcon; desc: string }[]).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-paper bg-white/60 hover:bg-ancient-wash hover:border-ancient/30 p-6 text-center transition-all duration-200"
                >
                  <item.Icon size={28} className="text-ink/40 group-hover:text-ancient group-hover:scale-110 transition-all duration-200" aria-hidden="true" />
                  <span className="text-sm text-ink font-semibold">{item.label}</span>
                  <span className="text-xs text-ink/40">{item.desc}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* By era */}
          <section className="mb-14">
            <SectionHeader>By era</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ERA_LIST.filter(e => isFinite(e.start)).map(era => {
                const colors = ERA_COLORS[era.label] ?? "from-surface to-parchment border-paper hover:border-paper/60";
                const eraTextColor: Record<string, string> = {
                  Ancient: "text-ancient", Classical: "text-classical",
                  Medieval: "text-medieval", "Early Modern": "text-early-modern", Modern: "text-modern",
                };
                return (
                  <Link
                    key={era.label}
                    href={`/era/${eraSlug(era.label)}`}
                    className={`group rounded-xl border bg-gradient-to-br ${colors} px-6 py-5 transition-all duration-200`}
                  >
                    <p className={`font-display text-lg font-semibold transition-colors ${eraTextColor[era.label] ?? "text-ink"}`}>{era.label}</p>
                    <p className="text-ink/40 text-xs mt-1.5 font-mono">
                      {era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`}
                      {" – "}
                      {isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "present"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* By region */}
          <section className="mb-14">
            <SectionHeader>By region</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {REGIONS.map(r => (
                <Link
                  key={r.slug}
                  href={`/region/${r.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3.5 text-sm transition-all duration-150"
                >
                  <r.Icon size={16} className="shrink-0 text-ink/45 group-hover:text-ancient transition-colors" aria-hidden="true" />
                  <span className="text-ink/70 group-hover:text-ink transition-colors font-medium">{r.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* By theme */}
          <section>
            <SectionHeader>By theme</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map(t => (
                <Link
                  key={t.slug}
                  href={`/theme/${t.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-4 text-sm transition-all duration-150"
                >
                  <t.Icon size={16} className="shrink-0 text-ink/45 group-hover:text-ancient transition-colors" aria-hidden="true" />
                  <span className="text-ink/70 group-hover:text-ink transition-colors font-medium">{t.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
