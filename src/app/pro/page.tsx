import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Bookmark, Palette, Download, GraduationCap, ShieldOff } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Borders of Time Pro (coming soon)",
  description: "A look at what a future Borders of Time Pro tier could include — nothing here is built or for sale yet.",
  path: "/pro",
});

const FEATURES = [
  {
    icon: Bookmark,
    title: "Saved places & custom maps",
    body: "Pin places and eras you care about, and build a personal atlas that persists across visits.",
  },
  {
    icon: Palette,
    title: "Custom map themes",
    body: "Alternate palettes and label styles for presentations, printing, or just your own taste.",
  },
  {
    icon: Download,
    title: "High-resolution exports",
    body: "Export the map at a given year, or a timeline segment, as a print-ready image or PDF.",
  },
  {
    icon: GraduationCap,
    title: "Classroom tools",
    body: "Printable worksheets, a simplified student view, and shareable links to a specific map state for lesson plans.",
  },
  {
    icon: ShieldOff,
    title: "Ad-free browsing",
    body: "If a display-ad network is ever active on the free tier, Pro removes it entirely.",
  },
];

export default function ProPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 space-y-16">
          <header>
            <p className="label text-accent mb-5">Coming eventually</p>
            <h1 className="font-display font-light text-5xl sm:text-7xl tracking-[-0.035em] leading-[1] text-ink mb-6">Borders of Time Pro</h1>
            <p className="text-ink/65 text-lg leading-relaxed">
              Nothing on this page exists yet — no sign-up, no payment, nothing to click. This is
              a preview of what a future paid tier might include, so we can gauge interest before
              building it. The core map, timeline, and tours will always stay free.
            </p>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-3xl tracking-tight text-ink">Ideas under consideration</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-md bg-card border border-paper p-5">
                  <Icon size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="text-ink font-medium mb-1">{title}</h3>
                    <p className="text-ink/70 text-sm leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-3xl tracking-tight text-ink">Tell us what you&rsquo;d want</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <p className="text-ink/70 text-sm leading-relaxed mb-4">
              If one of these would genuinely be worth paying for — especially the classroom
              tools, if you teach — say so. It directly shapes what gets built first.
            </p>
            <a
              href="mailto:hello@bordersoftime.com?subject=Borders%20of%20Time%20Pro"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold border border-paper bg-card text-ink/70 hover:bg-surface hover:text-ink transition-all duration-200"
            >
              Let us know you&rsquo;re interested
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
