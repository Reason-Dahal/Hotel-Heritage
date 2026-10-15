"use client";

import { useState } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import type { CategoryDTO } from "@/types/content";
import CategoryRow from "./CategoryRow";

export default function CategoriesManager({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  const { saving, deletingId, error, save, remove, action } =
    useAdminCrud("/api/categories");
  const [newName, setNewName] = useState("");
  const busy = saving || deletingId !== null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await save(null, { name: newName })) setNewName("");
  };

  const handleMove = async (index: number, delta: -1 | 1) => {
    const ids = categories.map((c) => c._id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await action("/reorder", { orderedIds: ids });
  };

  const handleDelete = async (category: CategoryDTO) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    await remove(category._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
      <p className="mt-1 text-gray-600">
        Group your dishes. The order here is the order on your public menu.
      </p>

      <form
        onSubmit={handleAdd}
        className="mt-6 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-4"
      >
        <label htmlFor="new-category" className="sr-only">
          New category name
        </label>
        <input
          id="new-category"
          value={newName}
          maxLength={60}
          required
          placeholder="e.g. Starter"
          onChange={(e) => setNewName(e.target.value)}
          className="min-w-0 flex-1 rounded border border-gray-300 p-2"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Add category
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-gray-600">
            No categories yet. Add the first one above.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category, index) => (
              <CategoryRow
                key={category._id}
                category={category}
                isFirst={index === 0}
                isLast={index === categories.length - 1}
                busy={busy}
                deleting={deletingId === category._id}
                onMove={(delta) => handleMove(index, delta)}
                onRename={(name) => save(category._id, { name })}
                onDelete={() => handleDelete(category)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}