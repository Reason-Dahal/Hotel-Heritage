import type { Metadata } from "next";
import type { SiteSettingsDTO } from "@/types/settings";

interface PageSeo {
  title?: string; // leave out on the homepage to use the site-wide title
  description?: string;
  path: string;
}

// One place that builds a page's title, description, canonical link,
// and the tags used for link previews (Open Graph and Twitter)
export function pageMetadata(
  settings: SiteSettingsDTO,
  { title, description, path }: PageSeo
): Metadata {
  const { hotelName, tagline, heroImage, heroImageAlt } = settings;

  const fullTitle = title
    ? `${title} | ${hotelName}`
    : tagline
      ? `${hotelName} | ${tagline}`
      : hotelName;
  const text = description || settings.description || undefined;
  const images = heroImage
    ? [{ url: heroImage, alt: heroImageAlt || `Photo of ${hotelName}` }]
    : undefined;

  return {
    ...(title ? { title } : {}),
    description: text,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: hotelName,
      title: fullTitle,
      description: text,
      url: path,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: fullTitle,
      description: text,
      images: images?.map((image) => image.url),
    },
  };
}