import OurArticle from "@/components/OurArticle";
import type { ArticleImageData } from "@/components/ArticleImage";
import { SectionRule } from "@/components/PageIntro";
import { getOurArticle, type ArticleKind } from "@/lib/ourArticles";

/**
 * The written history at the top of a city or hub page, from
 * content/articles/{kind}/{slug}.md. Pages without one show nothing.
 */
export default function PageHistory({ kind, slug, name, heading, images }: { kind: ArticleKind; slug: string; name: string; heading: string; images?: ArticleImageData[] }) {
  const article = getOurArticle(kind, slug);
  if (!article) return null;
  return (
    <section className="mb-16 sm:mb-24">
      <SectionRule>{heading}</SectionRule>
      <div className="max-w-3xl">
        <OurArticle article={article} images={images} name={name} />
      </div>
    </section>
  );
}
