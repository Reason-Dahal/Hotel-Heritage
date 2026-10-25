import GallerySlider from "./GallerySlider";
import type { GalleryImageDTO } from "@/types/content";

interface Props {
  images: GalleryImageDTO[];
  hotelName: string;
}

export default function GallerySection({ images, hotelName }: Props) {
  if (images.length === 0) return null;

  return (
    <section
      aria-labelledby="gallery-heading"
      className="mx-auto max-w-6xl px-4 py-12"
    >
      <h2
        id="gallery-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        Gallery
      </h2>
      <div className="mt-6">
        <GallerySlider
          images={images}
          label="Photo gallery"
          hotelName={hotelName}
        />
      </div>
    </section>
  );
}