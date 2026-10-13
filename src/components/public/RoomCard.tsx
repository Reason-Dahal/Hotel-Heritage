import Image from "next/image";
import Price from "./Price";
import type { RoomDTO } from "@/types/content";

interface Props {
  room: RoomDTO;
  currency: string;
  sizes?: string;
  expanded?: boolean;
}

export default function RoomCard({
  room,
  currency,
  sizes = "(min-width: 640px) 320px, 288px",
  expanded = false,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] bg-gray-100">
        {room.images[0] ? (
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
        {room.capacity && (
          <p className="mt-1 text-sm text-gray-500">Sleeps {room.capacity}</p>
        )}
        {room.description && (
          <p
            className={`mt-1 text-sm text-gray-600 ${expanded ? "" : "line-clamp-2"}`}
          >
            {room.description}
          </p>
        )}
        <div className="mt-auto pt-3">
          <Price
            price={room.price}
            discountPercent={room.discountPercent}
            currency={currency}
            unit="per night"
          />
        </div>
      </div>
    </article>
  );
}