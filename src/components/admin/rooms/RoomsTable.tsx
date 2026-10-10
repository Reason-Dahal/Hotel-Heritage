import Image from "next/image";
import PriceDisplay from "@/components/admin/PriceDisplay";
import type { RoomDTO } from "./types";

interface Props {
  rooms: RoomDTO[];
  deletingId: string | null;
  onEdit: (room: RoomDTO) => void;
  onDelete: (room: RoomDTO) => void;
}

export default function RoomsTable({ rooms, deletingId, onEdit, onDelete }: Props) {
  if (rooms.length === 0) {
    return (
      <p className="p-6 text-sm text-gray-600">
        No rooms yet. Click &quot;Add room&quot; to create the first one.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
        <tr>
          <th className="p-3">Photo</th>
          <th className="p-3">Name</th>
          <th className="p-3">Price</th>
          <th className="p-3">Capacity</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room._id} className="border-b border-gray-100 last:border-0">
            <td className="p-3">
              {room.images[0] ? (
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  width={64}
                  height={48}
                  className="h-12 w-16 rounded object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No photo</span>
              )}
            </td>
            <td className="p-3 font-medium text-gray-800">
              {room.name}
              {room.featured && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-normal text-amber-700">
                  Featured
                </span>
              )}
            </td>
            <td className="p-3">
              <PriceDisplay price={room.price} discountPercent={room.discountPercent} />
            </td>
            <td className="p-3 text-gray-700">{room.capacity ?? "-"}</td>
            <td className="p-3">
              <button
                onClick={() => onEdit(room)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(room)}
                disabled={deletingId === room._id}
                className="text-red-600 hover:underline disabled:opacity-60"
              >
                {deletingId === room._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}