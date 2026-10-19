import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import Gazetteer, { LinkRow } from "@/components/Gazetteer";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { CROSSWALK } from "@/data/crosswalk";
import { buildPageMetadata, metaDescription } from "@/lib/seo";

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
      "Minoan civilization",
      "Celts",
      "Kievan Rus'",
      "State of the Teutonic Order",
      "Crown of Castile",
      "Emirate of Granada",
      "Grand Principality of Moscow",
      "Tsardom of Russia",
      "Crimean Khanate",
      "Italy",
      "Spain",
      "Soviet Union",
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
      "Elam",
      "Assyria",
      "Babylonia",
      "Hittites",
      "Urartu",
      "Parthian Empire",
      "Fatimid Caliphate",
      "Seljuk Empire",
      "Mamluk Sultanate",
    ],
  },
  "east-asia": {
    label: "East Asia",
    description: "Dynasties spanning thousands of years, the Silk Road, and some of history's largest empires.",
    mapCenter: { lat: 35, lng: 110, zoom: 3 },
    placeNames: [
      "Han dynasty", "Tang dynasty", "Song dynasty", "Ming dynasty",
      "Qing dynasty", "Mongol Empire", "Joseon dynasty", "Japan",
      "Zhou dynasty",
      "Qin dynasty",
      "Sui dynasty",
      "Liao dynasty",
      "Yuan dynasty",
      "Silla",
      "Goryeo",
      "Kamakura shogunate",
      "Tokugawa shogunate",
      "Empire of Japan",
      "China",
      "Tibet",
    ],
  },
  "south-asia": {
    label: "South Asia",
    description: "From the Maurya to the Mughals, South Asia hosted some of the ancient world's richest civilizations.",
    mapCenter: { lat: 22, lng: 80, zoom: 4 },
    placeNames: [
      "Maurya Empire", "Gupta Empire", "Delhi Sultanate",
      "Mughal Empire", "Vijayanagara Empire", "Maratha Empire", "India",
      "Indus Valley Civilisation",
      "Kushan Empire",
      "Pala Empire",
      "Chola dynasty",
      "Ghaznavid Empire",
      "Sikh Empire",
      "British Raj",
      "Afghanistan",
    ],
  },
  "africa": {
    label: "Africa",
    description: "Home to some of history's most powerful empires and the longest-running continuous civilizations.",
    mapCenter: { lat: 5, lng: 25, zoom: 3 },
    placeNames: [
      "Kingdom of Aksum", "Ghana Empire", "Mali Empire", "Songhai Empire",
      "Kingdom of Kongo", "Egypt", "Zulu Kingdom", "Ethiopia",
      "Kingdom of Kush",
      "Almoravid dynasty",
      "Almohad Caliphate",
      "Kingdom of Great Zimbabwe",
      "Kanem–Bornu Empire",
      "Oyo Empire",
      "Asante Empire",
      "Kingdom of Benin",
      "Sokoto Caliphate",
      "Morocco",
      "South Africa",
      "Early Dynastic Egypt",
      "Middle Kingdom of Egypt",
      "New Kingdom of Egypt",
      "Third Intermediate Period of Egypt",
    ],
  },
  "americas": {
    label: "The Americas",
    description: "Pre-Columbian civilizations and the dramatic collision of Old and New Worlds.",
    mapCenter: { lat: 10, lng: -80, zoom: 3 },
    placeNames: [
      "Aztec Empire", "Inca Empire",
      "United States", "Mexico", "Brazil", "Argentina", "Confederate States",
      "Olmecs",
      "Teotihuacan",
      "Moche culture",
      "Toltec",
      "Tiwanaku",
      "Wari culture",
      "Chimor",
      "Haudenosaunee",
      "Comanche",
      "New Spain",
      "Canada",
    ],
  },
  "central-asia": {
    label: "Central Asia",
    description: "The pivot of the Silk Road and birthplace of some of history's most fearsome conquerors.",
    mapCenter: { lat: 45, lng: 65, zoom: 3 },
    placeNames: [
      "Mongol Empire", "Golden Horde", "Ilkhanate",
      "Timurid Empire", "Tibetan Empire",
      "Scythians",
      "Xiongnu",
      "Göktürks",
      "Khazars",
      "Samanid Empire",
      "Chagatai Khanate",
    ],
  },
  "southeast-asia": {
    label: "Southeast Asia",
    description: "Maritime trade empires and inland kingdoms that linked China, India, and the Arab world.",
    mapCenter: { lat: 10, lng: 110, zoom: 4 },
    placeNames: [
      "Khmer Empire", "Srivijaya", "Majapahit", "Vietnam",
      "Champa",
      "Ayutthaya Kingdom",
    ],
  },
  "oceania": {
    label: "Oceania",
    description: "Tens of thousands of years of Aboriginal Australian history, the great Polynesian voyages, and the Pacific kingdoms and nations that followed.",
    mapCenter: { lat: -15, lng: 160, zoom: 3 },
    placeNames: [
      "Australia", "Hawaiian Kingdom",
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
  return buildPageMetadata({
    title: `History of ${region.label}: Empires & Borders on the Map — Borders of Time`,
    description: metaDescription(`${region.description} See its empires era by era on the map.`)!,
    path: `/region/${slug}`,
  });
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
        <JsonLd
          data={[
            collectionLd(`History of ${region.label}`, region.description, `/region/${slug}`, places.map((p) => ({ name: p.name, path: `/place/${p.entry.slug}` }))),
            breadcrumbLd([["Browse", "/browse"], [region.label, `/region/${slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/browse", label: "Browse" }, { href: "/browse#regions", label: "Regions" }]}
          label="Region"
          title={region.label}
          lede={region.description}
          aside={
            <Link
              href={mapHref}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              See it on the map
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="mb-14"><ReadAloudButton text={region.description} /></div>
          <section>
            <SectionRule count={`${places.length} places`}>Empires &amp; states</SectionRule>
            <Gazetteer
              items={region.placeNames.map(name => {
                const entry = CROSSWALK[name];
                return entry ? { href: `/place/${entry.slug}`, name } : { href: `#${name}`, name, pending: true };
              })}
            />
          </section>

          <div className="mt-20 sm:mt-28 space-y-12">
            {slug === "europe" && (
              <LinkRow title="Related theme" links={[{ href: "/theme/age-of-exploration", label: "The Age of Exploration" }]} />
            )}
            <LinkRow
              title="Other regions"
              links={Object.entries(REGIONS).filter(([s]) => s !== slug).map(([s, r]) => ({ href: `/region/${s}`, label: r.label }))}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
