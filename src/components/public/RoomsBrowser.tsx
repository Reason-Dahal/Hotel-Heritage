"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { RoomDTO, BookingInfo } from "@/types/content";
import { matchesQuery } from "@/lib/search";
import RoomCard from "./RoomCard";
import SearchBox from "./SearchBox";

const GRID_SIZES = "(min-width: 1024px) 384px, 50vw";

interface Props {
  rooms: RoomDTO[];
  currency: string;
  booking?: BookingInfo;
}

export default function RoomsBrowser({ rooms, currency, booking }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searching = deferredQuery.trim() !== "";

  const visible = useMemo(
    () => rooms.filter((room) => matchesQuery(deferredQuery, room.name, room.description)),
    [rooms, deferredQuery]
  );

  return (
    <div>
      <div className="sticky top-0 z-30  backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <SearchBox
            id="rooms-search"
            label="Search rooms"
            placeholder="Search rooms"
            value={query}
            onChange={setQuery}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <p role="status" className="mb-3 min-h-5 text-sm text-gray-600">
          {searching
            ? `${visible.length} ${visible.length === 1 ? "room" : "rooms"} found`
            : ""}
        </p>

        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-700">No rooms match &ldquo;{deferredQuery}&rdquo;.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {visible.map((room) => (
              <li key={room._id} className="min-w-0">
                <RoomCard
                  room={room}
                  currency={currency}
                  sizes={GRID_SIZES}
                  expanded
                  compact
                  booking={booking}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}