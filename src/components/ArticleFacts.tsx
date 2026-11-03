import { Inline } from "@/components/OurArticle";

/** The "At a glance" strip: an article's own key facts (capital, founder, religion…). */
export function AtAGlance({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-ink/80" aria-label="At a glance">
      {items.slice(0, 6).map((f) => (
        <div key={f.label} className="pt-4 pb-5 pr-4 border-b border-ink/10">
          <dt className="label text-ink/64 !text-[10px]">{f.label}</dt>
          <dd className="mt-2 font-display text-lg leading-snug text-ink"><Inline text={f.value} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** A state's rulers in order, with their reigns. */
export function Rulers({ items, name }: { items: { reign: string; name: string }[]; name: string }) {
  return (
    <section className="mb-14" aria-labelledby="rulers">
      <h2 id="rulers" className="label text-ink/66 mb-4">Rulers of {name}</h2>
      <ol className="border-t border-ink/10">
        {items.map((r, i) => (
          <li key={i} className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr] gap-x-6 items-baseline py-3 border-b border-ink/10">
            <span className="font-mono text-[12px] tracking-wide text-ink/68 tabular-nums">{r.reign}</span>
            <span className="font-display text-[19px] leading-snug tracking-tight text-ink"><Inline text={r.name} /></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
