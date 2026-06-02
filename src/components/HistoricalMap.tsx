"use client";

import dynamic from "next/dynamic";

const HistoricalMapClient = dynamic(() => import("@/components/HistoricalMapClient"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-paper bg-white/60 p-6 text-sm text-ink/50 shadow-sm">
      Loading historical borders timeline...
    </div>
  ),
});

export default function HistoricalMap() {
  return <HistoricalMapClient />;
}
