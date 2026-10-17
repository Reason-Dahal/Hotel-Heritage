import Image from "next/image";
import Price from "./Price";
import BookNowButton from "./BookNowButton";
import type { RoomDTO, BookingInfo } from "@/types/content";

interface Props {
  room: RoomDTO;
  currency: string;
  sizes?: string;
  expanded?: boolean; // show the full description (on tablets and up when compact)
  compact?: boolean; // smaller layout on phones
  booking?: BookingInfo; // when it has a WhatsApp number, a Book now button shows
}

export default function RoomCard({
  room,
  currency,
  sizes = "(min-width: 640px) 320px, 288px",
  expanded = false,
  compact = false,
  booking,
}: Props) {
  const clamp = expanded
    ? compact
      ? "line-clamp-2 sm:line-clamp-none"
      : ""
    : "line-clamp-2";

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

      <div className={`flex flex-1 flex-col ${compact ? "p-2.5 sm:p-4" : "p-4"}`}>
        <h3
          className={`break-words font-semibold text-gray-900 ${
            compact
              ? "line-clamp-2 text-sm leading-snug sm:line-clamp-none sm:text-lg"
              : "text-lg"
          }`}
        >
          {room.name}
        </h3>
        {room.capacity && (
          <p
            className={`mt-0.5 text-gray-500 sm:mt-1 ${
              compact ? "text-xs sm:text-sm" : "text-sm"
            }`}
          >
            Sleeps {room.capacity}
          </p>
        )}
        {room.description && (
          <p
            className={`mt-1 break-words text-gray-600 ${
              compact ? "text-xs sm:text-sm" : "text-sm"
            } ${clamp}`}
          >
            {room.description}
          </p>
        )}
        <div className={`mt-auto ${compact ? "pt-2 sm:pt-3" : "pt-3"}`}>
          <Price
            price={room.price}
            discountPercent={room.discountPercent}
            currency={currency}
            unit="per night"
            compact={compact}
          />
          {booking?.whatsappNumber && (
            <BookNowButton
              whatsappNumber={booking.whatsappNumber}
              hotelName={booking.hotelName}
              roomName={room.name}
            />
          )}
        </div>
      </div>
    </article>
  );
}