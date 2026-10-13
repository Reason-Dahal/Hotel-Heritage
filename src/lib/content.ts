import connectDB from "@/lib/db";
import Room, { type IRoom } from "@/models/Room";
import MenuItem, { type IMenuItem } from "@/models/MenuItem";
import type { RoomDTO, MenuItemDTO, PublicNotice  } from "@/types/content";
import Notice from "@/models/Notice";

const FEATURED_LIMIT = 8;

function toRoomDTO(r: IRoom & { _id: unknown }): RoomDTO {
  return {
    _id: String(r._id),
    name: r.name,
    description: r.description ?? "",
    images: r.images ?? [],
    price: r.price,
    discountPercent: r.discountPercent ?? 0,
    capacity: r.capacity,
    featured: r.featured ?? false,
  };
}

function toMenuItemDTO(m: IMenuItem & { _id: unknown }): MenuItemDTO {
  return {
    _id: String(m._id),
    name: m.name,
    description: m.description ?? "",
    images: m.images ?? [],
    category: m.category ?? "",
    price: m.price,
    discountPercent: m.discountPercent ?? 0,
    featured: m.featured ?? false,
  };
}

export async function getFeaturedMenuItems(): Promise<MenuItemDTO[]> {
  await connectDB();
  const docs = await MenuItem.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();
  return docs.map((m) => toMenuItemDTO(m));
}

export async function getFeaturedRooms(): Promise<RoomDTO[]> {
  await connectDB();
  const docs = await Room.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();
  return docs.map((r) => toRoomDTO(r));
}

export async function getAllMenuItems(): Promise<MenuItemDTO[]> {
  await connectDB();
  const docs = await MenuItem.find({})
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  return docs.map((m) => toMenuItemDTO(m));
}

export async function getAllRooms(): Promise<RoomDTO[]> {
  await connectDB();
  const docs = await Room.find({})
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  return docs.map((r) => toRoomDTO(r));
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItemDTO[];
}

// Classic menu order first, other categories alphabetically, "Other" last
const CATEGORY_ORDER = ["starter", "main course", "dessert", "beverage"];

export function groupMenuByCategory(items: MenuItemDTO[]): MenuSection[] {
  const groups = new Map<string, { name: string; items: MenuItemDTO[] }>();

  for (const item of items) {
    const name = item.category.trim() || "Other";
    const key = name.toLowerCase();
    const group = groups.get(key);
    if (group) group.items.push(item);
    else groups.set(key, { name, items: [item] });
  }

  const rank = (key: string) => {
    if (key === "other") return 1000;
    const i = CATEGORY_ORDER.indexOf(key);
    return i === -1 ? 500 : i;
  };

  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([, group], i) => ({ id: `menu-section-${i}`, ...group }));
}

const NOTICE_LIMIT = 5;

export async function getActiveNotices(): Promise<PublicNotice[]> {
  await connectDB();
  const docs = await Notice.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(NOTICE_LIMIT)
    .lean();

  return docs.map(
    (n: {
      _id: unknown;
      title: string;
      message: string;
      image?: string;
      updatedAt?: Date;
    }) => ({
      _id: String(n._id),
      title: n.title,
      message: n.message,
      image: n.image ?? "",
      key: `${String(n._id)}:${n.updatedAt ? new Date(n.updatedAt).getTime() : 0}`,
    })
  );
}