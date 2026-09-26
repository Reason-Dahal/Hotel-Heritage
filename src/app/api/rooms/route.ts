import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import { roomInputSchema } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({});
    return NextResponse.json({ success: true, count: rooms.length, rooms });
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

    const parsed = roomInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const room = await Room.create(parsed.data);
    return NextResponse.json({ success: true, room }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create room" },
      { status: 500 }
    );
  }
}