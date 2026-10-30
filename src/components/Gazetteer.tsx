import Link from "next/link";

export interface GazetteerItem {
  href: string;
  name: string;
  /** Small mono note on the right (a date range, a type). */
  meta?: string;
  /** Not yet published: shown greyed out, not linked. */
  pending?: boolean;
}

/**
 * An atlas-index style list: hairline-ruled rows flowing in columns,
 * optionally grouped under initial letters like a printed gazetteer.
 */
export default function Gazetteer({ items, grouped = false }: { items: GazetteerItem[]; grouped?: boolean }) {
  if (!grouped) {
    return (
      <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-10">
        {items.map(item => <Row key={item.href + item.name} item={item} />)}
      </ul>
    );
  }

  const groups = new Map<string, GazetteerItem[]>();
  for (const item of items) {
    const letter = item.name.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return (
    <>
      <nav className="flex flex-wrap gap-x-1 gap-y-2 mb-10 font-mono text-[12px]" aria-label="Jump to letter">
        {[...groups.keys()].map(l => (
          <a key={l} href={`#letter-${l}`} className="w-7 h-7 grid place-items-center text-ink/70 hover:text-parchment hover:bg-ink transition-colors">
            {l}
          </a>
        ))}
      </nav>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-10">
        {[...groups.entries()].map(([letter, list]) => (
          <section key={letter} id={`letter-${letter}`} className="break-inside-avoid-column mb-8 scroll-mt-24">
            <h3 className="font-display italic text-3xl text-accent mb-1">{letter}</h3>
            <ul>
              {list.map(item => <Row key={item.href + item.name} item={item} />)}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function Row({ item }: { item: GazetteerItem }) {
  if (item.pending) {
    return (
      <li className="break-inside-avoid flex items-baseline justify-between gap-3 py-2.5 border-b border-ink/10 text-[15px] text-ink/62">
        <span>{item.name}</span>
        <span className="font-mono text-[10px] tracking-wider">SOON</span>
      </li>
    );
  }
  return (
    <li className="break-inside-avoid border-b border-ink/10">
      <Link href={item.href} className="group flex items-baseline justify-between gap-3 py-2.5 text-[15px] text-ink/80 hover:text-accent transition-colors">
        <span className="min-w-0">
          <span className="link-draw">{item.name}</span>
        </span>
        {item.meta ? (
          <span className="shrink-0 font-mono text-[10px] tracking-wide text-ink/64 tabular-nums">{item.meta}</span>
        ) : (
          <span className="shrink-0 text-ink/20 group-hover:text-accent transition-colors" aria-hidden="true">→</span>
        )}
      </Link>
    </li>
  );
}

/** A row of large text links separated by rules — "other eras", "other regions". */
export function LinkRow({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="border-t border-ink/80 pt-5">
      <p className="label text-ink/66 mb-4">{title}</p>
      <ul className="flex flex-wrap gap-x-2 gap-y-1 font-display text-2xl sm:text-3xl tracking-tight leading-snug">
        {links.map((l, i) => (
          <li key={l.href} className="flex items-baseline gap-2">
            <Link href={l.href} className="text-ink/70 hover:text-accent transition-colors">{l.label}</Link>
            {i < links.length - 1 && <span className="text-ink/20 font-light" aria-hidden="true">/</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
