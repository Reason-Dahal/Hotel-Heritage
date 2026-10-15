"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { MenuSection } from "@/lib/content";
import { matchesQuery } from "@/lib/search";
import DishCard from "./DishCard";
import SearchBox from "./SearchBox";
import CategoryChips from "./CategoryChips";

// Two columns on phones, so each image is about half the screen wide
const GRID_SIZES = "(min-width: 1024px) 384px, 50vw";

interface Props {
  sections: MenuSection[];
  currency: string;
}

export default function MenuBrowser({ sections, currency }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searching = deferredQuery.trim() !== "";

  const visible = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            matchesQuery(deferredQuery, item.name, item.description, item.category)
          ),
        }))
        .filter((section) => section.items.length > 0),
    [sections, deferredQuery]
  );

  const total = visible.reduce((sum, section) => sum + section.items.length, 0);
  const enabledIds = new Set(visible.map((section) => section.id));

  return (
    <div>
      {/* Search and category chips stay pinned while the visitor scrolls */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <SearchBox
            id="menu-search"
            label="Search the menu"
            placeholder="Search dishes"
            value={query}
            onChange={setQuery}
          />
          {sections.length > 1 && (
            <CategoryChips
              chips={sections.map(({ id, name }) => ({ id, name }))}
              enabled={enabledIds}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <p role="status" className="mb-3 min-h-5 text-sm text-gray-600">
          {searching ? `${total} ${total === 1 ? "dish" : "dishes"} found` : ""}
        </p>

        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-700">No dishes match &ldquo;{deferredQuery}&rdquo;.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {visible.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-32"
              >
                <h2
                  id={`${section.id}-heading`}
                  className="mb-4 text-xl font-bold text-gray-900 md:text-2xl"
                >
                  {section.name}
                </h2>
                <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <li key={item._id} className="min-w-0">
                      <DishCard
                        item={item}
                        currency={currency}
                        sizes={GRID_SIZES}
                        expanded
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}