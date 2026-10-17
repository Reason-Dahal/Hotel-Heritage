import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { galleryUpdateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { isObjectId } from "@/lib/objectId";

const INVALID_ID = { success: false, error: "Invalid photo id" };
const NOT_FOUND = { success: false, error: "Photo not found" };

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json(INVALID_ID, { status: 400 });

    const parsed = galleryUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const image = await GalleryImage.findByIdAndUpdate(
      id,
      { alt: parsed.data.alt },
      { new: true }
    );
    if (!image) return NextResponse.json(NOT_FOUND, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json(INVALID_ID, { status: 400 });

    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) return NextResponse.json(NOT_FOUND, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true, message: "Photo removed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to remove photo" },
      { status: 500 }
    );
  }
}