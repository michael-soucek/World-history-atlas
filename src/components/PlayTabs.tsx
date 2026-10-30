import Link from "next/link";

const GAMES = [
  { href: "/play", name: "Guess the Year", line: "Date the map from its borders" },
  { href: "/play/empire", name: "Name the Empire", line: "Name the state lit up in red" },
] as const;

/** Switches between the two daily games; the current one is underlined. */
export default function PlayTabs({ current }: { current: (typeof GAMES)[number]["href"] }) {
  return (
    <nav aria-label="Games" className="grid grid-cols-2 border-b border-ink/10 mb-10 sm:mb-12">
      {GAMES.map((g) => {
        const active = g.href === current;
        return (
          <Link
            key={g.href}
            href={g.href}
            aria-current={active ? "page" : undefined}
            className={`relative pb-4 pr-4 transition-colors ${active ? "text-ink" : "text-ink/45 hover:text-ink"}`}
          >
            <span className="block font-display text-xl sm:text-2xl tracking-tight">{g.name}</span>
            <span className="block text-[13px] text-ink/50 mt-0.5">{g.line}</span>
            {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}
