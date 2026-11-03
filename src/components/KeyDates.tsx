import { Inline } from "@/components/OurArticle";

/** Timeline years from an article: "~-3000" → "c. 3000 BCE", "1291" → "1291". */
export function fmtKeyYear(raw: string): string {
  const approx = raw.startsWith("~");
  const n = Number(raw.replace("~", ""));
  const y = n < 0 ? `${-n} BCE` : n < 1000 ? `${n} CE` : String(n);
  return approx ? `c. ${y}` : y;
}

/** An article's key dates as a vertical timeline. */
export default function KeyDates({ items, className = "", hideTitle = false }: { items: { year: string; text: string }[]; className?: string; hideTitle?: boolean }) {
  return (
    <section className={className} aria-label="Key dates">
      {!hideTitle && <h2 className="label text-ink/66 mb-4">Key dates</h2>}
      <ol className="border-l border-ink/15">
        {items.map((d, i) => (
          <li key={i} className="relative pl-5 pb-4 last:pb-0">
            <span className="absolute -left-[4px] top-[7px] w-[7px] h-[7px] rounded-full bg-accent" aria-hidden="true" />
            <span className="block font-mono text-[12px] tracking-wide text-ink/70 tabular-nums">{fmtKeyYear(d.year)}</span>
            <span className="block text-[14px] leading-snug text-ink/80"><Inline text={d.text} /></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
