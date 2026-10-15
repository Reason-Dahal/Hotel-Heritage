import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import {
  getAllMenuItems,
  getMenuCategories,
  groupMenuByCategory,
} from "@/lib/content";
import PageHeader from "@/components/public/PageHeader";
import MenuBrowser from "@/components/public/MenuBrowser";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { hotelName } = await getSiteSettings();
  return {
    title: "Menu",
    description: `Browse the full menu at ${hotelName}: dishes, descriptions, and prices.`,
    alternates: { canonical: "/menu" },
  };
}

export default async function MenuPage() {
  const [settings, items, categories] = await Promise.all([
    getSiteSettings(),
    getAllMenuItems(),
    getMenuCategories(),
  ]);
  const sections = groupMenuByCategory(items, categories);

  return (
    <>
      <PageHeader
        title="Our menu"
        intro="Freshly prepared dishes, served daily. Prices are shown in full, with any current offers."
      />

      {sections.length === 0 ? (
        <p className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-600">
          Our menu is coming soon. Please check back shortly.
        </p>
      ) : (
        <MenuBrowser sections={sections} currency={settings.currency} />
      )}
    </>
  );
}