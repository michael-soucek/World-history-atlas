import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — Borders of Time",
  description: "What Borders of Time collects, why, and how to reach us with a privacy question.",
  path: "/privacy",
});

const LAST_UPDATED = "September 2026";
const CONTACT_EMAIL = "michaelsoucek73@gmail.com";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-14 space-y-14">
          <header>
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
            <h1 className="font-display text-5xl font-bold text-ink italic mb-4">Privacy Policy</h1>
            <p className="text-ink/40 text-sm">Last updated: {LAST_UPDATED}</p>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">The short version</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Borders of Time has no user accounts and does not ask you for personal information.
              We use a single privacy-focused analytics tool to understand which pages get read,
              and nothing more.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">What we collect today</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <ul className="space-y-3 text-ink/70 text-sm leading-relaxed">
              <li>
                <strong className="text-ink/90">Analytics.</strong> We use Vercel Web Analytics,
                which counts page views and general visitor trends (page, referrer, country,
                device type) without cookies or cross-site tracking, and does not build a profile
                of you individually.
              </li>
              <li>
                <strong className="text-ink/90">Hosting logs.</strong> Our hosting provider, like
                any web host, may briefly log standard request data (IP address, user agent) to
                run and secure the service.
              </li>
              <li>
                <strong className="text-ink/90">Email, if you write to us.</strong> If you contact
                us, we keep that email only to respond and to fix whatever you reported.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">If this changes</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              We&rsquo;re exploring ways to fund the site without depending on invasive ad
              networks — a support link, affiliate links on &ldquo;further reading&rdquo;
              suggestions, and possibly a display-ad network in the future. If we activate an ad
              network, it may set its own cookies and this policy will be updated first, with the
              &ldquo;last updated&rdquo; date above changed, and a consent banner shown where the
              law requires one (GDPR/ePrivacy in the EU/UK and similar rules elsewhere). See our{" "}
              <Link href="/terms" className="text-ancient hover:text-ancient/80 underline">
                Terms of Use
              </Link>{" "}
              for the current affiliate-link disclosure.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">External links</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              The site links out to Wikipedia, Wikimedia Commons, Wikidata, and (in the future)
              booksellers, documentary platforms, and museums. Those sites have their own privacy
              policies, which we don&rsquo;t control.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Children</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              The site is intended for a general audience, including students and teachers using
              it for educational purposes, and does not knowingly collect personal information
              from children.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Contact</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">
              Questions about this policy:{" "}
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
