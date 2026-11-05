import { NextResponse, after } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import { roomInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { isObjectId } from "@/lib/objectId";
import { deleteCloudinaryImages, removedUrls } from "@/lib/cloudinaryCleanup";

const INVALID_ID = { success: false, error: "Invalid room id" };
const NOT_FOUND = { success: false, error: "Room not found" };

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

    const parsed = roomInputSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const before = await Room.findById(id).select("images").lean();
    if (!before) return NextResponse.json(NOT_FOUND, { status: 404 });

    const room = await Room.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!room) return NextResponse.json(NOT_FOUND, { status: 404 });

    // Photos the admin removed from this room are deleted after the response
    const gone = removedUrls(before.images, room.images);
    if (gone.length > 0) after(() => deleteCloudinaryImages(gone));

    revalidatePublicSite();
    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update room" },
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

    const room = await Room.findByIdAndDelete(id);
    if (!room) return NextResponse.json(NOT_FOUND, { status: 404 });

    const gone: string[] = room.images ?? [];
    if (gone.length > 0) after(() => deleteCloudinaryImages(gone));

    revalidatePublicSite();
    return NextResponse.json({ success: true, message: "Room deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete room" },
      { status: 500 }
    );
  }
}