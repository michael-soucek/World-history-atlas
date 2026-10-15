/**
 * The Borders of Time mark: a globe drawn as a graticule, with one meridian
 * bent out of true, in vermilion — a border that moved. Matches public/favicon.svg.
 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="13.25" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="5.5" ry="13.25" strokeWidth="1" opacity="0.55" />
      <path d="M2.75 16h26.5M5 9.5h22M5 22.5h22" strokeWidth="1" opacity="0.55" />
      <path d="M16 2.75c3.6 3.4 1.2 7.2 4.4 10.4 2.6 2.6-.8 6 1.6 9.2 1.3 1.8.6 4.3-2 6.9" stroke="var(--color-vermilion)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
