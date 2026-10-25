"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import SupportButton from "@/components/SupportButton";
import BrandMark from "@/components/BrandMark";

const NAV_LINKS = [
  { href: "/map",      label: "Map"      },
  { href: "/timeline", label: "Timeline" },
  { href: "/browse",   label: "Browse"   },
  { href: "/countries", label: "Countries" },
  { href: "/tour",     label: "Tours"    },
  { href: "/history-of", label: "Cities" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/play",     label: "Play"     },
  { href: "/about",    label: "About"    },
];

/**
 * Site header. `tone="night"` is for a page that opens on a dark hero (the
 * homepage, marked with `data-hero`): the header is transparent over the
 * hero and turns into the normal light header once the hero scrolls away.
 */
export default function SiteHeader({ tone = "paper" }: { tone?: "paper" | "night" }) {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(tone === "night");
  const pathname = usePathname();

  useEffect(() => {
    if (tone !== "night") return;
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const onScroll = () => setOverHero(window.scrollY < hero.offsetHeight - 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tone]);

  // The open mobile menu needs a solid background even over the hero.
  const night = overHero;
  const shell = night
    ? open
      ? "bg-night text-parchment border-white/10"
      : "bg-gradient-to-b from-night/80 to-night/0 text-parchment border-transparent"
    : "bg-parchment/90 text-ink border-ink/10 backdrop-blur-md backdrop-saturate-150";
  const navIdle = night ? "text-parchment/60 hover:text-parchment" : "text-ink/55 hover:text-ink";
  const navActive = night ? "text-parchment" : "text-ink";

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${shell}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Borders of Time — home">
          <BrandMark className={`w-7 h-7 transition-transform duration-700 group-hover:rotate-[30deg] ${night ? "text-glow" : "text-accent"}`} />
          <span className="font-display text-[19px] leading-none tracking-tight">
            Borders <span className="italic">of</span> Time
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-7 ml-1 xl:ml-6 text-[13px] tracking-wide" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 transition-colors ${active ? navActive : navIdle}`}
              >
                {label}
                <span
                  className={`absolute left-0 -bottom-[3px] h-px w-full origin-left transition-transform duration-300 ${
                    night ? "bg-glow" : "bg-accent"
                  } ${active ? "scale-x-100" : "scale-x-0"}`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <SupportButton variant="header" tone={night ? "night" : "paper"} />

          <Link
            href="/search"
            className={`flex items-center gap-2.5 h-9 rounded-md px-2.5 sm:pl-3 sm:pr-2 text-[13px] border transition-colors ${
              night
                ? "border-white/12 text-parchment/60 hover:text-parchment hover:border-white/25"
                : "border-ink/12 text-ink/50 hover:text-ink hover:border-ink/25"
            }`}
            aria-label="Search history"
          >
            <Search size={14} strokeWidth={2.25} aria-hidden="true" />
            <span className="hidden xl:inline pr-6 whitespace-nowrap">Search 5,000 years</span>
          </Link>

          <button
            onClick={() => setOpen(v => !v)}
            className={`md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-md transition-colors ${
              night ? "text-parchment/70 hover:text-parchment" : "text-ink/60 hover:text-ink"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`md:hidden border-t px-4 pt-2 pb-5 ${night ? "border-white/8" : "border-ink/10"}`}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-baseline gap-4 py-3 border-b ${night ? "border-white/6" : "border-ink/8"}`}
            >
              <span className={`label ${night ? "text-glow/70" : "text-accent/80"}`}>0{i + 1}</span>
              <span className="font-display text-2xl">{label}</span>
            </Link>
          ))}
          <div className="pt-5">
            <SupportButton variant="button" tone={night ? "night" : "paper"} className="w-full justify-center" />
          </div>
        </nav>
      )}
    </header>
  );
}
