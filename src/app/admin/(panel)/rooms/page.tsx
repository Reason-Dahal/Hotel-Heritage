import connectDB from "@/lib/db";
import Room from "@/models/Room";
import RoomsManager from "@/components/admin/rooms/RoomsManager";
import type { RoomDTO } from "@/components/admin/rooms/types";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  await connectDB();
  const docs = await Room.find({}).sort({ createdAt: -1 }).lean();

  // Convert MongoDB documents into plain objects the client can receive
  const rooms: RoomDTO[] = docs.map((r) => ({
    _id: String(r._id),
    name: r.name,
    description: r.description ?? "",
    images: r.images ?? [],
    price: r.price,
    discountPercent: r.discountPercent ?? 0,
    capacity: r.capacity,
  }));

  return <RoomsManager rooms={rooms} />;
}