import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import { WORLD_WARS } from "@/data/warTours";
import type { Tour } from "@/data/tours";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "WW1 and WW2 Maps: Every Front Line and Battle — Borders of Time",
  description:
    "Interactive maps of World War I and World War II: watch the front lines move stage by stage, with occupied territory, offensives and 120 battles marked.",
  path: "/world-wars",
  imageUrl: "/og/second-world-war-europe.jpg",
});

/** What each war's section says above its tours: the shape of the war in brief, and pointers onward. */
const ABOUT: Record<string, { summary: string; facts: [string, string][]; links: { href: string; label: string }[] }> = {
  ww1: {
    summary:
      "A war that began with an assassination in Sarajevo and a fortnight of ultimatums became four years of industrial slaughter. In the west, the front barely moved between the autumn of 1914 and the spring of 1918; in the east, it swung hundreds of kilometres, until revolution took Russia out of the war. By the end, four empires had fallen and the map of Europe and the Middle East was redrawn.",
    facts: [
      ["Fought", "28 July 1914 – 11 November 1918"],
      ["Sides", "The Allies (France, Britain, Russia, Italy, the United States and others) against the Central Powers (Germany, Austria-Hungary, the Ottoman Empire, Bulgaria)"],
      ["Military dead", "About 9 million"],
    ],
    links: [
      { href: "/compare?pair=world-war-one", label: "Europe before and after, side by side" },
      { href: "/event/world-war-i", label: "World War I: the encyclopedia entry" },
    ],
  },
  ww2: {
    summary:
      "The deadliest war in history was fought on every inhabited continent. Germany overran most of Europe between 1939 and 1942 and Japan much of East Asia and the Pacific, until the Soviet Union, the United States, Britain and their allies turned the tide at Stalingrad, El Alamein and Midway and fought their way back. The maps here show who held what at each stage, as the fronts advanced and retreated.",
    facts: [
      ["Fought", "1 September 1939 – 2 September 1945 (in China, from 1937)"],
      ["Sides", "The Allies (the Soviet Union, the United States, Britain, China, France and many others) against the Axis (Germany, Japan, Italy and their allies)"],
      ["Dead", "Tens of millions; most estimates fall between 70 and 85 million, the majority civilians"],
    ],
    links: [
      { href: "/compare?pair=world-war-two", label: "Europe in 1938 and 1945, side by side" },
      { href: "/event/world-war-ii", label: "World War II: the encyclopedia entry" },
      { href: "/event/holocaust", label: "The Holocaust" },
    ],
  },
};

const stopHref = (tour: Tour, i: number) => `/tour/${tour.slug}${i ? `?stop=${i + 1}` : ""}`;

export default function WorldWarsPage() {
  const tours = WORLD_WARS.flatMap((w) => w.tours);
  const stops = tours.reduce((n, t) => n + t.steps.length, 0);
  const battles = tours.reduce((n, t) => n + t.steps.flatMap((s) => s.markers ?? []).filter((m) => m.kind === "battle").length, 0);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            collectionLd(
              "The world wars on the map",
              "The First and Second World Wars stage by stage, with front lines, occupied territory and battles.",
              "/world-wars",
              tours.map((t) => ({ name: t.title, path: `/tour/${t.slug}` })),
            ),
            breadcrumbLd([["Guided tours", "/tour"], ["The world wars", "/world-wars"]]),
          ]}
        />
        <PageIntro
          label="The world wars"
          crumbs={[{ href: "/tour", label: "Guided tours" }]}
          title={<>Two world wars, <span className="italic">stage by stage</span></>}
          lede="Watch the fronts move. Each stop shades the land each side held at that moment, striped where it was occupied, with arrows for the offensives and a mark for every major battle."
          aside={
            <p className="font-mono text-[12px] tracking-wide text-ink/50 leading-relaxed">
              {tours.length} map tours · {stops} stops<br />{battles} battles marked
            </p>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
          {WORLD_WARS.map((war) => {
            const about = ABOUT[war.key];
            return (
              <section key={war.key} aria-labelledby={war.key}>
                <SectionRule count={war.span}>
                  <span id={war.key}>{war.title}</span>
                </SectionRule>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                  <div className="lg:col-span-7">
                    <p className="font-text text-[18px] leading-[1.7] text-ink/80">{about.summary}</p>
                    <ul className="mt-5 flex flex-col gap-1.5 text-[15px]">
                      {about.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-accent hover:underline underline-offset-4">{l.label} →</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <dl className="lg:col-span-5 border-t border-ink/10 lg:border-t-0 lg:border-l lg:pl-8 pt-5 lg:pt-0 space-y-4">
                    {about.facts.map(([term, value]) => (
                      <div key={term}>
                        <dt className="label text-ink/40">{term}</dt>
                        <dd className="mt-1 text-[15px] leading-relaxed text-ink/75">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {war.tours.map((tour) => (
                  <TourStages key={tour.slug} tour={tour} />
                ))}
              </section>
            );
          })}

          <p className="text-xs text-ink/45 leading-relaxed max-w-3xl">
            Front lines are drawn from standard histories of each campaign and simplified to the main line of
            the fighting on the date given; small pockets, islands and short-lived advances are left out. Borders
            underneath come from the historical-basemaps snapshots for 1914 and 1938.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/** One tour: a link to start it, every stop with its date, and the battles it marks. */
function TourStages({ tour }: { tour: Tour }) {
  const battles = tour.steps.flatMap((step, i) =>
    (step.markers ?? []).filter((m) => m.kind === "battle").map((m) => ({ label: m.label, stop: i })),
  );
  return (
    <div className="mt-12">
      <Link href={`/tour/${tour.slug}`} className="group flex items-start justify-between gap-6 border-t border-ink/80 pt-6">
        <span>
          <span className="block font-display text-2xl sm:text-[32px] leading-tight tracking-tight text-ink group-hover:text-accent transition-colors">
            {tour.title}
          </span>
          <span className="block mt-2 font-mono text-[11px] tracking-wide text-ink/40">
            {tour.steps.length} stops · about {tour.duration} min · start the tour
          </span>
        </span>
        <ArrowUpRight size={22} className="mt-2 shrink-0 text-ink/25 group-hover:text-accent transition-colors" aria-hidden="true" />
      </Link>

      <div className="mt-6 grid lg:grid-cols-12 gap-8 lg:gap-12">
        <ol className="lg:col-span-7">
          {tour.steps.map((step, i) => (
            <li key={i} id={`${tour.slug}-${i + 1}`} className="border-b border-ink/10">
              <Link href={stopHref(tour, i)} className="group grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 py-3">
                <span className="font-mono text-[11px] text-ink/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] leading-snug text-ink/75 group-hover:text-accent transition-colors">{step.title}</span>
                <span className="col-start-2 sm:col-start-3 font-mono text-[11px] text-ink/40 tabular-nums">{step.date}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="lg:col-span-5">
          <p className="label text-ink/40">Battles on the map</p>
          <ul className="mt-3 space-y-1.5">
            {battles.map((b) => (
              <li key={b.label} className="text-[14px] leading-snug">
                <Link href={stopHref(tour, b.stop)} className="text-ink/70 hover:text-accent transition-colors">
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
