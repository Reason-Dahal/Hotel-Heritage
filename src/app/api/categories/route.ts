import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { categoryInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { categoryNameTaken, isDuplicateKeyError } from "@/lib/categories";
import { getMenuCategories } from "@/lib/content";

const NAME_TAKEN = {
  success: false,
  error: "A category with that name already exists.",
};

export async function GET() {
  try {
    const categories = await getMenuCategories();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const parsed = categoryInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name } = parsed.data;
    if (await categoryNameTaken(name)) {
      return NextResponse.json(NAME_TAKEN, { status: 409 });
    }

    // New categories go to the end of the list
    const last = await Category.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
    const category = await Category.create({
      name,
      sortOrder: last ? (last.sortOrder ?? 0) + 1 : 0,
    });

    revalidatePublicSite();
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(NAME_TAKEN, { status: 409 });
    }
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}