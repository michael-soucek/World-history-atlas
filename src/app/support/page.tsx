import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SupportButton from "@/components/SupportButton";
import { SUPPORT_URL } from "@/lib/monetization";

export const metadata: Metadata = {
  title: "Support Borders of Time",
  description:
    "Borders of Time is free and independently run. Here's what your support pays for and how to help keep it going.",
};

export default function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-14 space-y-14">
          <header>
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Support</p>
            <h1 className="font-display text-5xl font-bold text-ink italic mb-4">Keep the map running</h1>
            <p className="text-ink/50 text-base leading-relaxed">
              Borders of Time is free to use and always will be for the core map, timeline, and
              tours. It&rsquo;s an independent project, not a company — support from readers is
              what keeps it online.
            </p>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">What support pays for</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <ul className="space-y-3 text-ink/70 text-sm leading-relaxed">
              <li>
                <strong className="text-ink/90">Map tile and API hosting</strong> — serving
                historical border snapshots and place data at speed, for every visitor.
              </li>
              <li>
                <strong className="text-ink/90">The data pipeline</strong> — the scripts that
                fetch, verify, and cache Wikidata/Wikipedia content and keep it up to date.
              </li>
              <li>
                <strong className="text-ink/90">Time spent researching and fixing</strong> border
                errors, broken links, and factual corrections readers report.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Chip in</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            {SUPPORT_URL ? (
              <p className="text-ink/70 text-sm leading-relaxed mb-4">
                A one-time or monthly tip, whatever it&rsquo;s worth to you — no account, no
                subscription required.
              </p>
            ) : (
              <div className="rounded-2xl bg-ancient-wash border border-ancient/20 p-5 mb-4">
                <p className="text-ink/60 text-sm leading-relaxed">
                  Direct tipping (Ko-fi / Buy Me a Coffee) isn&rsquo;t connected yet — this page is
                  ready for it. In the meantime, the best way to help is sharing the site, or{" "}
                  <Link href="/contact" className="text-ancient hover:text-ancient/80 underline">
                    telling us
                  </Link>{" "}
                  what you&rsquo;d find useful in a future{" "}
                  <Link href="/pro" className="text-ancient hover:text-ancient/80 underline">
                    Borders of Time Pro
                  </Link>
                  .
                </p>
              </div>
            )}
            <SupportButton variant="button" />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">A note on affiliate links</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Some &ldquo;further reading &amp; viewing&rdquo; suggestions on people, places, and
              tours may in the future link to booksellers, documentaries, or museum tickets
              through affiliate programs — if you buy through one, we may earn a small commission
              at no extra cost to you. See the full{" "}
              <Link href="/terms" className="text-ancient hover:text-ancient/80 underline">
                disclosure in the Terms of Use
              </Link>
              . Support and affiliate links never change what borders, dates, or facts the map
              shows.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
