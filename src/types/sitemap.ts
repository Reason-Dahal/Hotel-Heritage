import type { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";
import SiteSettings from "@/models/SiteSettings";
import GalleryImage from "@/models/GalleryImage";
import { absoluteUrl } from "@/lib/site";

// Rebuilt at least hourly
export const revalidate = 3600;

type Stamped = { updatedAt?: Date } | null;

// The most recent change among the given records
function newest(...records: Stamped[]): Date | undefined {
  const times = records.flatMap((r) =>
    r?.updatedAt ? [new Date(r.updatedAt).getTime()] : []
  );
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [room, menuItem, category, settings, gallery] = await Promise.all([
    Room.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    MenuItem.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    Category.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    SiteSettings.findOne({}).select("updatedAt").lean(),
    GalleryImage.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean(),
  ]);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: newest(room, menuItem, settings, gallery),
    },
    { url: absoluteUrl("/rooms"), lastModified: newest(room, settings) },
    {
      url: absoluteUrl("/menu"),
      lastModified: newest(menuItem, category, settings),
    },
  ];
}