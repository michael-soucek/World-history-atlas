import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sword, Star, Ship, Shield, FlaskConical, Palette, Compass, type LucideIcon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { CROSSWALK } from "@/data/crosswalk";
import { readableNameFromSlug } from "@/lib/entityResolver";
import { getExplorerBySlug } from "@/data/voyages";

interface Props { params: Promise<{ slug: string }> }

const THEMES: Record<string, {
  label: string;
  Icon: LucideIcon;
  description: string;
  body: string[];
  placeNames: string[];
  peopleSlugs?: string[];
  eventSlugs?: string[];
  cultureSlugs?: string[];
  explorerSlugs?: string[];
  tour?: { slug: string; label: string };
}> = {
  "empires": {
    label: "Empires & Conquests",
    Icon: Sword,
    description: "The great imperial powers that shaped borders, languages, and cultures across the world.",
    body: [
      "For most of recorded history, the largest political units on earth were empires — states in which a dominant power ruled over many peoples and territories. From the Achaemenid Persians and the Romans of antiquity to the Mongols who built the largest contiguous land empire ever known, empires spread languages, laws, religions, and technologies far beyond their origins.",
      "Empires rose through a mixture of military conquest, administrative innovation, and economic power, and they fell through overextension, succession crises, invasion, and revolt. Their frontiers were never static: the same region might pass through Roman, Byzantine, Umayyad, and Ottoman hands over the centuries.",
      "The imperial age reached its greatest global extent in the 19th and early 20th centuries, when a handful of European powers governed much of the planet — before two world wars and waves of independence movements dissolved the overseas empires in the decades after 1945.",
    ],
    placeNames: [
      "Roman Empire", "Mongol Empire", "British Empire", "Spanish Empire",
      "Ottoman Empire", "Mughal Empire", "Achaemenid Empire", "Macedonian Empire",
      "Qing dynasty", "Russian Empire", "First French Empire",
    ],
    peopleSlugs: ["alexander-the-great", "genghis-khan", "augustus", "napoleon", "cyrus-the-great", "suleiman-the-magnificent", "akbar"],
    eventSlugs: ["fall-of-rome", "mongol-invasion-of-europe", "fall-of-tenochtitlan", "spanish-conquest-of-the-inca-empire", "meiji-restoration"],
    cultureSlugs: ["aztec-civilization", "inca-civilization", "hellenistic-period"],
  },
  "religions": {
    label: "Religion & Belief",
    Icon: Star,
    description: "How faith shaped empires, inspired art, and divided or united peoples across history.",
    body: [
      "Religion has been among the most powerful forces in history — shaping law, art, warfare, and identity. The great belief systems of antiquity gave way to the world religions that still command billions of followers: Buddhism spreading along the Silk Road, Christianity becoming the faith of the Roman world, and Islam uniting Arabia and expanding across three continents within a century.",
      "Faith and political power were rarely separate. Caliphs claimed succession to the Prophet; Roman and Byzantine emperors convened church councils; the Papal States made the head of a church a temporal ruler. Religious institutions preserved learning, built the era's greatest monuments, and legitimized — or challenged — the authority of kings.",
      "Belief also divided. The Crusades, the fall of Constantinople, and centuries of religious warfare reshaped borders and populations, even as pilgrimage, scholarship, and missionary work knit distant societies together.",
    ],
    placeNames: [
      "Rashidun Caliphate", "Umayyad Caliphate", "Abbasid Caliphate",
      "Papal States", "Byzantine Empire",
    ],
    peopleSlugs: ["constantine-i", "saladin", "charlemagne"],
    eventSlugs: ["crusades", "fall-of-constantinople", "protestant-reformation"],
    cultureSlugs: ["islamic-golden-age", "confucianism"],
  },
  "trade-routes": {
    label: "Trade Routes",
    Icon: Ship,
    description: "The great corridors of commerce — the Silk Road, Indian Ocean trade, and the spice routes.",
    body: [
      "Long before globalization, trade routes linked the world's civilizations. The overland Silk Road carried silk, spices, and ideas between China, Central Asia, and the Mediterranean, while monsoon winds powered a vast Indian Ocean network connecting East Africa, Arabia, India, and Southeast Asia.",
      "Across the Sahara, camel caravans exchanged West African gold and salt, enriching the empires of Ghana, Mali, and Songhai. Maritime states such as Srivijaya and Majapahit grew wealthy controlling the straits through which Asian trade flowed. Wherever goods moved, so did religions, technologies, languages — and diseases.",
      "The search for direct access to these riches ultimately launched the European Age of Discovery, connecting the hemispheres and reshaping global commerce for good.",
    ],
    placeNames: [
      "Srivijaya", "Majapahit", "Mali Empire", "Ghana Empire",
      "Republic of Venice", "Portuguese Empire", "Dutch Republic",
    ],
    peopleSlugs: ["kublai-khan"],
    eventSlugs: ["age-of-discovery", "bantu-expansion"],
    cultureSlugs: ["silk-road", "polynesian-navigation"],
  },
  "conflicts": {
    label: "Wars & Conflicts",
    Icon: Shield,
    description: "Decisive battles and wars that reshuffled borders and toppled dynasties.",
    body: [
      "War has repeatedly redrawn the map of the world. Decisive battles — Marathon, the fall of Rome, the siege of Constantinople — turned the course of whole civilizations, while long conflicts exhausted empires and cleared the way for new powers.",
      "The character of warfare changed dramatically over time: from the phalanxes and legions of antiquity, through the cavalry armies of the steppe and the gunpowder empires of the early modern age, to the industrialized total wars of the 20th century. Each shift altered not just how battles were fought, but which societies could dominate others.",
      "The two World Wars of the 20th century were the deadliest conflicts in human history, killing tens of millions, toppling four empires in their first act, and reshaping the political order of the entire globe in their second.",
    ],
    placeNames: [
      "Holy Roman Empire", "Mongol Empire", "First French Empire",
      "Nazi Germany", "Austria-Hungary", "German Empire",
    ],
    peopleSlugs: ["hannibal", "napoleon", "attila-the-hun"],
    eventSlugs: ["battle-of-marathon", "fall-of-rome", "crusades", "mongol-invasion-of-europe", "french-revolution", "fall-of-constantinople", "battle-of-hastings", "an-lushan-rebellion", "siege-of-baghdad", "american-revolution", "haitian-revolution"],
  },
  "science": {
    label: "Science & Invention",
    Icon: FlaskConical,
    description: "Periods and places that drove the greatest leaps in human knowledge.",
    body: [
      "The advance of human knowledge has never followed a single line. Different eras and regions became crucibles of discovery: the mathematics and astronomy of the ancient world, the algebra, medicine, and optics of the Islamic Golden Age, and the Chinese inventions — paper, printing, gunpowder, and the compass — that transformed societies far beyond their origins.",
      "The European Renaissance revived classical learning and set the stage for the Scientific Revolution, when figures across the continent reimagined the cosmos and the methods for studying it. The Industrial Revolution then harnessed science to power, remaking economies and daily life.",
      "Knowledge traveled along the same routes as trade and conquest — carried by scholars, translated in great libraries, and preserved across the rise and fall of empires.",
    ],
    placeNames: [
      "Abbasid Caliphate", "Kingdom of France", "British Empire",
      "United Kingdom",
    ],
    cultureSlugs: ["islamic-golden-age", "renaissance"],
    eventSlugs: ["house-of-wisdom"],
  },
  "art-culture": {
    label: "Art & Culture",
    Icon: Palette,
    description: "Civilizations renowned for art, architecture, literature, and philosophy.",
    body: [
      "Every great civilization has left its mark in art and culture — from the monumental temples of ancient Egypt and the philosophy and sculpture of classical Greece, to the poetry of Tang China and the domes and mosaics of Byzantium.",
      "Art was rarely made for its own sake alone. It expressed religious devotion, glorified rulers, and bound communities together through shared stories, music, and ritual. Patronage by emperors, caliphs, popes, and merchant republics funded some of humanity's most enduring achievements.",
      "The European Renaissance, drawing on rediscovered classical models, produced an extraordinary flowering of painting, architecture, and literature — while parallel traditions across Asia, Africa, and the Americas developed their own rich artistic worlds.",
    ],
    placeNames: [
      "Roman Empire", "Han dynasty", "Mughal Empire",
      "Byzantine Empire", "Kingdom of France",
    ],
    cultureSlugs: ["renaissance", "ancient-greece", "ancient-rome", "ancient-egypt", "feudal-japan", "maya-civilization", "aztec-civilization", "inca-civilization", "hellenistic-period"],
  },
  "age-of-exploration": {
    label: "Age of Exploration",
    Icon: Compass,
    description: "The voyages that connected the world's oceans — and the explorers whose journeys are best understood as routes, not territories.",
    body: [
      "From the 15th to the 18th centuries, seafarers from Europe, and earlier from Ming China and the Islamic world, pushed into waters no chart yet described. Driven by the search for trade routes, wealth, knowledge, and glory, they linked the continents by sea for the first time — with consequences, both creative and catastrophic, that reshaped every society they touched.",
      "Portuguese captains felt their way around Africa to India; Columbus crossed the Atlantic; Magellan's expedition circled the globe. In the Pacific, James Cook's three voyages charted New Zealand, the eastern coast of Australia, and the Hawaiian Islands, and probed the ice of both polar oceans. Long before them, Zheng He's treasure fleets and Ibn Battuta's overland journeys had already spanned the Indian Ocean world.",
      "An explorer's significance lies not in a border on a map but in a line across it — a path with dated waypoints. The profiles below plot those journeys directly onto the atlas map.",
    ],
    placeNames: [
      "Portuguese Empire", "Spanish Empire", "Dutch Republic",
      "British Empire", "Ming dynasty", "Republic of Venice",
    ],
    eventSlugs: ["age-of-discovery"],
    cultureSlugs: ["polynesian-navigation"],
    explorerSlugs: ["james-cook", "ferdinand-magellan", "christopher-columbus", "vasco-da-gama", "zheng-he", "ibn-battuta"],
    tour: { slug: "age-of-discovery", label: "The Age of Discovery" },
  },
};

