import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notice from "@/models/Notice";
import { noticeInputSchema } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find({ active: true });
    return NextResponse.json({ success: true, count: notices.length, notices });
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

    const parsed = noticeInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const notice = await Notice.create(parsed.data);
    return NextResponse.json({ success: true, notice }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create notice" },
      { status: 500 }
    );
  }
}