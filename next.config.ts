import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Our own articles are read from disk (src/lib/ourArticles.ts). Pages are
  // prerendered, but ISR re-renders run in a function that only bundles traced
  // files, so include the Markdown explicitly.
  outputFileTracingIncludes: {
    "/place/[slug]": ["./content/articles/place/**/*"],
    "/person/[slug]": ["./content/articles/person/**/*"],
    "/event/[slug]": ["./content/articles/event/**/*"],
    "/culture/[slug]": ["./content/articles/culture/**/*"],
    "/explorer/[slug]": ["./content/articles/explorer/**/*"],
  },
  async redirects() {
    return [
      // Redirect old Vercel preview domain to canonical custom domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "world-history-atlas.vercel.app" }],
        destination: "https://www.bordersoftime.com/:path*",
        permanent: true,
      },
      // Redirect bare domain to www
      {
        source: "/:path*",
        has: [{ type: "host", value: "bordersoftime.com" }],
        destination: "https://www.bordersoftime.com/:path*",
        permanent: true,
      },
      // Deduplicate place slugs — typo variant and alias pointing to same QID
      {
        source: "/place/polishlithuanian-commonwealth",
        destination: "/place/polish-lithuanian-commonwealth",
        permanent: true,
      },
      {
        source: "/place/manchu-empire",
        destination: "/place/qing-dynasty",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
