import Link from "next/link";
import SupportButton from "@/components/SupportButton";
import BrandMark from "@/components/BrandMark";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/map", label: "The map" },
      { href: "/timeline", label: "Timeline" },
      { href: "/tour", label: "Guided tours" },
      { href: "/world-wars", label: "The world wars" },
      { href: "/borders-over-time", label: "Borders over time" },
      { href: "/countries", label: "Country histories" },
      { href: "/philosophy", label: "History of philosophy" },
      { href: "/history-of", label: "Who ruled my city?" },
      { href: "/compare", label: "Compare two years" },
      { href: "/play", label: "Guess the Year" },
      { href: "/browse", label: "Browse" },
      { href: "/theme/age-of-exploration", label: "Voyages" },
    ],
  },
  {
    title: "Sources",
    links: [
      { href: "https://github.com/aourednik/historical-basemaps", label: "historical-basemaps", external: true },
      { href: "https://www.wikipedia.org", label: "Wikipedia", external: true },
      { href: "https://www.wikidata.org", label: "Wikidata", external: true },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Methodology" },
      { href: "/contact", label: "Contact" },
      { href: "mailto:hello@bordersoftime.com", label: "Report an error", external: true },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

/** Site-wide footer. */
export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-night text-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Borders of Time — home">
              <BrandMark className="w-8 h-8 text-glow transition-transform duration-700 group-hover:rotate-[30deg]" />
              <span className="font-display text-2xl tracking-tight">
                Borders <span className="italic">of</span> Time
              </span>
            </Link>
            <p className="mt-5 text-[15px] text-parchment/60 leading-relaxed max-w-sm">
              An independent atlas of five thousand years of history, built on open data and kept free for everyone.
            </p>
            <div className="mt-6">
              <SupportButton variant="button" tone="night" />
            </div>
          </div>

          {COLUMNS.map((col, i) => (
            <nav key={col.title} aria-label={col.title} className={`lg:col-span-2 ${i === 0 ? "lg:col-start-7" : ""}`}>
              <p className="label text-parchment/40 mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a
                        href={l.href}
                        {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-parchment/75 hover:text-glow transition-colors"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-parchment/75 hover:text-glow transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-2 sm:justify-between text-[12px] text-parchment/45 leading-relaxed">
          <span>Written from credible, cited sources. Contested topics present perspectives, not verdicts.</span>
          <span>Borders from historical-basemaps, GPL-3.0, with our corrections · Text from Wikipedia, CC BY-SA 4.0</span>
        </div>
      </div>
    </footer>
  );
}
