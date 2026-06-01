import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = "/timeline-art/modern-industrial-worker.jpg";

interface PageSeoArgs {
  title: string;
  description: string;
  type?: "website" | "article";
  imageUrl?: string;
}

export function buildPageMetadata(args: PageSeoArgs): Metadata {
  const imageUrl = args.imageUrl || DEFAULT_SOCIAL_IMAGE;
  return {
    title: args.title,
    description: args.description,
    openGraph: {
      title: args.title,
      description: args.description,
      siteName: "World History Atlas",
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
