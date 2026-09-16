import ResourceCard from "@/components/ResourceCard";
import { getResources } from "@/data/resources";

/**
 * "Further reading & viewing" — renders nothing when there are no curated
 * suggestions for this key yet, so it's safe to drop onto any page.
 */
export default function RelatedResources({ resourceKey }: { resourceKey: string }) {
  const resources = getResources(resourceKey);
  if (resources.length === 0) return null;

  return (
    <div className="rounded-2xl border border-paper bg-white/60 p-5 space-y-3">
      <p className="text-ink/35 text-xs font-semibold uppercase tracking-wider">
        Further reading &amp; viewing
      </p>
      <div className="space-y-3">
        {resources.map((r) => (
          <ResourceCard key={r.title} resource={r} />
        ))}
      </div>
      <p className="text-ink/25 text-[11px] leading-relaxed pt-1">
        Some links may be affiliate links. See our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-ink/45 transition-colors">
          disclosure
        </a>
        .
      </p>
    </div>
  );
}
