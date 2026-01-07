import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "OpenWorld.Map - Gig Worker Community",
    template: "%s | OpenWorld.Map",
  },
  description:
    "Location-aware social platform for gig workers to share real-time traffic, safety, deals, and community updates.",
  keywords: [
    "gig workers",
    "delivery riders",
    "rideshare drivers",
    "traffic updates",
    "community",
    "deals",
    "map",
    "location",
  ],
  authors: [{ name: "OpenWorld.Map" }],
  creator: "OpenWorld.Map",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
