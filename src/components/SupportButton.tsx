"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { track } from "@vercel/analytics";
import { SUPPORT_URL } from "@/lib/monetization";

interface SupportButtonProps {
  /** "link" for footer/inline text (matches the surrounding nav links).
   *  "button" for a standalone pill CTA, e.g. on /support or /about.
   *  "header" for the compact amber pill in the site header.
   *  "overlay" for the dark translucent pill over the full-screen map. */
  variant?: "link" | "button" | "header" | "overlay";
  /** Header only: "night" on the dark homepage header. */
  tone?: "paper" | "night";
  className?: string;
}

/**
 * Points at your Ko-fi / Buy Me a Coffee page once NEXT_PUBLIC_SUPPORT_URL is
 * set; until then it links to the on-site /support page, which explains the
 * project and that direct support links are coming soon. Never a popup.
 */
export default function SupportButton({ variant = "link", tone = "paper", className = "" }: SupportButtonProps) {
  const external = Boolean(SUPPORT_URL);
  const href = SUPPORT_URL ?? "/support";
  const externalProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
  const onClick = () => track("support_click", { where: variant });

  if (variant === "header") {
    return (
      <Link
        href={href}
        {...externalProps}
        onClick={onClick}
        aria-label="Support the project"
        className={`inline-flex items-center gap-2 h-9 rounded-md px-2.5 sm:px-3 text-[13px] font-medium transition-colors ${
          tone === "night"
            ? "text-glow hover:bg-glow/10"
            : "text-accent hover:bg-accent/8"
        } ${className}`}
      >
        <Coffee size={15} strokeWidth={2} aria-hidden="true" />
        {/* Icon-only on phones so the header never overflows. */}
        <span className="max-sm:sr-only">Support</span>
      </Link>
    );
  }

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        {...externalProps}
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-night/70 backdrop-blur-md border border-white/10 rounded-md px-3 py-1.5 hover:bg-night/90 transition-colors ${className}`}
      >
        <Coffee size={14} aria-hidden="true" />
        Support
      </Link>
    );
  }

  if (variant === "button") {
    return (
      <Link
        href={href}
        {...externalProps}
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors ${
          tone === "night" ? "border border-glow/40 text-glow hover:bg-glow/10 hover:border-glow/70" : "bg-ink text-parchment hover:bg-accent"
        } ${className}`}
      >
        <Coffee size={16} aria-hidden="true" />
        Support this project
      </Link>
    );
  }

  return (
    <Link
      href={href}
      {...externalProps}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 hover:text-accent transition-colors ${className}`}
    >
      <Coffee size={13} aria-hidden="true" />
      Support this project
    </Link>
  );
}
