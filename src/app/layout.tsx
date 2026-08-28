import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-parchment text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
