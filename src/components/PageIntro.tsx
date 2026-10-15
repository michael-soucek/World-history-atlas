import Link from "next/link";

/**
 * The title block for index and hub pages: breadcrumb, a ruled label, a
 * large display title and a lede. `aside` sits in the right-hand column on
 * wide screens (counts, dates, a secondary action).
 */
export default function PageIntro({
  label,
  title,
  lede,
  crumbs,
  aside,
  accent = "text-accent",
}: {
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  aside?: React.ReactNode;
  /** Tailwind text colour for the label (era pages use their era colour). */
  accent?: string;
}) {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-ink/10">
      {crumbs && crumbs.length > 0 && (
        <nav className="label flex flex-wrap items-center gap-2.5 text-ink/40 mb-10 sm:mb-14" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-2.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              <Link href={c.href} className="hover:text-accent transition-colors">{c.label}</Link>
            </span>
          ))}
        </nav>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <p className={`label mb-5 flex items-center gap-3 ${accent}`}>
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            {label}
          </p>
          <h1 className="font-display font-light text-[44px] sm:text-6xl lg:text-[84px] leading-[1] tracking-[-0.035em] text-ink text-balance animate-[year-in_0.8s_cubic-bezier(.2,.7,.2,1)_both]">
            {title}
          </h1>
          {lede && <p className="mt-6 text-lg text-ink/60 leading-relaxed max-w-2xl">{lede}</p>}
        </div>
        {aside && <div className="lg:col-span-4 lg:text-right lg:pb-2">{aside}</div>}
      </div>
      </div>
    </header>
  );
}

/** A ruled section heading used inside hub pages. */
export function SectionRule({ children, count }: { children: React.ReactNode; count?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-3 mb-8">
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">{children}</h2>
      {count != null && <span className="font-mono text-[11px] tracking-wider text-ink/45 tabular-nums">{count}</span>}
    </div>
  );
}
