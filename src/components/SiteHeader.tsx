import Link from "next/link";

/**
 * Persistent site-wide header: logo, search, browse, tours.
 * Used in the root layout; rendered on every non-map page.
 * The map page mounts its own minimal chrome.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-paper bg-parchment/95 backdrop-blur-md">
      {/* Thin amber top stripe */}
      <div className="h-px bg-gradient-to-r from-transparent via-ancient/50 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-ink font-semibold text-base tracking-tight hover:text-ancient transition-colors shrink-0 italic"
        >
          World History Atlas
        </Link>

        {/* Divider */}
        <span className="hidden sm:block w-px h-4 bg-paper shrink-0" />

        {/* Nav links */}
        <nav className="flex items-center gap-1 text-sm text-ink/50">
          {[
            { href: "/map",      label: "Map" },
            { href: "/timeline", label: "Timeline" },
            { href: "/browse",   label: "Browse" },
            { href: "/tour",     label: "Tours" },
            { href: "/about",    label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md hover:text-ink hover:bg-ink/[0.06] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search — right side */}
        <div className="ml-auto">
          <Link
            href="/search"
            className="flex items-center gap-2 text-sm text-ink/45 hover:text-ink/80 transition-colors
                       bg-ink/[0.04] hover:bg-ink/[0.08] border border-paper rounded-lg px-3 py-1.5 group"
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
            <span className="sm:hidden">Search</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
