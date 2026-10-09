"use client";

import { useState } from "react";
import { TextField, TextAreaField } from "@/components/admin/FormFields";
import ImageListEditor from "@/components/admin/ImageListEditor";
import type { RoomDTO } from "./types";

export interface RoomPayload {
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  images: string[];
  capacity?: number;
}

interface Props {
  room: RoomDTO | null; // null = creating a new room
  saving: boolean;
  error: string;
  onSubmit: (payload: RoomPayload) => void;
  onCancel: () => void;
}

type TextKey = "name" | "description" | "price" | "discountPercent" | "capacity";

export default function RoomForm({ room, saving, error, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: room?.name ?? "",
    description: room?.description ?? "",
    price: room ? String(room.price) : "",
    discountPercent: room ? String(room.discountPercent) : "0",
    capacity: room?.capacity !== undefined ? String(room.capacity) : "",
    images: room?.images ?? [],
  });

  const setField = (field: TextKey, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPercent: Number(form.discountPercent || 0),
      images: form.images,
      ...(form.capacity ? { capacity: Number(form.capacity) } : {}),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        {room ? "Edit room" : "Add room"}
      </h2>

      {error && (
        <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="room-name"
          label="Name"
          required
          className="sm:col-span-2"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <TextAreaField
          id="room-description"
          label="Description"
          rows={3}
          className="sm:col-span-2"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
        <TextField
          id="room-price"
          label="Price per night"
          type="number"
          min="0"
          step="0.01"
          required
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
        />
        <TextField
          id="room-discount"
          label="Discount (%)"
          type="number"
          min="0"
          max="100"
          value={form.discountPercent}
          onChange={(e) => setField("discountPercent", e.target.value)}
        />
        <TextField
          id="room-capacity"
          label="Capacity (guests)"
          type="number"
          min="1"
          value={form.capacity}
          onChange={(e) => setField("capacity", e.target.value)}
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
          {saving ? "Saving..." : "Save room"}
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