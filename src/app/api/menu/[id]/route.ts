import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import { menuItemInputSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const parsed = menuItemInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const item = await MenuItem.findByIdAndUpdate(id, parsed.data, { new: true });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

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
  try {
    await connectDB();
    const { id } = await params;
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}