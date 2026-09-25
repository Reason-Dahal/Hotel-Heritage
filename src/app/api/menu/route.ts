import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MenuItem from "@/models/MenuItem";

export async function GET() {
  try {
    await connectDB();
    const items = await MenuItem.find({});
    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const item = await MenuItem.create(body);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}