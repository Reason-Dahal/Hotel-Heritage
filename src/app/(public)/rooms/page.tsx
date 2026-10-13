import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getAllRooms } from "@/lib/content";
import { telHref } from "@/lib/contact";
import PageHeader from "@/components/public/PageHeader";
import RoomCard from "@/components/public/RoomCard";

export const revalidate = 3600;

const GRID_SIZES = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw";

export async function generateMetadata(): Promise<Metadata> {
  const { hotelName } = await getSiteSettings();
  return {
    title: "Rooms",
    description: `Explore the rooms at ${hotelName}: photos, capacity, and nightly prices.`,
    alternates: { canonical: "/rooms" },
  };
}

export default async function RoomsPage() {
  const [settings, rooms] = await Promise.all([getSiteSettings(), getAllRooms()]);
  const { phone, email } = settings;

  return (
    <>
      <PageHeader
        title="Our rooms"
        intro="Comfortable stays with clear pricing. All prices are per night."
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {rooms.length === 0 ? (
          <p className="py-10 text-center text-gray-600">
            Our rooms are coming soon. Please check back shortly.
          </p>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <li key={room._id}>
                  <RoomCard
                    room={room}
                    currency={settings.currency}
                    sizes={GRID_SIZES}
                    expanded
                  />
                </li>
              ))}
            </ul>

            {(phone || email) && (
              <section
                aria-labelledby="booking-heading"
                className="mt-14 rounded-lg border border-brand-100 bg-brand-50 p-6 text-center"
              >
                <h2 id="booking-heading" className="text-xl font-bold text-gray-900">
                  Ready to book?
                </h2>
                <p className="mt-2 text-gray-700">
                  Contact us to check availability and reserve your stay.
                </p>
                <p className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-semibold text-brand-800">
                  {phone && (
                    <a href={telHref(phone)} className="hover:underline">
                      Call {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="hover:underline">
                      Email {email}
                    </a>
                  )}
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}