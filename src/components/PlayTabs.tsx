import Link from "next/link";

export const GAMES = [
  { href: "/play", name: "Guess the Year", line: "Date the map from its borders" },
  { href: "/play/empire", name: "Name the Empire", line: "Name the state lit up in red" },
  { href: "/play/which-came-first", name: "Which Came First?", line: "Two events. Pick the earlier" },
  { href: "/play/order", name: "Put It in Order", line: "Five events, earliest first" },
] as const;

/** Switches between the games; the current one is underlined. */
export default function PlayTabs({ current }: { current: (typeof GAMES)[number]["href"] }) {
  return (
    <nav aria-label="Games" className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 border-b border-ink/10 mb-10 sm:mb-12">
      {GAMES.map((g) => {
        const active = g.href === current;
        return (
          <Link
            key={g.href}
            href={g.href}
            aria-current={active ? "page" : undefined}
            className={`relative py-4 transition-colors ${active ? "text-ink" : "text-ink/65 hover:text-ink"}`}
          >
            <span className="block font-display text-lg sm:text-xl tracking-tight">{g.name}</span>
            <span className="block text-[12.5px] text-ink/68 mt-0.5">{g.line}</span>
            {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}
