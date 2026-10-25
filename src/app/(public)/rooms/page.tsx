import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { getAllRooms } from "@/lib/content";
import { telHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { roomsJsonLd } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/public/PageHeader";
import RoomsBrowser from "@/components/public/RoomsBrowser";
import { COPY } from "@/lib/copy";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata(settings, {
    title: "Rooms",
    description: `Explore the rooms at ${settings.hotelName}: photos, capacity, and nightly prices.`,
    path: "/rooms",
  });
}

export default async function RoomsPage() {
  const [settings, rooms] = await Promise.all([getSiteSettings(), getAllRooms()]);
  const { phone, email } = settings;

  return (
    <>
      {rooms.length > 0 && (
        <JsonLd data={roomsJsonLd(rooms, settings.currency)} />
      )}

      <PageHeader
        title="Our Rooms"
        intro={COPY.rooms}

      />

      {rooms.length === 0 ? (
        <p className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-600">
          Our rooms are coming soon. Please check back shortly.
        </p>
      ) : (
        <>
          <RoomsBrowser
            rooms={rooms}
            currency={settings.currency}
            booking={{
              whatsappNumber: settings.whatsappNumber,
              hotelName: settings.hotelName,
            }}
          />

          {(phone || email) && (
            <section
              aria-labelledby="booking-heading"
              className="mx-auto mb-12 max-w-6xl px-4"
            >
              <div className="rounded-lg border border-brand-100 bg-brand-50 p-6 text-center">
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
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}