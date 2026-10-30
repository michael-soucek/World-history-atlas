import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — Borders of Time",
  description: "How to report a border or data error, get in touch about a partnership, or reach the person behind Borders of Time.",
  path: "/contact",
});

const CONTACT_EMAIL = "hello@bordersoftime.com";

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 space-y-16">
          <header>
            <p className="label text-accent mb-5">Contact</p>
            <h1 className="font-display font-light text-5xl sm:text-7xl tracking-[-0.035em] leading-[1] text-ink mb-6">Get in touch</h1>
            <p className="text-ink/65 text-lg leading-relaxed">
              Borders of Time is run by one person. Email is the fastest way to reach me, for
              anything below.
            </p>
          </header>

          <section className="space-y-4">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-md bg-card border border-paper p-5">
                <h2 className="text-ink font-medium mb-1.5">{r.title}</h2>
                <p className="text-ink/70 text-sm leading-relaxed">{r.body}</p>
              </div>
            ))}
          </section>

          <section>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold bg-ink text-parchment hover:bg-accent transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-ink/64 text-xs leading-relaxed">
              I read every message but can&rsquo;t promise a fast reply. For data corrections,
              you can also contribute directly upstream — see the sources listed on{" "}
              <Link href="/about" className="text-accent hover:text-accent/80 underline">
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
