import type { Metadata, Viewport } from "next";
import AdsenseLoader from "@/components/AdsenseLoader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Geist, Geist_Mono, Fraunces, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false, // small labels only; not worth competing with the first paint
});

// Display face: an old-style serif with optical sizes, so the huge headings
// stay sharp and the small ones stay sturdy.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Reading face for article text.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false, // article text sits below the title and lead picture
});

export const viewport: Viewport = {
  themeColor: "#0b1424", // browser chrome on mobile matches the night header
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bordersoftime.com"),
  title: "Borders of Time",
  description:
    "Explore how the world's empires and nations rose, shifted, and fell throughout history. Scrub through time and watch borders change.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  other: { "google-adsense-account": "ca-pub-1772060773365341" },
  openGraph: {
    title: "Borders of Time",
    description:
      "An interactive world history atlas. Watch the world's empires rise, shift, and fall — year by year.",
    siteName: "Borders of Time",
    type: "website",
    images: [{ url: DEFAULT_SOCIAL_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Borders of Time",
    description: "An interactive world history atlas. Watch borders shift through time.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${sourceSerif.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-parchment text-ink">
        <AdsenseLoader />
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
