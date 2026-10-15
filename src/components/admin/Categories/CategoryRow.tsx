"use client";

import { useState } from "react";
import type { CategoryDTO } from "@/types/content";

interface Props {
  category: CategoryDTO;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  deleting: boolean;
  onMove: (delta: -1 | 1) => void;
  onRename: (name: string) => Promise<boolean>;
  onDelete: () => void;
}

const smallButton =
  "rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-40";

export default function CategoryRow({
  category,
  isFirst,
  isLast,
  busy,
  deleting,
  onMove,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(category.name);
  const count = category.itemCount ?? 0;

  const submitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await onRename(draft)) setEditing(false);
  };

  if (editing) {
    return (
      <li className="p-3">
        <form onSubmit={submitRename} className="flex flex-wrap gap-2">
          <input
            aria-label={`New name for ${category.name}`}
            value={draft}
            maxLength={60}
            required
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 rounded border border-gray-300 p-2"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-800">{category.name}</p>
        <p className="text-xs text-gray-500">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Move ${category.name} up`}
          disabled={busy || isFirst}
          onClick={() => onMove(-1)}
          className={smallButton}
        >
          &uarr;
        </button>
        <button
          type="button"
          aria-label={`Move ${category.name} down`}
          disabled={busy || isLast}
          onClick={() => onMove(1)}
          className={smallButton}
        >
          &darr;
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(category.name);
            setEditing(true);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting || count > 0}
          title={count > 0 ? "Move this category's items elsewhere first" : undefined}
          className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}