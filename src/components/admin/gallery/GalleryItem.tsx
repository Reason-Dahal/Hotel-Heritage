"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImageDTO } from "@/types/content";

interface Props {
  image: GalleryImageDTO;
  position: number;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  deleting: boolean;
  onMove: (delta: -1 | 1) => void;
  onSaveAlt: (alt: string) => Promise<boolean>;
  onDelete: () => void;
}

const smallButton =
  "rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-40";

export default function GalleryItem({
  image,
  position,
  isFirst,
  isLast,
  busy,
  deleting,
  onMove,
  onSaveAlt,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState(image.alt);
  const changed = draft.trim() !== image.alt;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await onSaveAlt(draft)) setDraft(draft.trim());
  };

  return (
    <li className="flex flex-wrap items-start gap-3 p-3">
      <Image
        src={image.url}
        alt={image.alt || `Gallery photo ${position}`}
        width={96}
        height={72}
        className="h-[72px] w-24 shrink-0 rounded object-cover"
      />

      <form onSubmit={handleSave} className="min-w-0 flex-1 basis-56">
        <label
          htmlFor={`alt-${image._id}`}
          className="block text-xs font-medium text-gray-600"
        >
            Photo {position} description (shown on the photo)
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id={`alt-${image._id}`}
            value={draft}
            maxLength={160}
            placeholder="e.g. Poolside view at sunset"
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 rounded border border-gray-300 p-2 text-sm"
          />
          {changed && (
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Save
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Move photo ${position} up`}
          disabled={busy || isFirst}
          onClick={() => onMove(-1)}
          className={smallButton}
        >
          &uarr;
        </button>
        <button
          type="button"
          aria-label={`Move photo ${position} down`}
          disabled={busy || isLast}
          onClick={() => onMove(1)}
          className={smallButton}
        >
          &darr;
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:underline disabled:opacity-60"
        >
          {deleting ? "Removing..." : "Remove"}
        </button>
      </div>
    </li>
  );
}