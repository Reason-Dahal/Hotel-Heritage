import { Schema, models, model } from "mongoose";
import type { SiteSettingsDTO } from "@/types/settings";

export interface ISiteSettings extends SiteSettingsDTO {
  key: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: "main", unique: true },
    hotelName: { type: String, required: true, default: "Hotel Heritage" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    bannerMessages: { type: [String], default: [] },
    currency: { type: String, default: "NPR" },
  },
  { timestamps: true }
);

const SiteSettings =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;