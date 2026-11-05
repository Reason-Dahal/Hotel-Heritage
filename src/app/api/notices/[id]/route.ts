import { NextResponse, after } from "next/server";
import connectDB from "@/lib/db";
import Notice from "@/models/Notice";
import { noticeInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { isObjectId } from "@/lib/objectId";
import { deleteCloudinaryImages } from "@/lib/cloudinaryCleanup";

const INVALID_ID = { success: false, error: "Invalid notice id" };
const NOT_FOUND = { success: false, error: "Notice not found" };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;
    if (!isObjectId(id)) return NextResponse.json(INVALID_ID, { status: 400 });

    const parsed = noticeInputSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const before = await Notice.findById(id).select("image").lean();
    if (!before) return NextResponse.json(NOT_FOUND, { status: 404 });

    const notice = await Notice.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!notice) return NextResponse.json(NOT_FOUND, { status: 404 });

    // A replaced or removed notice photo is deleted after the response
    if (before.image && before.image !== notice.image) {
      const oldImage: string = before.image;
      after(() => deleteCloudinaryImages([oldImage]));
    }

    revalidatePublicSite();
    return NextResponse.json({ success: true, notice });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update notice" },
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

    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) return NextResponse.json(NOT_FOUND, { status: 404 });

    if (notice.image) {
      const oldImage: string = notice.image;
      after(() => deleteCloudinaryImages([oldImage]));
    }

    revalidatePublicSite();
    return NextResponse.json({ success: true, message: "Notice deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}