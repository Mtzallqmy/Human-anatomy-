import type { Metadata } from "next";
import { AppProviders } from "@/src/app/providers/AppProviders";
import "./globals.css";
import "./experience.css";
import "./panel-enhancements.css";

const productionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "human-anatomy-medical-atlas.vercel.app";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${productionHost}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Human Anatomy, Physiology & Pathology Atlas",
    template: "%s | Anatomica Medical Atlas",
  },
  description:
    "Explore human anatomy, physiology, and pathology through a bilingual interactive three-dimensional medical atlas.",
  applicationName: "Anatomica Medical Atlas",
  keywords: [
    "human anatomy",
    "medical atlas",
    "physiology",
    "pathology",
    "interactive 3D",
    "cardiovascular",
    "heart anatomy",
  ],
  openGraph: {
    title: "Human Anatomy, Physiology & Pathology Atlas",
    description: "A bilingual interactive medical atlas connecting anatomy, physiology, and pathology.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Human Anatomy, Physiology & Pathology Atlas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Anatomy, Physiology & Pathology Atlas",
    description: "A bilingual interactive medical atlas connecting anatomy, physiology, and pathology.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
