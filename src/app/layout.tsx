import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const defaultTitle = settings.tagline
    ? `${settings.hotelName} | ${settings.tagline}`
    : settings.hotelName;
  const images = settings.heroImage
    ? [
        {
          url: settings.heroImage,
          alt: settings.heroImageAlt || `Photo of ${settings.hotelName}`,
        },
      ]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: defaultTitle, template: `%s | ${settings.hotelName}` },
    description: settings.description || undefined,
    openGraph: { type: "website", siteName: settings.hotelName, images },
    twitter: { card: images ? "summary_large_image" : "summary" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">{children}</body>
    </html>
  );
}