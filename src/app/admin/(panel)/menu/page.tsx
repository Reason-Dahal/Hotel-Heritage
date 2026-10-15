import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import { getMenuCategories, toMenuItemDTO } from "@/lib/content";
import MenuManager from "@/components/admin/menu/MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await connectDB();
  const [docs, categories] = await Promise.all([
    MenuItem.find({}).populate("categoryId", "name").sort({ createdAt: -1 }).lean(),
    getMenuCategories(),
  ]);

  return (
    <MenuManager
      items={docs.map((m) => toMenuItemDTO(m))}
      categories={categories}
    />
  );
}