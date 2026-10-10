import { cache } from "react";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_SETTINGS, type SiteSettingsDTO } from "@/types/settings";

// cache() means the header, footer, and page share one database read per request
export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO> => {
  await connectDB();
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  if (!doc) return DEFAULT_SETTINGS;

  return {
    hotelName: doc.hotelName || DEFAULT_SETTINGS.hotelName,
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    address: doc.address ?? "",
    phone: doc.phone ?? "",
    email: doc.email ?? "",
    facebookUrl: doc.facebookUrl ?? "",
    instagramUrl: doc.instagramUrl ?? "",
    tiktokUrl: doc.tiktokUrl ?? "",
    youtubeUrl: doc.youtubeUrl ?? "",
    whatsappUrl: doc.whatsappUrl ?? "",
    mapEmbedUrl: doc.mapEmbedUrl ?? "",
    heroImage: doc.heroImage ?? "",
    bannerMessages: doc.bannerMessages ?? [],
    currency: doc.currency || DEFAULT_SETTINGS.currency,
  };
});