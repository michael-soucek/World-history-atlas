import Link from "next/link";

/** Site-wide footer: attribution, nav, data sources. */
export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-surface border-t border-paper">
      {/* Top amber rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-ancient/35 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">
        {/* Brand */}
        <div>
          <Link href="/" className="font-display text-ink font-semibold text-base hover:text-ancient transition-colors italic">
            World History Atlas
          </Link>
          <p className="mt-3 text-ink/40 text-xs leading-relaxed max-w-xs">
            Explore how the world&rsquo;s empires and nations rose, shifted, and fell — year by year. Powered by open historical data.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Footer navigation">
          <p className="font-semibold text-ink/35 text-xs uppercase tracking-widest mb-4">Explore</p>
          <ul className="space-y-2.5 text-ink/50">
            <li><Link href="/map" className="hover:text-ancient transition-colors">Map</Link></li>
            <li><Link href="/timeline" className="hover:text-ancient transition-colors">Timeline</Link></li>
            <li><Link href="/browse" className="hover:text-ancient transition-colors">Browse by era / region</Link></li>
            <li><Link href="/tour" className="hover:text-ancient transition-colors">Guided tours</Link></li>
            <li><Link href="/search" className="hover:text-ancient transition-colors">Search</Link></li>
          </ul>
        </nav>

        {/* Data & Attribution */}
        <div>
          <p className="font-semibold text-ink/35 text-xs uppercase tracking-widest mb-4">Data &amp; Attribution</p>
          <ul className="space-y-2.5 text-ink/40 text-xs leading-relaxed">
            <li>
              Border data:{" "}
              <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noopener noreferrer" className="text-ancient/70 hover:text-ancient underline underline-offset-2 transition-colors">
                aourednik/historical-basemaps
              </a>{" "}(CC BY-SA 4.0)
            </li>
            <li>
              Supplementary:{" "}
              <a href="https://www.openhistoricalmap.org" target="_blank" rel="noopener noreferrer" className="text-ancient/70 hover:text-ancient underline underline-offset-2 transition-colors">
                OpenHistoricalMap
              </a>{" "}(ODbL)
            </li>
            <li>
              Text: Wikipedia (CC BY-SA 4.0). Data:{" "}
              <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" className="text-ancient/70 hover:text-ancient underline underline-offset-2 transition-colors">
                Wikidata
              </a>{" "}(CC0).
            </li>
            <li>
              <Link href="/about" className="hover:text-ancient transition-colors underline underline-offset-2">
                Full methodology &amp; attribution →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/5 px-4 sm:px-6 py-4 max-w-6xl mx-auto text-xs text-ink/30 flex flex-wrap gap-4 justify-between">
        <span>No AI-generated history. Contested topics present perspectives, not verdicts.</span>
        <a href="mailto:michaelsoucek73@gmail.com" className="hover:text-ink/50 underline underline-offset-2 transition-colors">
          Report an error / contribute
        </a>
      </div>
    </footer>
  );
}
