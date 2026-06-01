"use client";

import { useState } from "react";

/**
 * Small overlay that explains the three confidence tiers and what blank space means.
 * Renders as a compact toggle button; expands to a legend card.
 *
 * Positioned bottom-left, above the slider.
 * Implements Step 6 of the data-gap-filling plan:
 *   "Add a small data confidence legend (with an optional toggle)"
 */
export default function ConfidenceLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute left-3 bottom-28 z-10 pointer-events-auto select-none">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle data confidence legend"
        className="text-xs text-white/50 bg-black/40 hover:bg-black/65 px-2.5 py-1
          rounded backdrop-blur-sm transition-colors"
      >
        {open ? "× confidence" : "data confidence ↑"}
      </button>

      {open && (
        <div
          className="mt-1.5 bg-black/75 backdrop-blur-sm border border-white/10
            rounded-lg p-3.5 text-xs text-white/80 w-60 space-y-2.5"
        >
          {/* High */}
          <Row
            swatch="rgba(120,180,110,0.55)"
            label="High"
            detail="Historical documents / OpenHistoricalMap"
          />
          {/* Medium */}
          <Row
            swatch="rgba(120,180,110,0.47)"
            label="Medium"
            detail="Academic reconstruction or moderate precision"
          />
          {/* Low */}
          <Row
            swatch="rgba(120,180,110,0.33)"
            label="Low"
            detail="Approximate or estimated borders"
            extra="~~ blurred edge ~~"
          />
          {/* Blank */}
          <Row
            swatch={null}
            label="Blank"
            detail="No data — unknown areas stay empty"
          />

          <p className="text-white/35 leading-snug pt-0.5">
            Showing uncertainty builds trust.
            Blank is information.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Row helper ─────────────────────────────────────────────────────────────

function Row({
  swatch,
  label,
  detail,
  extra,
}: {
  swatch: string | null;
  label: string;
  detail: string;
  extra?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">
        {swatch ? (
          <span
            className="block w-5 h-3 rounded-sm border border-white/15"
            style={{ background: swatch }}
          />
        ) : (
          <span className="block w-5 h-3 rounded-sm border border-white/25 bg-transparent" />
        )}
      </div>
      <div>
        <span className="font-semibold text-white/90">{label}</span>
        {extra && (
          <span className="ml-1 text-white/40 font-mono text-[10px]">{extra}</span>
        )}
        <br />
        <span className="text-white/50">{detail}</span>
      </div>
    </div>
  );
}
