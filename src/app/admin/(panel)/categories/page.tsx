import CategoriesManager from "@/components/admin/Categories/CategoriesManager";
import { getCategoriesWithCounts } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();
  return <CategoriesManager categories={categories} />;
}