import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sword, Star, Ship, Shield, FlaskConical, Palette, type LucideIcon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { CROSSWALK } from "@/data/crosswalk";

interface Props { params: Promise<{ slug: string }> }

const THEMES: Record<string, {
  label: string;
  Icon: LucideIcon;
  description: string;
  placeNames: string[];
  peopleSlugs?: string[];
}> = {
  "empires": {
    label: "Empires & Conquests",
    Icon: Sword,
    description: "The great imperial powers that shaped borders, languages, and cultures across the world.",
    placeNames: [
      "Roman Empire", "Mongol Empire", "British Empire", "Spanish Empire",
      "Ottoman Empire", "Mughal Empire", "Achaemenid Empire", "Macedonian Empire",
      "Qing dynasty", "Russian Empire", "First French Empire",
    ],
  },
  "religions": {
    label: "Religion & Belief",
    Icon: Star,
    description: "How faith shaped empires, inspired art, and divided or united peoples across history.",
    placeNames: [
      "Rashidun Caliphate", "Umayyad Caliphate", "Abbasid Caliphate",
      "Papal States", "Byzantine Empire",
    ],
  },
  "trade-routes": {
    label: "Trade Routes",
    Icon: Ship,
    description: "The great corridors of commerce — the Silk Road, Indian Ocean trade, and the spice routes.",
    placeNames: [
      "Srivijaya", "Majapahit", "Mali Empire", "Ghana Empire",
      "Republic of Venice", "Portuguese Empire", "Dutch Republic",
    ],
  },
  "conflicts": {
    label: "Wars & Conflicts",
    Icon: Shield,
    description: "Decisive battles and wars that reshuffled borders and toppled dynasties.",
    placeNames: [
      "Holy Roman Empire", "Mongol Empire", "First French Empire",
      "Nazi Germany", "Austria-Hungary", "German Empire",
    ],
  },
  "science": {
    label: "Science & Invention",
    Icon: FlaskConical,
    description: "Periods and places that drove the greatest leaps in human knowledge.",
    placeNames: [
      "Abbasid Caliphate", "Kingdom of France", "British Empire",
      "United Kingdom",
    ],
  },
  "art-culture": {
    label: "Art & Culture",
    Icon: Palette,
    description: "Civilizations renowned for art, architecture, literature, and philosophy.",
    placeNames: [
      "Roman Empire", "Han dynasty", "Mughal Empire",
      "Byzantine Empire", "Kingdom of France",
    ],
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
          <p className="text-ink/45 text-base mb-14 max-w-xl leading-relaxed">{theme.description}</p>

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
