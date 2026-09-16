import Link from "next/link";
import { Coffee } from "lucide-react";
import { SUPPORT_URL } from "@/lib/monetization";

interface SupportButtonProps {
  /** "link" for footer/inline text (matches the surrounding nav links). "button" for a
   *  standalone pill CTA, e.g. on /support or /about. */
  variant?: "link" | "button";
  className?: string;
}

/**
 * Points at your Ko-fi / Buy Me a Coffee page once NEXT_PUBLIC_SUPPORT_URL is
 * set; until then it links to the on-site /support page, which explains the
 * project and that direct support links are coming soon. Never a popup.
 */
export default function SupportButton({ variant = "link", className = "" }: SupportButtonProps) {
  const external = Boolean(SUPPORT_URL);
  const href = SUPPORT_URL ?? "/support";
  const externalProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  if (variant === "button") {
    return (
      <Link
        href={href}
        {...externalProps}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors ${className}`}
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
      className={`inline-flex items-center gap-1.5 hover:text-ancient transition-colors ${className}`}
    >
      <Coffee size={13} aria-hidden="true" />
      Support this project
    </Link>
  );
}
