"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/map",      label: "Map"      },
  { href: "/timeline", label: "Timeline" },
  { href: "/browse",   label: "Browse"   },
  { href: "/tour",     label: "Tours"    },
  { href: "/about",    label: "About"    },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper bg-parchment/95 backdrop-blur-md">
      {/* Thin amber top stripe */}
      <div className="h-px bg-linear-to-r from-transparent via-ancient/50 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-ink font-semibold text-base tracking-tight hover:text-ancient transition-colors shrink-0 italic"
        >
          Borders of Time
        </Link>

        {/* Divider — desktop only */}
        <span className="hidden sm:block w-px h-4 bg-paper shrink-0" />

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 text-sm text-ink/50">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md hover:text-ink hover:bg-ink/6 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-ink/45 hover:text-ink/80 transition-colors
                       bg-ink/4 hover:bg-ink/8 border border-paper rounded-lg px-3 py-1.5 group"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 group-hover:text-ancient/80 transition-colors"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden sm:inline">Search history…</span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(v => !v)}
            className="sm:hidden flex items-center justify-center w-11 h-11 rounded-md
                       hover:bg-ink/6 text-ink/60 hover:text-ink transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav
          className="sm:hidden border-t border-paper bg-parchment/98 px-4 py-3 flex flex-col gap-0.5"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-md text-sm text-ink/70 hover:text-ink hover:bg-ink/6 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

