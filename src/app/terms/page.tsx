import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use — Borders of Time",
  description: "The terms that govern your use of Borders of Time, including our affiliate-link disclosure.",
};

const LAST_UPDATED = "September 2026";
const CONTACT_EMAIL = "michaelsoucek73@gmail.com";
const SITE_URL = "https://www.bordersoftime.com";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-14 space-y-14">
          <header>
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="font-display text-5xl font-bold text-ink italic mb-4">Terms of Use</h1>
            <p className="text-ink/40 text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <p className="text-ink/70 text-sm leading-relaxed">
            These terms govern your use of Borders of Time at {SITE_URL} (the
            &ldquo;Service&rdquo;). By using the Service you agree to them.
          </p>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">1. What the Service is</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Borders of Time is a free, independently run educational tool for exploring world
              history through an interactive map, timelines, and guided tours. It is not an
              academic or professional reference and does not replace primary sources or expert
              review.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">2. Historical accuracy</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Border data, dates, and facts come from third-party sources (Wikidata, Wikipedia,
              open historical basemaps) with documented limitations — see{" "}
              <Link href="/about" className="text-ancient hover:text-ancient/80 underline">
                About the Data
              </Link>
              . Contested historical topics are presented with multiple perspectives, not a single
              verdict. Verify anything you rely on against a primary or scholarly source.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">3. Affiliate disclosure</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <div className="rounded-2xl bg-ancient-wash border border-ancient/20 p-5">
              <p className="text-ink/70 text-sm leading-relaxed">
                Some links on the Service — for example &ldquo;further reading &amp;
                viewing&rdquo; suggestions for books, documentaries, courses, or museum tickets —
                may be <strong>affiliate links</strong>. If you click one and make a purchase, we
                may earn a commission at no extra cost to you. We only link to things we think are
                genuinely good further reading, and a link being an affiliate link never changes
                the map, timeline, or factual content the Service shows.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">4. Advertising</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              The Service may in the future display advertising from a third-party network or
              direct sponsors, clearly labeled as such. Advertisers do not control editorial
              content, and we do not accept payment to change a historical fact or border shown on
              the map.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">5. Intellectual property</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Border data, text, and images are used under the open licenses described on{" "}
              <Link href="/about" className="text-ancient hover:text-ancient/80 underline">
                About the Data
              </Link>{" "}
              and remain the property of their respective sources. The site&rsquo;s design, code,
              and the selection and arrangement of content are the property of the site operator.
              You may use the Service for personal, non-commercial research and study.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">
                6. &ldquo;As is,&rdquo; no warranty
              </h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express
              or implied, including accuracy, completeness, or fitness for a particular purpose.
              We are not liable for decisions made based on content from the Service, or for
              third-party sites it links to, including affiliate and advertising partners.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">7. Changes</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              We may update these terms as the Service evolves — for example when a support link,
              affiliate program, or ad network is actually turned on. Material changes will be
              reflected by updating the &ldquo;last updated&rdquo; date above.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">8. Governing law</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              These terms are governed by the laws of{" "}
              <span className="italic text-ink/50">[jurisdiction to be set before commercial launch]</span>
              , without regard to conflict-of-laws rules.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">9. Contact</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Questions about these terms:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ancient hover:text-ancient/80 underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
