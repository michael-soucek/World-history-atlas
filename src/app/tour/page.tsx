import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { TOURS } from "@/data/tours";

export const metadata: Metadata = {
  title: "Guided Tours — World History Atlas",
  description: "Authored journeys through history that drive the map. Watch empires rise and fall with narration and context.",
};

const DIFFICULTY_STYLE = {
  "intro":      "text-medieval     bg-medieval-wash     border-medieval/30",
  "standard":   "text-ancient      bg-ancient-wash      border-ancient/30",
  "deep-dive":  "text-modern       bg-modern-wash       border-modern/30",
};

const DIFFICULTY_LABEL = {
  "intro":     "Intro",
  "standard":  "Standard",
  "deep-dive": "Deep dive",
};

export default function TourListPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Explore</p>
          <h1 className="font-display text-5xl font-bold text-ink mb-3 italic">Guided Tours</h1>
          <p className="text-ink/40 text-base mb-12 max-w-lg">
            Linear journeys through history that drive the map — with narration and context. Each step is data-authored, not generated.
          </p>

          <div className="space-y-4">
            {TOURS.map(tour => {
              const diffStyle = DIFFICULTY_STYLE[tour.difficulty];
              return (
                <Link
                  key={tour.slug}
                  href={`/tour/${tour.slug}`}
                  className="group block rounded-2xl border border-paper bg-white/60 hover:bg-ancient-wash hover:border-ancient/30 p-7 transition-all duration-200 relative overflow-hidden"
                >
                  {/* Amber left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-ancient/0 group-hover:bg-ancient/40 transition-all duration-200" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-xs font-medium rounded-full border px-2.5 py-0.5 ${diffStyle}`}>
                          {DIFFICULTY_LABEL[tour.difficulty]}
                        </span>
                        <span className="text-ink/25 text-xs font-mono">{tour.duration} min · {tour.steps.length} steps</span>
                      </div>
                      <h2 className="font-display text-xl font-bold text-ink group-hover:text-ancient transition-colors mb-1.5">
                        {tour.title}
                      </h2>
                      <p className="text-ink/45 text-sm leading-relaxed">
                        {tour.description}
                      </p>
                    </div>
                    <span className="text-ink/20 group-hover:text-ancient/60 transition-colors text-lg shrink-0 mt-1">→</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-10 text-xs text-ink/25 leading-relaxed">
            Tours are data-authored. No AI-generated historical content.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

