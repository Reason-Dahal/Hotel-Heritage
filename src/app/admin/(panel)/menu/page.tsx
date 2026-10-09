import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import MenuManager from "@/components/admin/menu/MenuManager";
import type { MenuItemDTO } from "@/components/admin/menu/types";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await connectDB();
  const docs = await MenuItem.find({}).sort({ createdAt: -1 }).lean();

  const items: MenuItemDTO[] = docs.map((m) => ({
    _id: String(m._id),
    name: m.name,
    description: m.description ?? "",
    images: m.images ?? [],
    category: m.category ?? "",
    price: m.price,
    discountPercent: m.discountPercent ?? 0,
  }));

  return <MenuManager items={items} />;
}