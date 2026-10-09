"use client";

import { useState } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import MenuForm, { type MenuItemPayload } from "./MenuForm";
import MenuTable from "./MenuTable";
import type { MenuItemDTO } from "./types";

export default function MenuManager({ items }: { items: MenuItemDTO[] }) {
  const { saving, deletingId, error, clearError, save, remove } =
    useAdminCrud("/api/menu");

  // null = form closed, "new" = creating, otherwise the item being edited
  const [editing, setEditing] = useState<MenuItemDTO | "new" | null>(null);

  const closeForm = () => {
    setEditing(null);
    clearError();
  };

  const handleSave = async (payload: MenuItemPayload) => {
    const id = editing && editing !== "new" ? editing._id : null;
    if (await save(id, payload)) closeForm();
  };

  const handleDelete = async (item: MenuItemDTO) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    await remove(item._id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
          <p className="mt-1 text-gray-600">Manage the dishes shown on your website.</p>
        </div>
        {editing === null && (
          <button
            onClick={() => {
              clearError();
              setEditing("new");
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add menu item
          </button>
        )}
      </div>

      {error && editing === null && (
        <p role="alert" className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {editing !== null && (
        <MenuForm
          key={editing === "new" ? "new" : editing._id}
          item={editing === "new" ? null : editing}
          saving={saving}
          error={error}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <MenuTable
          items={items}
          deletingId={deletingId}
          onEdit={(item) => {
            clearError();
            setEditing(item);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}