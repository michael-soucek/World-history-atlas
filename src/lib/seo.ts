import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = "/timeline-art/modern-industrial-worker.jpg";

interface PageSeoArgs {
  title: string;
  description: string;
  type?: "website" | "article";
  imageUrl?: string;
  /** This page's own path, e.g. "/era/medieval" — sets the canonical tag. Omit only for pages that intentionally have none (e.g. a 404 fallback). */
  path?: string;
}

export function buildPageMetadata(args: PageSeoArgs): Metadata {
  const imageUrl = args.imageUrl || DEFAULT_SOCIAL_IMAGE;
  return {
    title: args.title,
    description: args.description,
    ...(args.path ? { alternates: { canonical: args.path } } : {}),
    openGraph: {
      title: args.title,
      description: args.description,
      siteName: "Borders of Time",
      type: args.type ?? "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: [imageUrl],
    },
  };
}
