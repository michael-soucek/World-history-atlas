import { ADS_ENABLED } from "@/lib/monetization";

type AdFormat = "leaderboard" | "rectangle" | "in-content" | "sidebar";

const FORMAT_SIZE: Record<AdFormat, string> = {
  leaderboard: "max-w-[728px] h-[90px]",
  rectangle: "max-w-[300px] h-[250px]",
  sidebar: "max-w-[300px] h-[600px]",
  "in-content": "max-w-full h-[120px] sm:h-[150px]",
};

interface AdSlotProps {
  /** Unique identifier for this placement, e.g. "home-mid-content". Keep it
   *  stable — a future ad network's targeting config will reference it. */
  id: string;
  format?: AdFormat;
  className?: string;
}

/**
 * A reserved spot for a future ad network or direct sponsor, without
 * redesigning anything when you turn one on.
 *
 * Renders nothing (`null`) unless NEXT_PUBLIC_ADS_ENABLED=true — so on the
 * live site, by default, this has zero DOM footprint, zero layout shift, and
 * zero bytes shipped. There is no fake ad here.
 *
 * When you're ready to wire a real network, replace the placeholder `<div>`
 * below with that network's snippet. Two common shapes:
 *
 *   // Mediavine / most script-based networks: mount their loader once in
 *   // layout.tsx, then give each slot a stable div id that matches the id
 *   // prop and let their script populate it:
 *   return <div id={`ad-${id}`} className={`mx-auto ${FORMAT_SIZE[format]}`} />;
 *
 *   // A direct sponsor (a plain image + link, no script, no tracking pixel
 *   // beyond the click itself):
 *   return (
 *     <a href={sponsor.url} target="_blank" rel="noopener noreferrer sponsored">
 *       <Image src={sponsor.imageUrl} alt={sponsor.name} fill className="object-cover" />
 *     </a>
 *   );
 */
export default function AdSlot({ id, format = "rectangle", className = "" }: AdSlotProps) {
  if (!ADS_ENABLED) return null;

  return (
    <div
      data-ad-slot={id}
      className={`mx-auto flex items-center justify-center rounded-xl border border-dashed border-paper bg-surface/50 text-[10px] uppercase tracking-widest text-ink/25 ${FORMAT_SIZE[format]} ${className}`}
    >
      Advertisement
    </div>
  );
}
