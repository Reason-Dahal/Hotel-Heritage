import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import {
  getAllMenuItems,
  getMenuCategories,
  groupMenuByCategory,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { menuJsonLd } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/public/PageHeader";
import MenuBrowser from "@/components/public/MenuBrowser";
import { COPY } from "@/lib/copy";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    title: "Menu",
    description: `Browse the full menu at ${settings.hotelName}: dishes, descriptions, and prices.`,
    path: "/menu",
  });
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
      {sections.length > 0 && (
        <JsonLd
          data={menuJsonLd(`${settings.hotelName} menu`, sections, settings.currency)}
        />
      )}

      <PageHeader
        title="Our menu"
        intro={COPY.menu}
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