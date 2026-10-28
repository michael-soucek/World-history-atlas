import { gygSearchUrl } from "@/data/visit";

/**
 * "Visit it today": a GetYourGuide search for tours and tickets in a place,
 * through our partner link. See src/data/visit.ts for where it's shown.
 */
export default function VisitBox({ place, query = place, what }: { place: string; query?: string; what: string }) {
  return (
    <section className="max-w-3xl rounded-md border border-paper bg-card p-5 sm:p-6" aria-labelledby="visit-today">
      <p className="label text-ink/45">Visit today</p>
      <h2 id="visit-today" className="mt-2 font-display text-2xl sm:text-[1.7rem] leading-tight text-ink">
        See {place} for yourself
      </h2>
      <p className="mt-2 text-[15px] text-ink/60 leading-relaxed">{what}</p>
      <a
        href={gygSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group mt-5 inline-flex items-center gap-3 min-h-11 py-2.5 pl-5 pr-4 rounded-md text-left bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
      >
        Tours and tickets in {place}
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </a>
      <p className="mt-3 text-ink/30 text-[11px] leading-relaxed">
        On GetYourGuide. We may earn a commission if you book. See our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-ink/50 transition-colors">disclosure</a>.
      </p>
    </section>
  );
}
