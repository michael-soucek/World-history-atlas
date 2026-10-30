"use client";

import { useState } from "react";
import { drawShareImage, type ShareImageSpec } from "@/lib/shareImage";

export interface ResultTile {
  color: string;
  /** Short caption under the tile ("East Asia", "1,310 yrs"). */
  top?: string;
  bottom?: string;
}

/**
 * The score card every game ends on: a night-blue panel with the score, a
 * title, one tile per round and (for daily games) the player's stats, then
 * share buttons. Sharing sends an image where the device supports it, the
 * text otherwise.
 */
export default function ResultCard({ game, edition, score, outOf, rank, line, tiles, stats, text, url, children }: {
  game: string;
  edition: string;
  score: string;
  outOf: string;
  rank: string;
  line: string;
  tiles: ResultTile[];
  stats?: [string, string][];
  /** The plain-text version of the result, for "Copy text". */
  text: string;
  url: string;
  /** The per-round breakdown, shown under the card. */
  children?: React.ReactNode;
}) {
  const [status, setStatus] = useState("");
  const spec: ShareImageSpec = { game, edition, score, outOf, rank, tiles: tiles.map((t) => t.color), url };

  async function shareImage() {
    setStatus("");
    const blob = await drawShareImage(spec);
    const file = blob ? new File([blob], "borders-of-time-result.png", { type: "image/png" }) : null;
    if (file && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        return;
      } catch {
        // Cancelled: fall through to the text options below.
      }
    } else if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // Cancelled.
      }
    }
    await copyText();
  }

  async function saveImage() {
    const blob = await drawShareImage(spec);
    if (!blob) return setStatus("Couldn’t make the image in this browser.");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "borders-of-time-result.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Result copied. Paste it into a message or post.");
    } catch {
      setStatus("Couldn’t copy in this browser.");
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-xl bg-night text-parchment px-6 py-8 sm:px-10 sm:py-10" aria-label="Your result">
        {/* Faint graticule, like the map. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(#9fb7ff 1px, transparent 1px), linear-gradient(90deg, #9fb7ff 1px, transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-glow/80">{game} · {edition}</p>
          <p className="mt-4 font-display font-light tracking-tight tabular-nums leading-none text-[72px] sm:text-[104px]">
            {score}
            {outOf && <span className="text-parchment/35 text-3xl sm:text-5xl"> {outOf}</span>}
          </p>
          <p className="mt-4 font-display text-2xl sm:text-3xl"><span className="italic">{rank}.</span> <span className="text-parchment/60">{line}</span></p>

          <ol className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            {tiles.map((t, i) => (
              <li key={i} className="w-[calc(20%-10px)] min-w-[52px] sm:w-24">
                <span className="block aspect-square rounded-md" style={{ background: t.color }} />
                {t.top && <span className="mt-2 block text-[12px] leading-tight text-parchment/80 truncate">{t.top}</span>}
                {t.bottom && <span className="block font-mono text-[10.5px] text-parchment/45 truncate">{t.bottom}</span>}
              </li>
            ))}
          </ol>

          {stats && (
            <dl className="mt-8 grid grid-cols-3 max-w-md border-t border-parchment/15 pt-5">
              {stats.map(([k, v]) => (
                <div key={k}>
                  <dd className="font-display text-3xl tabular-nums">{v}</dd>
                  <dt className="font-mono text-[10.5px] tracking-widest uppercase text-parchment/50 mt-1">{k}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={shareImage} className="h-12 px-6 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
          Share result
        </button>
        <button type="button" onClick={saveImage} className="h-12 px-5 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
          Save image
        </button>
        <button type="button" onClick={copyText} className="h-12 px-5 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
          Copy text
        </button>
        <span className="text-sm text-ink/60" aria-live="polite">{status}</span>
      </div>
      <p className="mt-2 text-[13px] text-ink/45">No answers in what you share, so nobody’s game gets spoiled.</p>

      {children && <div className="mt-12">{children}</div>}
    </div>
  );
}
