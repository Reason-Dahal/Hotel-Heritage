import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import PageHeader from "@/components/public/PageHeader";
import DishCard from "@/components/public/DishCard";
import {
  getAllMenuItems,
  getMenuCategories,
  groupMenuByCategory,
} from "@/lib/content";

export const revalidate = 3600;

const GRID_SIZES = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw";

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

      <div className="mx-auto max-w-6xl px-4 py-10">
        {sections.length === 0 ? (
          <p className="py-10 text-center text-gray-600">
            Our menu is coming soon. Please check back shortly.
          </p>
        ) : (
          <>
            {sections.length > 1 && (
              <nav
                aria-label="Menu categories"
                className="mb-10 flex flex-wrap justify-center gap-2"
              >
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-brand-700 hover:text-brand-700"
                  >
                    {s.name}
                  </a>
                ))}
              </nav>
            )}

            <div className="space-y-14">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-6"
                >
                  <h2
                    id={`${section.id}-heading`}
                    className="mb-6 text-2xl font-bold text-gray-900"
                  >
                    {section.name}
                  </h2>
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((item) => (
                      <li key={item._id}>
                        <DishCard
                          item={item}
                          currency={settings.currency}
                          sizes={GRID_SIZES}
                          expanded
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}