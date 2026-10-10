import { z } from "zod";

// Note: no .default() here on purpose. Mongoose applies defaults on create.
// Defaults in Zod would also fire inside .partial() and overwrite stored
// values on updates.

export const roomInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional(),
  capacity: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
});

export const menuItemInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional(),
  featured: z.boolean().optional(),
});

export const noticeInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  image: z.string().url().or(z.literal("")).optional(),
  active: z.boolean().optional(),
});

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const optionalHttpUrl = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || isHttpUrl(v),
    "Must be a valid link starting with http:// or https://"
  );

export const siteSettingsInputSchema = z.object({
  hotelName: z.string().trim().min(1, "Hotel name is required").max(100),
  tagline: z.string().trim().max(160).optional(),
  description: z.string().trim().max(500).optional(),
  address: z.string().trim().max(300).optional(),
  phone: z.string().trim().max(40).optional(),
  email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || z.string().email().safeParse(v).success,
      "Enter a valid email address"
    )
    .optional(),
  facebookUrl: optionalHttpUrl.optional(),
  instagramUrl: optionalHttpUrl.optional(),
  tiktokUrl: optionalHttpUrl.optional(),
  youtubeUrl: optionalHttpUrl.optional(),
  whatsappUrl: optionalHttpUrl.optional(),
  mapEmbedUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.startsWith("https://www.google.com/maps/embed"),
      "Use the Google Maps 'Embed a map' link"
    )
    .optional(),
  heroImage: optionalHttpUrl.optional(),
  bannerMessages: z.array(z.string().trim().min(1).max(200)).max(10).optional(),
  currency: z.string().trim().regex(/^[A-Z]{3}$/, "Choose a currency from the list").optional(),
});