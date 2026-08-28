import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
