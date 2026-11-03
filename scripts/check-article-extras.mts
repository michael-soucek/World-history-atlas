/**
 * Checks an article's front-matter extras (glance, rulers, timeline, faq):
 * that each block parses, values are short enough for their boxes, FAQ lines
 * don't repeat the page's automatic answers, and every link resolves.
 * Mirrors the parsing in src/lib/ourArticles.ts (which is server-only).
 *
 *   npx tsx scripts/check-article-extras.mts place/pala-empire person/louis-xvi …
 */
import { readFileSync } from "node:fs";
import { resolvePath } from "../src/lib/sitePaths";

const AUTO = /^(when did .* exist|where was |what was the capital of |how big was |when was .* born|who was |which state is |when did .* happen|where did .* take place|how did the map change|what is |when did .* begin|where was .* centred)/i;
let failed = false;
for (const page of process.argv.slice(2)) {
  const raw = readFileSync(`content/articles/${page}.md`, "utf8");
  const head = raw.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const list = (name: string) => head.match(new RegExp(`^${name}:\\n((?:[ \\t]+-.*\\n?)+)`, "m"))?.[1] ?? "";
  const lines = (name: string) => list(name).split("\n").filter((l) => l.trim());
  const problems: string[] = [];
  const glance = [...list("glance").matchAll(/^[ \t]+-\s*([^:]+?):\s+(.+?)\s*$/gm)];
  const rulers = [...list("rulers").matchAll(/^[ \t]+-\s*([^:]+?):\s+(.+?)\s*$/gm)];
  const timeline = [...list("timeline").matchAll(/^[ \t]+-\s*(~?-?\d+)\s*:\s*(.+?)\s*$/gm)];
  const faq = [...list("faq").matchAll(/^[ \t]+-\s*Q:\s*(.+?)\s+A:\s*(.+?)\s*$/gm)];
  for (const [name, parsed] of [["glance", glance], ["rulers", rulers], ["timeline", timeline], ["faq", faq]] as const) {
    if (lines(name).length !== parsed.length) problems.push(`${name}: ${lines(name).length - parsed.length} line(s) don't parse`);
  }
  for (const m of glance) if (m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").length > 60) problems.push(`glance "${m[1]}" value too long`);
  for (const m of faq) if (AUTO.test(m[1])) problems.push(`faq repeats an automatic answer: "${m[1]}"`);
  const all = [...glance, ...rulers, ...timeline, ...faq].map((m) => m[0]).join(" ");
  for (const [, href] of all.matchAll(/\]\((\/[^)\s]+)\)/g)) if (!resolvePath(href)) problems.push(`no page at ${href}`);
  const counts = `glance ${glance.length} · rulers ${rulers.length} · dates ${timeline.length} · faq ${faq.length}`;
  console.log(`${problems.length ? "FAIL" : "OK  "} ${page}: ${counts}${problems.length ? "\n  " + problems.join("\n  ") : ""}`);
  if (problems.length) failed = true;
}
process.exit(failed ? 1 : 0);
