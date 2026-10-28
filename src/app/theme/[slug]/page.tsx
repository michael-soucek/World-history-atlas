import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sword, Star, Ship, Shield, FlaskConical, Palette, Compass, Flag, type LucideIcon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import Gazetteer, { LinkRow } from "@/components/Gazetteer";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { CROSSWALK } from "@/data/crosswalk";
import { readableNameFromSlug } from "@/lib/entityResolver";
import { getExplorerBySlug } from "@/data/voyages";
import { buildPageMetadata, metaDescription, brandTitle } from "@/lib/seo";

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
      "Qing dynasty", "Russian Empire", "First French Empire", "Assyria", "Yuan dynasty", "British Raj", "Soviet Union"],
    peopleSlugs: ["alexander-the-great", "genghis-khan", "augustus", "napoleon", "cyrus-the-great", "suleiman-the-magnificent", "akbar", "sargon-of-akkad", "darius-the-great", "qin-shi-huang", "ashoka", "justinian-i", "mansa-musa", "pachacuti", "moctezuma-ii", "charles-v-holy-roman-emperor", "peter-the-great", "catherine-the-great", "louis-xiv", "queen-victoria"],
    eventSlugs: ["fall-of-rome", "mongol-invasion-of-europe", "fall-of-tenochtitlan", "spanish-conquest-of-the-inca-empire", "meiji-restoration", "qins-wars-of-unification", "scramble-for-africa", "unification-of-germany", "decolonisation-of-africa", "dissolution-of-the-soviet-union"],
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
    peopleSlugs: ["constantine-i", "saladin", "charlemagne", "buddha", "confucius", "jesus", "muhammad", "ashoka", "martin-luther"],
    eventSlugs: ["crusades", "fall-of-constantinople", "protestant-reformation", "reconquista", "thirty-years-war"],
    cultureSlugs: ["islamic-golden-age", "confucianism", "judaism", "hinduism", "buddhism", "zoroastrianism", "christianity", "islam"],
    tour: { slug: "world-religions", label: "How the World's Religions Began" },
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
    peopleSlugs: ["kublai-khan", "mansa-musa"],
    eventSlugs: ["age-of-discovery", "bantu-expansion", "columbian-exchange", "atlantic-slave-trade", "first-opium-war"],
    cultureSlugs: ["silk-road", "polynesian-navigation", "phoenicia", "swahili-culture"],
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
    peopleSlugs: ["hannibal", "napoleon", "attila-the-hun", "joan-of-arc", "shaka", "winston-churchill", "franklin-d-roosevelt", "joseph-stalin", "adolf-hitler"],
    eventSlugs: ["battle-of-marathon", "fall-of-rome", "crusades", "mongol-invasion-of-europe", "french-revolution", "fall-of-constantinople", "battle-of-hastings", "an-lushan-rebellion", "siege-of-baghdad", "american-revolution", "haitian-revolution", "greco-persian-wars", "peloponnesian-war", "punic-wars", "battle-of-tours", "battle-of-ain-jalut", "hundred-years-war", "sengoku-period", "thirty-years-war", "napoleonic-wars", "taiping-rebellion", "american-civil-war", "world-war-i", "world-war-ii", "holocaust", "chinese-civil-war", "korean-war", "vietnam-war", "cold-war", "cuban-missile-crisis"],
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
    cultureSlugs: ["islamic-golden-age", "renaissance", "sumer", "scientific-revolution", "age-of-enlightenment"],
    eventSlugs: ["house-of-wisdom", "neolithic-revolution", "industrial-revolution", "apollo-11"],
    peopleSlugs: ["aristotle", "leonardo-da-vinci", "galileo-galilei", "isaac-newton", "charles-darwin", "marie-curie", "albert-einstein"],
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
    cultureSlugs: ["renaissance", "ancient-greece", "ancient-rome", "ancient-egypt", "feudal-japan", "maya-civilization", "aztec-civilization", "inca-civilization", "hellenistic-period", "sumer", "mycenaean-greece", "nok-culture", "mississippian-culture", "ancestral-puebloans", "aboriginal-australians"],
    peopleSlugs: ["pericles", "socrates", "plato", "leonardo-da-vinci", "shah-jahan"],
  },
  "revolutions": {
    label: "Revolutions & Independence",
    Icon: Flag,
    description: "Uprisings, independence movements and the end of empires — how ordinary people overturned old orders.",
    body: [
      "From the late 1600s onward, a wave of revolutions challenged kings, colonial rulers and empires. England's Glorious Revolution limited royal power; the American, French and Haitian revolutions spread ideas of popular sovereignty and, in Haiti's case, ended slavery by force.",
      "In the 1800s Latin America broke from Spain and Portugal, Japan remade itself in the Meiji Restoration, and Italy and Germany unified into nation-states. The 20th century brought revolution in Russia and China, and a great wave of decolonization as India, Africa and Southeast Asia won independence.",
      "The cycle continued to the end of the century: the revolutions of 1989 brought down communist governments across Eastern Europe, and the Soviet Union itself dissolved in 1991 — redrawing the map of Europe and Asia once again.",
    ],
    placeNames: ["Haiti", "United States", "Soviet Union", "British Raj", "South Africa"],
    peopleSlugs: ["george-washington", "toussaint-louverture", "simon-bolivar", "sun-yat-sen", "vladimir-lenin", "mahatma-gandhi", "mao-zedong", "ho-chi-minh", "nelson-mandela"],
    tour: { slug: "age-of-revolutions", label: "The Age of Revolutions" },
    eventSlugs: ["glorious-revolution", "american-revolution", "french-revolution", "haitian-revolution", "spanish-american-wars-of-independence", "meiji-restoration", "unification-of-italy", "unification-of-germany", "russian-revolution", "partition-of-india", "decolonisation-of-africa", "revolutions-of-1989", "dissolution-of-the-soviet-union"],
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
    explorerSlugs: ["leif-erikson", "marco-polo", "ibn-battuta", "zheng-he", "christopher-columbus", "vasco-da-gama", "ferdinand-magellan", "james-cook", "lewis-and-clark", "charles-darwin"],
    tour: { slug: "age-of-discovery", label: "The Age of Discovery" },
  },
};

