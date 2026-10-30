import ResourceCard from "@/components/ResourceCard";
import { getResources } from "@/data/resources";

/**
 * "Further reading" — renders nothing when there are no suggestions for this
 * key, so it's safe to drop onto any page.
 */
export default function RelatedResources({ resourceKey }: { resourceKey: string }) {
  const resources = getResources(resourceKey);
  if (resources.length === 0) return null;

  return (
    <div className="rounded-md border border-paper bg-card p-5 space-y-3">
      <p className="label text-ink/66">
        Further reading
      </p>
      <div className="space-y-3">
        {resources.map((r) => (
          <ResourceCard key={r.title} resource={r} />
        ))}
      </div>
      <p className="text-ink/62 text-[11px] leading-relaxed pt-1">
        Some links may be affiliate links. See our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-ink/66 transition-colors">
          disclosure
        </a>
        .
      </p>
    </div>
  );
}
