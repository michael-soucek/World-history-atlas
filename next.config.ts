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
