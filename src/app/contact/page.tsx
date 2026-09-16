import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — Borders of Time",
  description: "How to report a border or data error, get in touch about a partnership, or reach the person behind Borders of Time.",
};

const CONTACT_EMAIL = "michaelsoucek73@gmail.com";

const REASONS = [
  {
    title: "Report an error",
    body: "A border, date, name, or fact that looks wrong. Please include the page URL and, if you can, a source.",
  },
  {
    title: "Press or partnership",
    body: "Media inquiries, sponsorships, educational partnerships, or licensing questions.",
  },
  {
    title: "Something else",
    body: "Bugs, accessibility issues, feedback, or anything not covered above.",
  },
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-14 space-y-14">
          <header>
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Contact</p>
            <h1 className="font-display text-5xl font-bold text-ink italic mb-4">Get in touch</h1>
            <p className="text-ink/50 text-base leading-relaxed">
              Borders of Time is run by one person. Email is the fastest way to reach me, for
              anything below.
            </p>
          </header>

          <section className="space-y-4">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white/60 border border-paper p-5">
                <h2 className="text-ink font-medium mb-1.5">{r.title}</h2>
                <p className="text-ink/55 text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </section>

          <section>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-ink/40 text-xs leading-relaxed">
              I read every message but can&rsquo;t promise a fast reply. For data corrections,
              you can also contribute directly upstream — see the sources listed on{" "}
              <Link href="/about" className="text-ancient hover:text-ancient/80 underline">
                the About page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
