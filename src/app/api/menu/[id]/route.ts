import { NextResponse, after } from "next/server";
import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";
import { menuItemInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { isObjectId } from "@/lib/objectId";
import { deleteCloudinaryImages, removedUrls } from "@/lib/cloudinaryCleanup";

const INVALID_ID = { success: false, error: "Invalid menu item id" };
const NOT_FOUND = { success: false, error: "Menu item not found" };

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

    const parsed = menuItemInputSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { categoryId } = parsed.data;
    if (categoryId && !(await Category.exists({ _id: categoryId }))) {
      return NextResponse.json(
        { success: false, error: { categoryId: ["That category no longer exists"] } },
        { status: 400 }
      );
    }

    const before = await MenuItem.findById(id).select("images").lean();
    if (!before) return NextResponse.json(NOT_FOUND, { status: 404 });

    const item = await MenuItem.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!item) return NextResponse.json(NOT_FOUND, { status: 404 });

    const gone = removedUrls(before.images, item.images);
    if (gone.length > 0) after(() => deleteCloudinaryImages(gone));

    revalidatePublicSite();
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
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

    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) return NextResponse.json(NOT_FOUND, { status: 404 });

    const gone: string[] = item.images ?? [];
    if (gone.length > 0) after(() => deleteCloudinaryImages(gone));

    revalidatePublicSite();
    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}