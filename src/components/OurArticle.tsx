import Link from "next/link";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import ArticleImage, { type ArticleImageData } from "@/components/ArticleImage";
import { ImageStrip } from "@/components/ArticleBody";
import type { ArticleBlock, OurArticle as Article } from "@/lib/ourArticles";

const LINK_CLASS = "text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent";

/** "[text](href)" links inside a paragraph; internal paths use next/link. */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    parts.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={LINK_CLASS}>{label}</Link>
      ) : (
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{label}</a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const plain = (t: string) => t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** Sections shorter than this don't get an image — it would dwarf the text. */
const MIN_SECTION_CHARS_FOR_IMAGE = 500;

/**
 * The page's own article. Images (after the hero) are set into it: one beside
 * the opening, one at the start of each substantial section, alternating
 * sides, and any left over in a strip at the end.
 */
export default function OurArticle({ article, images = [], name }: { article: Article; images?: ArticleImageData[]; name: string }) {
  // Group into an intro (before the first heading) and headed sections.
  const groups: { heading?: string; paras: string[] }[] = [{ paras: [] }];
  for (const b of article.blocks as ArticleBlock[]) {
    if (b.kind === "h2") groups.push({ heading: b.text, paras: [] });
    else groups[groups.length - 1].paras.push(b.text);
  }
  const pool = [...images];
  const groupImages = groups.map((g, i) =>
    i === 0 || g.paras.join(" ").length >= MIN_SECTION_CHARS_FOR_IMAGE ? pool.shift() : undefined,
  );
  const fullText = groups.map((g) => [g.heading, ...g.paras].filter(Boolean).join(". ")).map(plain).join(" ");
  const firstGroup = groups.findIndex((g) => g.paras.length > 0);

  return (
    <section className="mb-14" aria-label="Article">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-ink/10">
        <ReadAloudButton text={fullText} />
        <span className="text-xs text-ink/64">Hear the whole article read aloud</span>
      </div>
      {groups.map((g, gi) => {
        if (!g.heading && g.paras.length === 0) return null;
        const img = groupImages[gi];
        return (
          <div key={gi} className="flow-root">
            {g.heading && (
              <h2 className="pt-8 pb-5 font-display text-2xl sm:text-[28px] leading-tight tracking-tight text-ink">{g.heading}</h2>
            )}
            {img && <ArticleImage img={img} alt={img.caption ?? g.heading ?? name} variant="float" side={gi % 2 === 0 ? "right" : "left"} />}
            <div className="space-y-5">
              {g.paras.map((p, pi) => {
                const cls = `font-text text-ink/85 text-[18px] sm:text-[19px] leading-[1.72] ${gi === firstGroup && pi === 0 ? "dropcap" : ""}`;
                return <p key={pi} className={cls}><Inline text={p} /></p>;
              })}
            </div>
          </div>
        );
      })}
      {article.sources.length > 0 && (
        <div className="mt-10 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink/66">
          <p className="label !text-[10px] text-ink/64">Sources</p>
          <ul className="mt-2 space-y-1">
            {article.sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {pool.length > 0 && <ImageStrip images={pool} name={name} />}
    </section>
  );
}
