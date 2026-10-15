import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { categoryInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { categoryNameTaken, isDuplicateKeyError } from "@/lib/categories";
import { isObjectId } from "@/lib/objectId";

const NAME_TAKEN = {
  success: false,
  error: "A category with that name already exists.",
};
const INVALID_ID = { success: false, error: "Invalid category id" };
const NOT_FOUND = { success: false, error: "Category not found" };

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

    const parsed = categoryInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (await categoryNameTaken(parsed.data.name, id)) {
      return NextResponse.json(NAME_TAKEN, { status: 409 });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name: parsed.data.name },
      { new: true }
    );
    if (!category) return NextResponse.json(NOT_FOUND, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true, category });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(NAME_TAKEN, { status: 409 });
    }
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
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

    const inUse = await MenuItem.countDocuments({ categoryId: id });
    if (inUse > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `${inUse} menu ${inUse === 1 ? "item uses" : "items use"} this category. Move ${inUse === 1 ? "it" : "them"} to another category first.`,
        },
        { status: 409 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json(NOT_FOUND, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}