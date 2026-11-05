import { z } from "zod";
import { OBJECT_ID_PATTERN } from "@/lib/objectId";

// Note: no .default() here on purpose. Mongoose applies defaults on create.
// Defaults in Zod would also fire inside .partial() and overwrite stored
// values on updates.

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

// Photos shown through next/image must come from our own Cloudinary account
const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";
const PHOTO_MESSAGE = "Photos must be uploaded through the admin panel";

const isCloudinaryUrl = (v: string) => isHttpUrl(v) && v.startsWith(CLOUDINARY_PREFIX);

const cloudinaryUrl = z.string().trim().refine(isCloudinaryUrl, PHOTO_MESSAGE);

const optionalCloudinaryUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || isCloudinaryUrl(v), PHOTO_MESSAGE);

const photoList = z.array(cloudinaryUrl).max(20, "A maximum of 20 photos is allowed");

const messageList = z
  .array(z.string().trim().min(1).max(200))
  .max(10)
  .optional();

export const roomInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).optional(),
  images: photoList.optional(),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional(),
  capacity: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
});

export const menuItemInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).optional(),
  images: photoList.optional(),
  categoryId: z
    .string()
    .regex(OBJECT_ID_PATTERN, "Choose a valid category")
    .nullable()
    .optional(),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional(),
  featured: z.boolean().optional(),
});

export const noticeInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  message: z.string().trim().min(1, "Message is required").max(2000),
  image: optionalCloudinaryUrl.optional(),
  active: z.boolean().optional(),
});

export const siteSettingsInputSchema = z.object({
  hotelName: z.string().trim().min(1, "Hotel name is required").max(100),
  tagline: z.string().trim().max(160).optional(),
  description: z.string().trim().max(500).optional(),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/, "Choose a currency from the list")
    .optional(),
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
  // Spaces, dashes, brackets, and + are stripped, so "+977 98-1234-5678" is accepted
  whatsappNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s\-().+]/g, ""))
    .refine(
      (v) => v === "" || /^\d{8,15}$/.test(v),
      "Enter the WhatsApp number with country code, 8 to 15 digits"
    )
    .optional(),
  facebookUrl: optionalHttpUrl.optional(),
  instagramUrl: optionalHttpUrl.optional(),
  tiktokUrl: optionalHttpUrl.optional(),
  youtubeUrl: optionalHttpUrl.optional(),
  mapEmbedUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.startsWith("https://www.google.com/maps/embed"),
      "Use the Google Maps 'Embed a map' link"
    )
    .optional(),
  heroImage: optionalCloudinaryUrl.optional(),
  heroImageAlt: z.string().trim().max(160).optional(),
  heroSubtitle: z.string().trim().max(160).optional(),
  bannerMessages: messageList,
  tickerMessages: messageList,
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
});

export const categoryReorderSchema = z.object({
  orderedIds: z.array(z.string().regex(OBJECT_ID_PATTERN)).min(1).max(100),
});

export const galleryImageInputSchema = z.object({
  url: cloudinaryUrl,
  alt: z.string().trim().max(160).optional(),
});

export const galleryUpdateSchema = z.object({
  alt: z.string().trim().max(160),
});

// Same shape as categories: the full list of ids in the new order
export const galleryReorderSchema = categoryReorderSchema;