import { z } from "zod";

export const roomInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional().default(0),
  capacity: z.number().int().positive().optional(),
});

export const menuItemInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
  category: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  discountPercent: z.number().min(0).max(100).optional().default(0),
});

export const noticeInputSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    image: z.string().url().optional(),
    active: z.boolean().optional().default(false),
  });