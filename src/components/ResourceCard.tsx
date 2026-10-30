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
 * One "further reading" suggestion with links to where it can be bought,
 * main shop first (rel="sponsored" when they're affiliate links). See
 * src/data/resources.ts.
 */
export default function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TYPE_ICON[resource.type];
  const rel = resource.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer";
  const [main, ...others] = resource.links;

  return (
    <div className="rounded-md border border-paper bg-card p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={14} className="text-accent/85 shrink-0" aria-hidden="true" />
        <span className="text-ink/64 text-[10px] font-semibold uppercase tracking-widest">
          {TYPE_LABEL[resource.type]}
        </span>
      </div>
      <p className="text-ink/85 text-sm font-medium leading-snug">
        {main ? (
          <a href={main.url} target="_blank" rel={rel} className="hover:text-accent transition-colors">
            {resource.title}
          </a>
        ) : (
          resource.title
        )}
      </p>
      {resource.creator && <p className="text-ink/64 text-xs mt-0.5">{resource.creator}</p>}
      <p className="text-ink/68 text-xs leading-relaxed mt-2">{resource.blurb}</p>
      {main && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <a
            href={main.url}
            target="_blank"
            rel={rel}
            className="inline-flex items-center h-8 px-3 rounded-md bg-ink text-parchment text-xs font-semibold hover:bg-accent transition-colors"
          >
            Buy on {main.label}
          </a>
          {others.map((l) => (
            <span key={l.label} className="text-xs text-ink/66">
              or{" "}
              <a
                href={l.url}
                target="_blank"
                rel={rel}
                className="text-ink/70 underline underline-offset-2 decoration-ink/20 hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
