import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TourPlayer from "@/components/TourPlayer";
import RelatedResources from "@/components/RelatedResources";
import { TOURS, getTourBySlug } from "@/data/tours";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { JsonLd, SITE_URL, breadcrumbLd } from "@/lib/jsonLd";
import type { Tour } from "@/data/tours";

interface Props { params: Promise<{ slug: string }> }

// A couple of the full descriptions in tours.ts run past the ~160-char
// meta-description budget — shortened here without touching the source
// copy, which still renders in full on the /tour hub page.
const META_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "silk-road-and-trade":
    "Long before oceans were crossed, overland caravans and monsoon-driven ships linked China, India, the Islamic world, Africa, and Europe in trade and ideas.",
  "chinese-dynasties":
    "For over two thousand years, Chinese history moved through unification, flourishing, decline, and renewal — a succession of dynasties that shaped East Asia.",
};

const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y}`);

/** "1095–1291", "336–323 BCE", "300,000 BCE–20,000 BCE": the span a tour covers. */
function tourSpan(tour: Tour): string {
  const years = tour.steps.map((s) => s.mapState.year);
  const [from, to] = [Math.min(...years), Math.max(...years)];
  if (from < 0 && to < 0) return `${Math.abs(from).toLocaleString("en-US")}–${Math.abs(to).toLocaleString("en-US")} BCE`;
  return `${fmtYear(from)}–${fmtYear(to)}`;
}

export async function generateStaticParams() {
  return TOURS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour not found — Borders of Time" };
  return buildPageMetadata({
    // Titles that already have a subtitle ("Out of Africa: How Humans…") skip the extra one.
    title: tour.title.includes(":")
      ? `${tour.title} (${tourSpan(tour)}) — Borders of Time`
      : `${tour.title} (${tourSpan(tour)}): Interactive Map Tour — Borders of Time`,
    // Two tour descriptions run past Google's ~160-char meta-description
    // display width; shortened here for the meta tag specifically (a blind
    // slice(0, 160) cuts both mid-word). The full description still renders
    // in full on the /tour hub page.
    description: META_DESCRIPTION_OVERRIDES[slug] ?? metaDescription(tour.description)!,
    path: `/tour/${slug}`,
  });
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            {
              "@type": "Article",
              headline: tour.title,
              description: tour.description,
              url: `${SITE_URL}/tour/${tour.slug}`,
              timeRequired: `PT${tour.duration}M`,
              learningResourceType: "Guided tour",
              isAccessibleForFree: true,
              publisher: { "@type": "Organization", name: "Borders of Time", url: SITE_URL },
            },
            breadcrumbLd([["Guided tours", "/tour"], [tour.title, `/tour/${tour.slug}`]]),
          ]}
        />
        <TourPlayer tour={tour} />
        <TourTranscript tour={tour} />
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <RelatedResources resourceKey={`tour:${tour.slug}`} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * The whole tour as plain text, folded away under the player: for readers who
 * prefer to read straight through, screen readers, and search engines (the
 * player itself only shows one stop at a time).
 */
function TourTranscript({ tour }: { tour: Tour }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
      <details className="group border-t border-ink/80">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
          <span className="font-display text-2xl tracking-tight text-ink">Read the whole tour</span>
          <span className="font-mono text-[11px] tracking-wide text-ink/45 group-open:hidden">{tour.steps.length} stops ▾</span>
          <span className="font-mono text-[11px] tracking-wide text-ink/45 hidden group-open:inline">Close ▴</span>
        </summary>
        <ol className="pb-4">
          {tour.steps.map((step, i) => (
            <li key={i} className="py-6 border-t border-ink/10">
              <p className="font-mono text-[11px] tracking-wide text-accent">
                Stop {String(i + 1).padStart(2, "0")} · {step.date ?? `${fmtYear(step.mapState.year)}${step.mapState.year > 0 ? " CE" : ""}`}
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl tracking-tight text-ink">{step.title}</h2>
              <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink/75">{step.text}</p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
