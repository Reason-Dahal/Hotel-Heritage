"use client";

import { useAdminCrud } from "@/hooks/useAdminCrud";
import ImageUploader from "@/components/ImageUploader";
import { MAX_GALLERY_IMAGES } from "@/lib/gallery";
import type { GalleryImageDTO } from "@/types/content";
import GalleryItem from "./GalleryItem";

export default function GalleryManager({ images }: { images: GalleryImageDTO[] }) {
  const { saving, deletingId, error, save, remove, action } =
    useAdminCrud("/api/gallery");
  const busy = saving || deletingId !== null;
  const full = images.length >= MAX_GALLERY_IMAGES;
  const missing = images.filter((image) => !image.alt).length;

  const handleUploaded = async (url: string) => {
    // Throwing tells the uploader this photo failed, so it is listed in its message
    if (!(await save(null, { url }))) throw new Error("could not be added to the gallery");
  };

  const handleMove = async (index: number, delta: -1 | 1) => {
    const ids = images.map((image) => image._id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await action("/reorder", { orderedIds: ids });
  };

  const handleDelete = async (image: GalleryImageDTO, position: number) => {
    if (!window.confirm(`Remove photo ${position} from the gallery?`)) return;
    await remove(image._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
      <p className="mt-1 text-gray-600">
        Photos shown in the slideshow at the bottom of your homepage. You can
        select several photos at once.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Add photos ({images.length} of {MAX_GALLERY_IMAGES})
        </p>
        {full ? (
          <p className="text-sm text-gray-600">
            The gallery is full. Remove a photo to add another.
          </p>
        ) : (
          <ImageUploader multiple onUploaded={handleUploaded} />
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {missing > 0 && (
        <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-800">
          {missing} {missing === 1 ? "photo has" : "photos have"} no description.
          The description is shown as a caption on the photo, and also helps people using screen readers and Google image search.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        {images.length === 0 ? (
          <p className="p-6 text-sm text-gray-600">
            No photos yet. Add some above and they will appear on your homepage.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {images.map((image, index) => (
              <GalleryItem
                key={image._id}
                image={image}
                position={index + 1}
                isFirst={index === 0}
                isLast={index === images.length - 1}
                busy={busy}
                deleting={deletingId === image._id}
                onMove={(delta) => handleMove(index, delta)}
                onSaveAlt={(alt) => save(image._id, { alt })}
                onDelete={() => handleDelete(image, index + 1)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}