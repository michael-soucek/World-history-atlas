import { BookOpen, Film, Landmark, GraduationCap } from "lucide-react";
import type { Resource } from "@/data/resources";

const TYPE_ICON = {
  book: BookOpen,
  documentary: Film,
  museum: Landmark,
  course: GraduationCap,
} as const;

const TYPE_LABEL: Record<Resource["type"], string> = {
  book: "Book",
  documentary: "Documentary",
  museum: "Museum",
  course: "Course",
};

/**
 * One "further reading / viewing" suggestion. Becomes a real, disclosed
 * outbound link the moment `resource.affiliateUrl` is set; until then it
 * renders inert (no href, muted, clearly marked) rather than a dead or
 * misleading link. See src/data/resources.ts for how to activate one.
 */
export default function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TYPE_ICON[resource.type];
  const isLive = Boolean(resource.affiliateUrl);

  const body = (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={14} className="text-ancient/60 shrink-0" aria-hidden="true" />
        <span className="text-ink/35 text-[10px] font-semibold uppercase tracking-widest">
          {TYPE_LABEL[resource.type]}
        </span>
        {!isLive && (
          <span className="ml-auto text-[10px] text-ink/25 italic">Suggested — link coming soon</span>
        )}
      </div>
      <p className="text-ink/85 text-sm font-medium leading-snug">{resource.title}</p>
      {resource.creator && <p className="text-ink/40 text-xs mt-0.5">{resource.creator}</p>}
      <p className="text-ink/50 text-xs leading-relaxed mt-2">{resource.blurb}</p>
    </>
  );

  if (isLive) {
    return (
      <a
        href={resource.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block rounded-xl border border-paper bg-white/60 hover:bg-ancient-wash hover:border-ancient/30 p-4 transition-colors"
      >
        {body}
      </a>
    );
  }

  return <div className="rounded-xl border border-paper bg-white/40 p-4 opacity-80">{body}</div>;
}
