"use client";

import { useEffect, useState } from "react";
import { Coffee, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { SUPPORT_URL } from "@/lib/monetization";

const KEY = "bot-support";
const DAY = 24 * 60 * 60 * 1000;
const SNOOZE_AFTER_DISMISS = 60 * DAY;
const SNOOZE_AFTER_SUPPORT = 180 * DAY;
/** Entity pages a visitor reads before the card appears on one (1 = the first). */
const MIN_PAGES = 1;

type State = { pages: number; hideUntil: number };

function load(): State {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return { pages: Number(raw.pages) || 0, hideUntil: Number(raw.hideUntil) || 0 };
  } catch {
    return { pages: 0, hideUntil: 0 };
  }
}

function save(state: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked — the card just follows the default rules each visit.
  }
}

interface SupportNudgeProps {
  /** Analytics label for where the card was shown. */
  where: string;
  /** "tour" shows immediately (the visitor just finished one); "page" waits
   *  until the visitor has read a few entity pages. */
  trigger: "tour" | "page";
}

/**
 * A quiet, inline support card — never a popup or overlay. Shown only to
 * visitors who are actually reading: at the end of a finished tour, or in the
 * sidebar of every entity page. Dismissing hides it for 60 days, supporting
 * hides it for 180. Renders nothing until NEXT_PUBLIC_SUPPORT_URL is set.
 */
export default function SupportNudge({ where, trigger }: SupportNudgeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!SUPPORT_URL) return;
    const state = load();
    const pages = trigger === "page" ? state.pages + 1 : state.pages;
    if (pages !== state.pages) save({ ...state, pages });
    // localStorage is client-only, so the decision has to happen after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(Date.now() >= state.hideUntil && (trigger === "tour" || pages >= MIN_PAGES));
  }, [trigger]);

  if (!visible || !SUPPORT_URL) return null;

  function snooze(ms: number) {
    save({ ...load(), hideUntil: Date.now() + ms });
  }

  return (
    <aside
      aria-label="Support Borders of Time"
      className="relative rounded-2xl border border-ancient/30 bg-ancient-wash p-5 pr-11"
    >
      <button
        type="button"
        onClick={() => {
          snooze(SNOOZE_AFTER_DISMISS);
          track("support_dismiss", { where });
          setVisible(false);
        }}
        aria-label="Dismiss"
        className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-ink/35 hover:text-ink hover:bg-ink/5 transition-colors"
      >
        <X size={16} aria-hidden="true" />
      </button>
      <p className="font-display font-bold text-ink">
        {trigger === "tour" ? "Enjoyed the tour?" : "Enjoying Borders of Time?"}
      </p>
      <p className="mt-1.5 text-sm text-ink/65 leading-relaxed">
        It&rsquo;s free, ad-free and built by one person. If you&rsquo;d like to see more maps and
        tours, you can buy me a coffee.
      </p>
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          snooze(SNOOZE_AFTER_SUPPORT);
          track("support_click", { where });
        }}
        className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
      >
        <Coffee size={15} aria-hidden="true" />
        Support this project
      </a>
    </aside>
  );
}
