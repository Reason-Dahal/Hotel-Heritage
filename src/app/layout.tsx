import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const defaultTitle = settings.tagline
    ? `${settings.hotelName} | ${settings.tagline}`
    : settings.hotelName;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: defaultTitle, template: `%s | ${settings.hotelName}` },
    description: settings.description || undefined,
    openGraph: {
      type: "website",
      siteName: settings.hotelName,
      images: settings.heroImage ? [settings.heroImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}