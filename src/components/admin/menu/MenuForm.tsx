"use client";

import { useState } from "react";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from "@/components/admin/FormFields";
import ImageListEditor from "@/components/admin/ImageListEditor";
import type { CategoryDTO } from "@/types/content";
import type { MenuItemDTO } from "./types";

export interface MenuItemPayload {
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  images: string[];
  categoryId: string | null;
  featured: boolean;
}

interface Props {
  item: MenuItemDTO | null; // null = creating a new item
  categories: CategoryDTO[];
  saving: boolean;
  error: string;
  onSubmit: (payload: MenuItemPayload) => void;
  onCancel: () => void;
}

type TextKey = "name" | "description" | "price" | "discountPercent";

export default function MenuForm({
  item,
  categories,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    categoryId: item?.categoryId ?? "",
    price: item ? String(item.price) : "",
    discountPercent: item ? String(item.discountPercent) : "0",
    images: item?.images ?? [],
    featured: item?.featured ?? false,
  });

  const setField = (field: TextKey, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const categoryOptions = [
    { value: "", label: "No category" },
    ...categories.map((c) => ({ value: c._id, label: c.name })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPercent: Number(form.discountPercent || 0),
      images: form.images,
      categoryId: form.categoryId || null,
      featured: form.featured,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        {item ? "Edit menu item" : "Add menu item"}
      </h2>

      {error && (
        <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="menu-name"
          label="Name"
          required
          className="sm:col-span-2"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <TextAreaField
          id="menu-description"
          label="Description"
          rows={3}
          className="sm:col-span-2"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
        <div>
          <SelectField
            id="menu-category"
            label="Category"
            options={categoryOptions}
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          />
          <p className="mt-1 text-xs text-gray-500">
            Missing one?{" "}
            <a
              href="/admin/categories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Manage categories
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            , then reload this page.
          </p>
        </div>
        <TextField
          id="menu-price"
          label="Price"
          type="number"
          min="0"
          step="0.01"
          required
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
        />
        <TextField
          id="menu-discount"
          label="Discount (%)"
          type="number"
          min="0"
          max="100"
          value={form.discountPercent}
          onChange={(e) => setField("discountPercent", e.target.value)}
        />
        <CheckboxField
          id="menu-featured"
          label="Signature dish"
          hint="Signature dishes appear in the homepage slideshow."
          className="sm:col-span-2"
          checked={form.featured}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, featured: e.target.checked }))
          }
        />
      </div>

      <div className="mt-4">
        <ImageListEditor
          images={form.images}
          onAdd={(url) =>
            setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
          }
          onRemove={(url) =>
            setForm((prev) => ({
              ...prev,
              images: prev.images.filter((i) => i !== url),
            }))
          }
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save menu item"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}