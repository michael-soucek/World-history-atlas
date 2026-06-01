import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

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
  title: "World History Atlas",
  description:
    "Explore how the world's empires and nations rose, shifted, and fell throughout history. Scrub through time and watch borders change.",
  openGraph: {
    title: "World History Atlas",
    description:
      "A map-first website where anyone can scrub through time and watch the world's empires rise, shift, and fall.",
    siteName: "World History Atlas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World History Atlas",
    description: "Watch the world's empires rise and fall — year by year.",
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
      </body>
    </html>
  );
}
