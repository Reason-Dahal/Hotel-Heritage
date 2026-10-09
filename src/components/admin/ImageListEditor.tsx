"use client";

import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

interface Props {
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
}

export default function ImageListEditor({ images, onAdd, onRemove }: Props) {
  return (
    <div>
      <p className="mb-1 block text-sm font-medium text-gray-700">Images</p>
      {images.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <li key={url} className="w-28">
              <Image
                src={url}
                alt="Uploaded photo preview"
                width={112}
                height={80}
                className="h-20 w-28 rounded object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="mt-1 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <ImageUploader onUploaded={onAdd} />
    </div>
  );
}