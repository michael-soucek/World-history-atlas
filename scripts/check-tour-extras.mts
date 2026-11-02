/**
 * Checks every tour stop's `people` and `readMore` point at pages that exist,
 * and reports how many stops have a fact, people and further reading.
 *
 *   npx tsx scripts/check-tour-extras.mts            # all tours
 *   npx tsx scripts/check-tour-extras.mts slug …     # just these
 */
import { TOURS } from "../src/data/tours";
import { resolvePath } from "../src/lib/sitePaths";

const only = process.argv.slice(2);
let bad = 0;
for (const tour of TOURS.filter((t) => !only.length || only.includes(t.slug))) {
  const n = { fact: 0, people: 0, readMore: 0 };
  tour.steps.forEach((step, i) => {
    if (step.fact) n.fact++;
    if (step.people?.length) n.people++;
    if (step.readMore?.length) n.readMore++;
    const paths = [...(step.people ?? []).map((s) => `/person/${s}`), ...(step.readMore ?? [])];
    for (const p of paths) if (!resolvePath(p)) { bad++; console.log(`  ${tour.slug} stop ${i + 1}: no page at ${p}`); }
  });
  console.log(`${tour.slug.padEnd(36)} ${tour.steps.length} stops · fact ${n.fact} · people ${n.people} · read more ${n.readMore}`);
}
console.log(bad ? `${bad} broken links` : "All links resolve.");
process.exit(bad ? 1 : 0);
