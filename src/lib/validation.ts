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
  image: z.string().url().optional(),
  active: z.boolean().optional(),
});