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
 * One "further reading" suggestion: an outbound link to where it can be
 * bought (rel="sponsored" when it's an affiliate link), or a plain card when
 * there's no link. See src/data/resources.ts.
 */
export default function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TYPE_ICON[resource.type];
  const isLive = Boolean(resource.url);

  const body = (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={14} className="text-accent/60 shrink-0" aria-hidden="true" />
        <span className="text-ink/35 text-[10px] font-semibold uppercase tracking-widest">
          {TYPE_LABEL[resource.type]}
        </span>
      </div>
      <p className="text-ink/85 text-sm font-medium leading-snug">{resource.title}</p>
      {resource.creator && <p className="text-ink/40 text-xs mt-0.5">{resource.creator}</p>}
      <p className="text-ink/50 text-xs leading-relaxed mt-2">{resource.blurb}</p>
    </>
  );

  if (isLive) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel={resource.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
        className="block rounded-md border border-paper bg-card hover:bg-accent-wash hover:border-accent/30 p-4 transition-colors"
      >
        {body}
      </a>
    );
  }

  return <div className="rounded-md border border-paper bg-white/40 p-4 opacity-80">{body}</div>;
}
