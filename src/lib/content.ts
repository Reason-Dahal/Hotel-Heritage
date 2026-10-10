import connectDB from "@/lib/db";
import Room from "@/models/Room";
import MenuItem from "@/models/MenuItem";
import type { RoomDTO, MenuItemDTO } from "@/types/content";

const FEATURED_LIMIT = 8;

export async function getFeaturedMenuItems(): Promise<MenuItemDTO[]> {
  await connectDB();
  const docs = await MenuItem.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();

  return docs.map((m) => ({
    _id: String(m._id),
    name: m.name,
    description: m.description ?? "",
    images: m.images ?? [],
    category: m.category ?? "",
    price: m.price,
    discountPercent: m.discountPercent ?? 0,
    featured: m.featured ?? false,
  }));
}

export async function getFeaturedRooms(): Promise<RoomDTO[]> {
  await connectDB();
  const docs = await Room.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();

  return docs.map((r) => ({
    _id: String(r._id),
    name: r.name,
    description: r.description ?? "",
    images: r.images ?? [],
    price: r.price,
    discountPercent: r.discountPercent ?? 0,
    capacity: r.capacity,
    featured: r.featured ?? false,
  }));
}