export async function generateStaticParams() {
  return Object.keys(THEMES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const theme = THEMES[slug];
  if (!theme) return { title: "Theme — World History Atlas" };
  return {
    title: `${theme.label} — World History Atlas`,
    description: theme.description,
  };
}

export default async function ThemePage({ params }: Props) {
  const { slug } = await params;
  const theme = THEMES[slug];
  if (!theme) notFound();

  const places = theme.placeNames
    .map(name => ({ name, entry: CROSSWALK[name] }))
    .filter(p => p.entry != null);

  const people = (theme.peopleSlugs ?? []).map(s => ({ slug: s, name: readableNameFromSlug(s) }));
  const events = (theme.eventSlugs ?? []).map(s => ({ slug: s, name: readableNameFromSlug(s) }));
  const cultures = (theme.cultureSlugs ?? []).map(s => ({ slug: s, name: readableNameFromSlug(s) }));
  const explorers = (theme.explorerSlugs ?? [])
    .map(s => getExplorerBySlug(s))
    .filter((e): e is NonNullable<typeof e> => e != null);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
            <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
            <span className="text-ink/20">/</span>
            <Link href="/browse#themes" className="hover:text-ancient/80 transition-colors">Themes</Link>
            <span className="text-ink/20">/</span>
            <span className="text-ink/55">{theme.label}</span>
          </nav>

          {/* Title block */}
          <div className="flex items-start gap-5 mb-4">
            <theme.Icon size={44} className="text-ink/30 mt-2 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Theme</p>
              <HandwrittenTitle className="font-display text-5xl font-bold text-ink italic leading-tight">{theme.label}</HandwrittenTitle>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mb-10 max-w-xl">
            <ReadAloudButton text={[theme.description, ...theme.body].join(" ")} />
            <p className="text-ink/45 text-base leading-relaxed">{theme.description}</p>
          </div>

          {/* Narrative body */}
          <div className="max-w-2xl space-y-6 mb-14 border-l-2 border-ancient/20 pl-6">
            {theme.body.map((para, i) => (
              <div key={i} className="group relative flex gap-4">
                <ReadAloudButton 
                  text={para} 
                  variant="minimal" 
                  className="shrink-0 mt-1 opacity-20 group-hover:opacity-100 transition-opacity" 
                />
                <p className="text-ink/75 text-[15px] leading-[1.85]">{para}</p>
              </div>
            ))}
          </div>

          {/* Explorers & voyages */}
          {explorers.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-xl font-semibold text-ink/70 italic">Explorers &amp; voyages</h2>
                <div className="flex-1 h-px bg-paper" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {explorers.map((ex) => (
                  <Link
                    key={ex.slug}
                    href={`/explorer/${ex.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 p-5 transition-all duration-200"
                  >
                    <Compass size={22} className="text-ink/30 group-hover:text-ancient shrink-0 mt-1 transition-colors" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-base font-semibold text-ink group-hover:text-ancient transition-colors">{ex.name}</span>
                        <span className="text-ink/35 text-xs font-mono">{ex.lifespan}</span>
                        {ex.status === "full" ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wide rounded-full border border-medieval/30 bg-medieval-wash text-medieval px-2 py-0.5">Mapped voyages</span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase tracking-wide rounded-full border border-paper bg-surface text-ink/40 px-2 py-0.5">Coming soon</span>
                        )}
                      </div>
                      <p className="text-ink/50 text-xs mt-1.5 leading-snug">{ex.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related tour */}
          {theme.tour && (
            <Link
              href={`/tour/${theme.tour.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-ancient/20 bg-ancient-wash/60 hover:bg-ancient-wash px-5 py-4 mb-12 transition-all duration-200"
            >
              <Ship size={18} className="text-ancient/70 shrink-0" aria-hidden="true" />
              <span className="text-sm text-ink/70">
                Prefer a guided walkthrough? Take the{" "}
                <span className="font-semibold text-ancient group-hover:underline">{theme.tour.label}</span> tour.
              </span>
            </Link>
          )}

          {/* Related places */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Related empires &amp; places</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {places.map(({ name, entry }) => (
                <Link
                  key={entry!.slug}
                  href={`/place/${entry!.slug}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                >
                  {name}
                </Link>
              ))}
            </div>
          </section>

          {/* Related people */}
          {people.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-xl font-semibold text-ink/70 italic">Related people</h2>
                <div className="flex-1 h-px bg-paper" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {people.map(p => (
                  <Link
                    key={p.slug}
                    href={`/person/${p.slug}`}
                    className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related events */}
          {events.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-xl font-semibold text-ink/70 italic">Related events</h2>
                <div className="flex-1 h-px bg-paper" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {events.map(e => (
                  <Link
                    key={e.slug}
                    href={`/event/${e.slug}`}
                    className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                  >
                    {e.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related topics / cultures */}
          {cultures.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-xl font-semibold text-ink/70 italic">Related topics</h2>
                <div className="flex-1 h-px bg-paper" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {cultures.map(c => (
                  <Link
                    key={c.slug}
                    href={`/culture/${c.slug}`}
                    className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other themes */}
          <div className="border-t border-paper pt-8 mt-14">
            <p className="text-ink/25 text-xs uppercase tracking-widest mb-4">Other themes</p>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(THEMES).filter(([s]) => s !== slug).map(([s, t]) => (
                <Link
                  key={s}
                  href={`/theme/${s}`}
                  className="flex items-center gap-2 rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-2.5 text-sm text-ink/50 hover:text-ink transition-all duration-200"
                >
                  <t.Icon size={13} className="text-ink/40 shrink-0" aria-hidden="true" />
                  <span>{t.label}</span>
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