export async function generateStaticParams() {
  return Object.keys(THEMES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const theme = THEMES[slug];
  if (!theme) return { title: "Theme — Borders of Time" };
  return buildPageMetadata({
    title: brandTitle(`${theme.label} in World History: Maps, Places & People`),
    description: metaDescription(`${theme.description} Explore the empires, people and events behind it on the interactive history map.`)!,
    path: `/theme/${slug}`,
  });
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

  const index = [
    { title: "Empires & places", items: places.map(({ name, entry }) => ({ href: `/place/${entry!.slug}`, name })) },
    { title: "People", items: people.map(p => ({ href: `/person/${p.slug}`, name: p.name })) },
    { title: "Events", items: events.map(e => ({ href: `/event/${e.slug}`, name: e.name })) },
    { title: "Cultures & topics", items: cultures.map(c => ({ href: `/culture/${c.slug}`, name: c.name })) },
  ].filter(g => g.items.length > 0);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd(theme.label, theme.description, `/theme/${slug}`, places.map((p) => ({ name: p.name, path: `/place/${p.entry.slug}` }))),
            breadcrumbLd([["Browse", "/browse"], [theme.label, `/theme/${slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/browse", label: "Browse" }, { href: "/browse#themes", label: "Themes" }]}
          label="Theme"
          title={theme.label}
          lede={theme.description}
          aside={<theme.Icon size={40} strokeWidth={1.1} className="text-accent lg:ml-auto" aria-hidden="true" />}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-7 xl:col-start-2">
              <div className="mb-8"><ReadAloudButton text={[theme.description, ...theme.body].join(" ")} /></div>
              <div className="space-y-6">
                {theme.body.map((para, i) => (
                  <p key={i} className={`font-text text-ink/85 text-[18px] sm:text-[19px] leading-[1.72] ${i === 0 ? "dropcap" : ""}`}>{para}</p>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9 xl:col-start-10 xl:col-span-3 space-y-6">
              {theme.tour && (
                <Link href={`/tour/${theme.tour.slug}`} className="group block bg-night text-parchment p-6 relative overflow-hidden">
                  <div className="absolute inset-0 graticule-night opacity-80" aria-hidden="true" />
                  <div className="relative">
                    <Ship size={18} className="text-glow" aria-hidden="true" />
                    <p className="mt-6 label text-glow/80">Guided tour</p>
                    <p className="mt-2 font-display text-[26px] leading-[1.1] tracking-tight">{theme.tour.label}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm text-parchment/70 group-hover:text-parchment transition-colors">
                      Start the tour <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              )}
            </aside>
          </div>

          {explorers.length > 0 && (
            <section className="mt-20 sm:mt-28">
              <SectionRule count={`${explorers.length} explorers`}>Explorers &amp; voyages</SectionRule>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                {explorers.map((ex) => (
                  <li key={ex.slug} className="border-b border-ink/10">
                    <Link href={`/explorer/${ex.slug}`} className="group flex items-start gap-5 py-6">
                      <Compass size={20} strokeWidth={1.5} className="text-ink/35 group-hover:text-accent shrink-0 mt-1.5 transition-colors" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="font-mono text-[11px] tracking-wider text-ink/45">
                          {ex.lifespan} · {ex.status === "full" ? "Route mapped" : "Route coming soon"}
                        </span>
                        <span className="block mt-1 font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors">{ex.name}</span>
                        <span className="block mt-1.5 text-sm text-ink/55 leading-snug">{ex.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {index.map(g => (
            <section key={g.title} className="mt-20 sm:mt-24">
              <SectionRule count={g.items.length}>{g.title}</SectionRule>
              <Gazetteer items={g.items} />
            </section>
          ))}

          <div className="mt-20 sm:mt-28">
            <LinkRow
              title="Other themes"
              links={Object.entries(THEMES).filter(([s]) => s !== slug).map(([s, t]) => ({ href: `/theme/${s}`, label: t.label }))}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
