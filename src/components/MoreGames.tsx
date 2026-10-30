import Link from "next/link";
import { GAMES } from "@/components/PlayTabs";

/** Cards for the other games, at the end of each game. */
export default function MoreGames({ current }: { current: string }) {
  return (
    <section className="mt-14" aria-labelledby="more-games">
      <h2 id="more-games" className="font-display text-2xl text-ink">More games</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {GAMES.filter((g) => g.href !== current).map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="group block h-full rounded-lg border border-ink/12 bg-card p-5 transition-colors hover:border-accent">
              <span className="block font-display text-xl text-ink group-hover:text-accent transition-colors">{g.name}</span>
              <span className="mt-1 block text-[13.5px] text-ink/55">{g.line}</span>
              <span className="mt-4 block font-mono text-[11px] text-ink/40 group-hover:text-accent">Play →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
