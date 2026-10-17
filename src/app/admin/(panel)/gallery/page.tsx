import { getGalleryImages } from "@/lib/content";
import GalleryManager from "../../../../components/admin/gallery/GalleryManager";


export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  return <GalleryManager images={images} />;
}