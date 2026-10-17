import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { galleryImageInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { getGalleryImages } from "@/lib/content";
import { MAX_GALLERY_IMAGES } from "@/lib/gallery";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ success: true, count: images.length, images });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const parsed = galleryImageInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const count = await GalleryImage.countDocuments();
    if (count >= MAX_GALLERY_IMAGES) {
      return NextResponse.json(
        {
          success: false,
          error: `The gallery is full (${MAX_GALLERY_IMAGES} photos). Remove one to add another.`,
        },
        { status: 409 }
      );
    }

    // New photos go to the end of the gallery
    const last = await GalleryImage.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();
    const image = await GalleryImage.create({
      ...parsed.data,
      sortOrder: last ? (last.sortOrder ?? 0) + 1 : 0,
    });

    revalidatePublicSite();
    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to add photo" },
      { status: 500 }
    );
  }
}