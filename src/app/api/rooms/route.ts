import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";

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