import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import SupportButton from "@/components/SupportButton";
import { buildPageMetadata } from "@/lib/seo";
import { BORDER_FIXES } from "@/data/borderFixes";

export const metadata: Metadata = buildPageMetadata({
  title: "About the Data — Borders of Time",
  description:
    "Sources, methodology, and attribution for Borders of Time — an interactive world history atlas. Historical border data, Wikipedia content, and image licensing.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 space-y-16">
        <header>
          <p className="label text-accent mb-5">About</p>
          <h1 className="font-display font-light text-5xl sm:text-7xl tracking-[-0.035em] leading-[1] text-ink mb-6">About the Data</h1>
          <div className="flex flex-col gap-4">
            <p className="text-ink/65 text-lg leading-relaxed">
              Borders of Time aims to show the world&rsquo;s borders honestly, clearly, and fairly.
              Here&rsquo;s exactly where the data comes from and how it&rsquo;s used.
            </p>
            <ReadAloudButton text="Borders of Time aims to show the world's borders honestly, clearly, and fairly. This project uses historical border data from several sources, primarily Ourednik's historical basemaps and OpenHistoricalMap." />
          </div>
        </header>

        {/* Border data */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Historical Border Data</h2>
              <div className="flex-1 h-px bg-paper" />
              <ReadAloudButton 
                text="The primary source for historical borders is aourednik/historical-basemaps by André Ourednik. Supplementary coverage comes from OpenHistoricalMap. We use three precision levels: approximate, estimated, and defined. Note that the slider only snaps to years where sourced data actually exists; no borders are interpolated." 
                variant="minimal" 
                className="opacity-50 hover:opacity-100 pointer-coarse:opacity-100 transition-opacity"
              />
          </div>
          <div className="space-y-4 text-ink/75 text-[16px] leading-relaxed">
            <p>
              The primary source for historical borders is{" "}
              <a
                href="https://github.com/aourednik/historical-basemaps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 underline"
              >
                aourednik/historical-basemaps
              </a>{" "}
              by André Ourednik, an open-licensed collection of GeoJSON snapshots covering world
              history from 3000 BCE to the present.
            </p>
            <p>
              Supplementary coverage comes from{" "}
              <a
                href="https://www.openhistoricalmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 underline"
              >
                OpenHistoricalMap
              </a>
              , a collaborative project that attaches date ranges to geographic features.
            </p>
            <div className="rounded-md bg-card border border-paper p-5 space-y-2">
              <h3 className="text-ink font-medium">Precision levels</h3>
              <ul className="space-y-1.5 text-ink/60">
                <li>
                  <span className="text-accent/80 font-mono">1 — Approximate:</span>{" "}
                  border shown with a blurred/soft edge; location is uncertain.
                </li>
                <li>
                  <span className="text-ink/70 font-mono">2 — Estimated:</span>{" "}
                  reasonable scholarly consensus, but not formally documented.
                </li>
                <li>
                  <span className="text-ink font-mono">3 — Defined:</span>{" "}
                  historically or legally documented border; rendered with a crisp line.
                </li>
              </ul>
            </div>
            <p className="text-ink/50 text-xs">
              <strong className="text-ink/70">Important:</strong> the slider snaps to years
              where sourced data actually exists. No borders are interpolated between data points.
              A steady map between ticks reflects our data&rsquo;s resolution, not history standing still.
            </p>
            <div className="rounded-md bg-accent-wash border border-accent/20 p-5 space-y-2">
              <h3 className="text-accent font-medium text-sm">Known data limitations</h3>
              <ul className="space-y-2 text-ink/55 text-xs leading-relaxed">
                <li>
                  <span className="text-ink/70 font-medium">54 snapshots total</span> — coverage
                  jumps by centuries in ancient history (e.g. nothing between 1000–1100 CE).
                  Each arrow key press jumps to the next real data year.
                </li>
                <li>
                  <span className="text-ink/70 font-medium">Placeholder names</span> — sparsely
                  documented regions (parts of Africa, the Americas, Central Asia before 1000 CE)
                  may be labeled with modern country or region names rather than the historical
                  polity. This is a known issue in the source dataset, not an error in our rendering.
                </li>
                <li>
                  <span className="text-ink/70 font-medium">Simplified boundaries</span> — some
                  pre-modern borders are scholarly estimates drawn at a continental scale. Treat
                  them as approximate extents, not surveyed lines.
                </li>
                <li>
                  Contributions and corrections welcome at{" "}
                  <a
                    href="https://github.com/aourednik/historical-basemaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 underline"
                  >
                    the upstream project
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Euratlas note */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">What We Don&rsquo;t Use</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <p className="text-ink/70 text-sm leading-relaxed">
            Euratlas maps are used only for visual verification. Their vectors are commercially
            licensed and are never ingested, traced, or incorporated into this site.
          </p>
        </section>

        {/* Content */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Text Content</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <p className="text-ink/70 text-sm leading-relaxed">
            Summaries are fetched from the{" "}
            <a
              href="https://en.wikipedia.org/api/rest_v1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              Wikipedia REST API
            </a>{" "}
            and are licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              CC BY-SA 4.0
            </a>
            . Entity data (identifiers, Wikipedia title linkages) comes from{" "}
            <a
              href="https://www.wikidata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              Wikidata
            </a>{" "}
            (CC0 / public domain).
          </p>
        </section>

        {/* Images */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Images</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <p className="text-ink/70 text-sm leading-relaxed">
            Representative images are pulled from{" "}
            <a
              href="https://commons.wikimedia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              Wikimedia Commons
            </a>{" "}
            via the Wikidata{" "}
            <a
              href="https://www.wikidata.org/wiki/Property:P18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              P18 (image)
            </a>{" "}
            property. Each image is displayed with its license and author credit exactly as
            provided by Wikimedia Commons. No AI-generated historical images are used.
          </p>
          <p className="mt-3 text-ink/70 text-sm leading-relaxed">
            Preferred image sources include public domain and CC0 collections such as the
            Smithsonian Open Access, The Metropolitan Museum of Art, the Rijksmuseum, and
            the Cleveland Museum of Art — wherever those are associated with the Wikidata entity.
          </p>
        </section>

        {/* Methodology */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Methodology</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <ul className="space-y-3 text-ink/70 text-sm leading-relaxed">
            <li>
              <strong className="text-ink/90">No fake interpolation.</strong> The map
              only shows states that are supported by source data. Between known snapshot
              years, the display holds steady at the most recent sourced state.
            </li>
            <li>
              <strong className="text-ink/90">Honest precision.</strong> Border fuzziness
              is rendered differently by precision level — approximate borders blur, defined
              borders are crisp.
            </li>
            <li>
              <strong className="text-ink/90">Concrete and fair.</strong> Interpretations
              are attributed; the site does not editorialize.
            </li>
            <li>
              <strong className="text-ink/90">Geometry pipeline.</strong> Borders are
              simplified using{" "}
              <a href="https://github.com/mbloch/mapshaper" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 underline">
                mapshaper
              </a>{" "}
              with topology-preserving Visvalingam–Whyatt simplification, so shared borders
              never split into gaps or slivers.
            </li>
          </ul>
        </section>

        {/* Corrections */}
        <BorderCorrections />

        {/* Contributing */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Contributing &amp; Corrections</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <p className="text-ink/70 text-sm leading-relaxed">
            If you spot a border error, please consider contributing a fix upstream to{" "}
            <a
              href="https://github.com/aourednik/historical-basemaps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              aourednik/historical-basemaps
            </a>{" "}
            per the project&rsquo;s contributing guidelines, or{" "}
            <Link href="/contact" className="text-accent hover:text-accent/80 underline">tell us</Link>{" "}
            and we&rsquo;ll correct it here.
          </p>
        </section>

        {/* Support & Funding */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-3xl tracking-tight text-ink">Support &amp; Funding</h2>
            <div className="flex-1 h-px bg-paper" />
          </div>
          <p className="text-ink/70 text-sm leading-relaxed">
            Borders of Time is a free, independent project — map hosting and the data
            pipeline behind it aren&rsquo;t free to run. If you find it useful, you can{" "}
            <Link href="/support" className="text-accent hover:text-accent/80 underline">
              support the project
            </Link>
            . Some &ldquo;further reading&rdquo; links on people, places, and tours may in the
            future be affiliate links — see the{" "}
            <Link href="/terms" className="text-accent hover:text-accent/80 underline">
              disclosure in the Terms of Use
            </Link>
            . Support never affects what borders, dates, or facts the site shows.
          </p>
          <div className="mt-4">
            <SupportButton variant="button" />
          </div>
        </section>

        <footer className="pt-4 border-t border-paper">
          <p className="text-ink/30 text-xs">
            Borders of Time v1 · Built with{" "}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/50">Next.js</a>
            {" "}and{" "}
            <a href="https://maplibre.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/50">MapLibre GL JS</a>.
          </p>
        </footer>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}

const fmtYear = (y: number) => (y < 0 ? `${-y} BCE` : `${y}`);

/**
 * Every correction the site applies to the source borders
 * (src/data/borderFixes.ts), grouped by map year, each with its reason.
 */
function BorderCorrections() {
  const byYear = new Map<number, string[]>();
  for (const fix of BORDER_FIXES) {
    for (const year of fix.years) byYear.set(year, [...(byYear.get(year) ?? []), fix.why]);
  }
  const years = [...byYear.keys()].sort((a, b) => a - b);
  return (
    <section id="corrections">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-3xl tracking-tight text-ink">Our Corrections to the Borders</h2>
        <div className="flex-1 h-px bg-paper" />
      </div>
      <p className="text-ink/70 text-sm leading-relaxed">
        The source maps are an extraordinary open resource, but some snapshots carry over names and borders
        from an earlier year, or leave states unnamed. We check every map against the historical record, in
        particular which state held each of the 163 cities on our &ldquo;Who ruled it?&rdquo; pages in every year,
        and correct what we find before anything on the site uses it. The corrected borders are a modified
        version of historical-basemaps and, like the original, are released under the GNU General Public
        License v3.0. {BORDER_FIXES.length} corrections currently apply across {years.length} maps:
      </p>
      <div className="mt-5 border-t border-ink/10">
        {years.map((year) => (
          <details key={year} className="group border-b border-ink/10">
            <summary className="cursor-pointer list-none flex items-baseline justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-lg text-ink">{fmtYear(year)}</span>
              <span className="font-mono text-[11px] text-ink/45">{byYear.get(year)!.length} ▾</span>
            </summary>
            <ul className="pb-4 space-y-2 text-ink/70 text-sm leading-relaxed list-disc pl-5">
              {[...new Set(byYear.get(year))].map((why) => <li key={why}>{why}</li>)}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
