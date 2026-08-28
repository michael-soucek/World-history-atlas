import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { CROSSWALK } from "@/data/crosswalk";

interface Props { params: Promise<{ slug: string }> }

const REGIONS: Record<string, {
  label: string;
  description: string;
  mapCenter: { lat: number; lng: number; zoom: number };
  placeNames: string[];
}> = {
  "europe": {
    label: "Europe",
    description: "From the Roman Empire to the nation-states of modernity, Europe's borders shifted constantly.",
    mapCenter: { lat: 48, lng: 15, zoom: 3 },
    placeNames: [
      "Roman Empire", "Western Roman Empire", "Eastern Roman Empire", "Byzantine Empire",
      "Frankish Kingdom", "Carolingian Empire", "Holy Roman Empire", "Kingdom of France",
      "Kingdom of England", "Polish-Lithuanian Commonwealth", "Habsburg Monarchy",
      "Kingdom of Prussia", "First French Empire", "German Empire", "Austria-Hungary",
      "Sweden", "Denmark",
    ],
  },
  "middle-east": {
    label: "Middle East",
    description: "The cradle of civilization and birthplace of three world religions, with empires spanning millennia.",
    mapCenter: { lat: 32, lng: 44, zoom: 4 },
    placeNames: [
      "Achaemenid Empire", "Seleucid Empire", "Sasanian Empire",
      "Rashidun Caliphate", "Umayyad Caliphate", "Abbasid Caliphate",
      "Ottoman Empire", "Safavid dynasty", "Egypt", "Saudi Arabia",
    ],
  },
  "east-asia": {
    label: "East Asia",
    description: "Dynasties spanning thousands of years, the Silk Road, and some of history's largest empires.",
    mapCenter: { lat: 35, lng: 110, zoom: 3 },
    placeNames: [
      "Han dynasty", "Tang dynasty", "Song dynasty", "Ming dynasty",
      "Qing dynasty", "Mongol Empire", "Joseon dynasty", "Japan",
    ],
  },
  "south-asia": {
    label: "South Asia",
    description: "From the Maurya to the Mughals, South Asia hosted some of the ancient world's richest civilizations.",
    mapCenter: { lat: 22, lng: 80, zoom: 4 },
    placeNames: [
      "Maurya Empire", "Gupta Empire", "Delhi Sultanate",
      "Mughal Empire", "Vijayanagara Empire", "Maratha Empire", "India",
    ],
  },
  "africa": {
    label: "Africa",
    description: "Home to some of history's most powerful empires and the longest-running continuous civilizations.",
    mapCenter: { lat: 5, lng: 25, zoom: 3 },
    placeNames: [
      "Kingdom of Aksum", "Ghana Empire", "Mali Empire", "Songhai Empire",
      "Kingdom of Kongo", "Egypt", "Zulu Kingdom", "Ethiopia",
    ],
  },
  "americas": {
    label: "The Americas",
    description: "Pre-Columbian civilizations and the dramatic collision of Old and New Worlds.",
    mapCenter: { lat: 10, lng: -80, zoom: 3 },
    placeNames: [
      "Aztec Empire", "Inca Empire",
      "United States", "Mexico", "Brazil", "Argentina", "Confederate States",
    ],
  },
  "central-asia": {
    label: "Central Asia",
    description: "The pivot of the Silk Road and birthplace of some of history's most fearsome conquerors.",
    mapCenter: { lat: 45, lng: 65, zoom: 3 },
    placeNames: [
      "Mongol Empire", "Golden Horde", "Ilkhanate",
      "Timurid Empire", "Tibetan Empire",
    ],
  },
  "southeast-asia": {
    label: "Southeast Asia",
    description: "Maritime trade empires and inland kingdoms that linked China, India, and the Arab world.",
    mapCenter: { lat: 10, lng: 110, zoom: 4 },
    placeNames: [
      "Khmer Empire", "Srivijaya", "Majapahit", "Vietnam",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(REGIONS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = REGIONS[slug];
  if (!region) return { title: "Region — Borders of Time" };
  return {
    title: `${region.label} — Borders of Time`,
    description: region.description,
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = REGIONS[slug];
  if (!region) notFound();

  const places = region.placeNames
    .map(name => ({ name, entry: CROSSWALK[name] }))
    .filter(p => p.entry != null);

  const mapHref = `/map?lat=${region.mapCenter.lat}&lng=${region.mapCenter.lng}&z=${region.mapCenter.zoom}`;

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
            <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
            <span className="text-ink/20">/</span>
            <Link href="/browse#regions" className="hover:text-ancient/80 transition-colors">Regions</Link>
            <span className="text-ink/20">/</span>
            <span className="text-ink/55">{region.label}</span>
          </nav>

          {/* Title + CTA row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Region</p>
              <HandwrittenTitle className="font-display text-5xl font-bold text-ink italic leading-tight mb-3">{region.label}</HandwrittenTitle>
              <div className="flex flex-col gap-4">
                <ReadAloudButton text={region.description} />
                <p className="text-ink/45 text-base max-w-xl leading-relaxed">{region.description}</p>
              </div>
            </div>
            <Link
              href={mapHref}
              className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
            >
              View on map →
            </Link>
          </div>

          {/* Place list */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Empires &amp; places</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {region.placeNames.map(name => {
                const entry = CROSSWALK[name];
                if (entry) {
                  return (
                    <Link
                      key={entry.slug}
                      href={`/place/${entry.slug}`}
                      className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                    >
                      {name}
                    </Link>
                  );
                }
                return (
                  <div
                    key={name}
                    className="group relative rounded-xl border border-dashed border-paper bg-white/40 px-4 py-3 text-sm text-ink/30 select-none cursor-default"
                  >
                    {name}
                    <span className="absolute -top-2 -right-1 bg-paper text-ink/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Other regions */}
          <div className="border-t border-paper pt-8 mt-14">
            {slug === "europe" && (
              <>
                <p className="text-ink/25 text-xs uppercase tracking-widest mb-4">Related themes</p>
                <div className="mb-6 flex flex-wrap gap-2.5">
                  <Link
                    href="/theme/age-of-exploration"
                    className="rounded-xl border border-paper bg-white/60 hover:bg-early-modern-wash hover:border-early-modern/30 px-4 py-2.5 text-sm text-ink/50 hover:text-ink transition-all duration-200"
                  >
                    Age of Exploration
                  </Link>
                </div>
              </>
            )}
            <p className="text-ink/25 text-xs uppercase tracking-widest mb-4">Other regions</p>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(REGIONS).filter(([s]) => s !== slug).map(([s, r]) => (
                <Link
                  key={s}
                  href={`/region/${s}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-2.5 text-sm text-ink/50 hover:text-ink transition-all duration-200"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
