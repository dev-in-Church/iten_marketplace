import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "RunnerMKT - Sports Equipment Marketplace",
  description:
    "Kenya's leading multi-vendor sports equipment marketplace. Shop running shoes, football boots, gym equipment and more from verified vendors.",

  manifest: "/manifest.json",

  keywords: [
    "sports",
    "equipment",
    "marketplace",
    "kenya",
    "running",
    "football",
    "gym",
  ],

  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RunnerMKT",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a7a2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      {" "}
      <body className="font-sans pt-34 antialiased bg-background text-foreground overflow-x-hidden max-w-full">
        {children}
      </body>
    </html>
  );
}
