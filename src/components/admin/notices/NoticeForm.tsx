"use client";

import { useState } from "react";
import {
  TextField,
  TextAreaField,
  CheckboxField,
} from "@/components/admin/FormFields";
import ImageListEditor from "@/components/admin/ImageListEditor";
import type { NoticeDTO } from "./types";

export interface NoticePayload {
  title: string;
  message: string;
  image: string;
  active: boolean;
}

interface Props {
  notice: NoticeDTO | null; // null = creating a new notice
  saving: boolean;
  error: string;
  onSubmit: (payload: NoticePayload) => void;
  onCancel: () => void;
}

export default function NoticeForm({ notice, saving, error, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    title: notice?.title ?? "",
    message: notice?.message ?? "",
    image: notice?.image ?? "",
    active: notice?.active ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      image: form.image,
      active: form.active,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        {notice ? "Edit notice" : "Add notice"}
      </h2>

      {error && (
        <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        <TextField
          id="notice-title"
          label="Title"
          required
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <TextAreaField
          id="notice-message"
          label="Message"
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        />
        <CheckboxField
          id="notice-active"
          label="Show on website"
          hint="Active notices appear as a popup when visitors open the site."
          checked={form.active}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, active: e.target.checked }))
          }
        />
      </div>

      <div className="mt-4">
        <ImageListEditor
          images={form.image ? [form.image] : []}
          onAdd={(url) => setForm((prev) => ({ ...prev, image: url }))}
          onRemove={() => setForm((prev) => ({ ...prev, image: "" }))}
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional. A notice has one image, so uploading a new one replaces the current one.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save notice"}
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