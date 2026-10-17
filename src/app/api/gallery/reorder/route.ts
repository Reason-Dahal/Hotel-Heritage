import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { galleryReorderSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const parsed = galleryReorderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { orderedIds } = parsed.data;
    if (new Set(orderedIds).size !== orderedIds.length) {
      return NextResponse.json(
        { success: false, error: "The list contains duplicates" },
        { status: 400 }
      );
    }

    await GalleryImage.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { $set: { sortOrder: index } } },
      }))
    );

    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder photos" },
      { status: 500 }
    );
  }
}