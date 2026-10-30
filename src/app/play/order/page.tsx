import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, webAppLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import PlayTabs from "@/components/PlayTabs";
import OrderGame from "@/components/OrderGame";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Put It in Order: Daily History Timeline Puzzle — Borders of Time",
  description: "Five moments from world history, shuffled. Put them in the order they happened. A new puzzle every day, plus unlimited practice.",
  path: "/play/order",
});

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            webAppLd("Put It in Order", "A daily history puzzle: five events, shuffled. Put them in the order they happened.", "/play/order", "GameApplication"),
            breadcrumbLd([["Games", "/play"], ["Put It in Order", "/play/order"]]),
          ]}
        />
        <PageIntro
          label="Daily game"
          title={<>Put it in <span className="italic">order</span></>}
          lede="Five moments from world history, shuffled. Put them in the order they happened, earliest first. A new five every day."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <PlayTabs current="/play/order" />
          <OrderGame />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
