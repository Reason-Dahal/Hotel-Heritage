import connectDB from "@/lib/db";
import Room, { type IRoom } from "@/models/Room";
import MenuItem, { type IMenuItem } from "@/models/MenuItem";
import Category from "@/models/Category";
import Notice from "@/models/Notice";
import type {
  RoomDTO,
  MenuItemDTO,
  CategoryDTO,
  PublicNotice,
} from "@/types/content";

const FEATURED_LIMIT = 8;
const NOTICE_LIMIT = 5;

type LeanMenuItem = Omit<IMenuItem, "categoryId"> & {
  _id: unknown;
  categoryId?: { _id: unknown; name: string } | null; // populated
};

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

export function toMenuItemDTO(m: LeanMenuItem): MenuItemDTO {
  return {
    _id: String(m._id),
    name: m.name,
    description: m.description ?? "",
    images: m.images ?? [],
    categoryId: m.categoryId ? String(m.categoryId._id) : "",
    category: m.categoryId?.name ?? "",
    price: m.price,
    discountPercent: m.discountPercent ?? 0,
    featured: m.featured ?? false,
  };
}

export async function getFeaturedMenuItems(): Promise<MenuItemDTO[]> {
  await connectDB();
  const docs = await MenuItem.find({ featured: true })
    .populate("categoryId", "name")
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
    .populate("categoryId", "name")
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

// Categories in the order the admin chose
export async function getMenuCategories(): Promise<CategoryDTO[]> {
  await connectDB();
  const docs = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
  return docs.map((c) => ({
    _id: String(c._id),
    name: c.name,
    sortOrder: c.sortOrder ?? 0,
  }));
}

// Same list, plus how many menu items use each (for the admin page)
export async function getCategoriesWithCounts(): Promise<CategoryDTO[]> {
  const [categories, counts] = await Promise.all([
    getMenuCategories(),
    MenuItem.aggregate([
      { $match: { categoryId: { $ne: null } } },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ]),
  ]);

  const countById = new Map<string, number>(
    counts.map((c: { _id: unknown; count: number }): [string, number] => [
      String(c._id),
      c.count,
    ])
  );
  return categories.map((c) => ({ ...c, itemCount: countById.get(c._id) ?? 0 }));
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItemDTO[];
}

// Sections follow the admin's category order. Empty categories are skipped,
// and dishes without a category go last under "Other".
export function groupMenuByCategory(
  items: MenuItemDTO[],
  categories: CategoryDTO[]
): MenuSection[] {
  const byCategory = new Map<string, MenuItemDTO[]>();
  const uncategorized: MenuItemDTO[] = [];

  for (const item of items) {
    if (!item.categoryId) {
      uncategorized.push(item);
      continue;
    }
    const list = byCategory.get(item.categoryId) ?? [];
    list.push(item);
    byCategory.set(item.categoryId, list);
  }

  const sections: { name: string; items: MenuItemDTO[] }[] = [];
  for (const category of categories) {
    const list = byCategory.get(category._id);
    if (list && list.length > 0) sections.push({ name: category.name, items: list });
  }
  if (uncategorized.length > 0) {
    sections.push({ name: "Other", items: uncategorized });
  }

  return sections.map((s, i) => ({ id: `menu-section-${i}`, ...s }));
}

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