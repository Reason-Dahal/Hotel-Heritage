import { getSiteSettings } from "@/lib/settings";
import { getFeaturedMenuItems, getFeaturedRooms } from "@/lib/content";
import Hero from "@/components/public/Hero";
import MessageBanner from "@/components/public/MessageBanner";
import FeaturedSection from "@/components/public/FeaturedSection";
import Carousel from "@/components/public/Carousel";
import DishCard from "@/components/public/DishCard";
import RoomCard from "@/components/public/RoomCard";
import MapSection from "@/components/public/MapSection";

// Refreshes instantly when content is edited, and at least hourly otherwise
export const revalidate = 3600;

const slideClass = "w-72 shrink-0 snap-start sm:w-80";

export default async function HomePage() {
  const [settings, dishes, rooms] = await Promise.all([
    getSiteSettings(),
    getFeaturedMenuItems(),
    getFeaturedRooms(),
  ]);

  return (
    <>
      <Hero
        hotelName={settings.hotelName}
        tagline={settings.tagline}
        image={settings.heroImage}
      />

      {settings.bannerMessages.length > 0 && (
        <MessageBanner messages={settings.bannerMessages} />
      )}

      {dishes.length > 0 && (
        <FeaturedSection
          id="signature-dishes"
          title="Our signature dishes"
          seeAllHref="/menu"
          seeAllLabel="See full menu"
        >
          <Carousel label="signature dishes">
            {dishes.map((item) => (
              <li key={item._id} className={slideClass}>
                <DishCard item={item} currency={settings.currency} />
              </li>
            ))}
          </Carousel>
        </FeaturedSection>
      )}

      {rooms.length > 0 && (
        <FeaturedSection
          id="featured-rooms"
          title="Featured rooms"
          seeAllHref="/rooms"
          seeAllLabel="See all rooms"
        >
          <Carousel label="featured rooms">
            {rooms.map((room) => (
              <li key={room._id} className={slideClass}>
                <RoomCard room={room} currency={settings.currency} />
              </li>
            ))}
          </Carousel>
        </FeaturedSection>
      )}

      <MapSection
        hotelName={settings.hotelName}
        address={settings.address}
        embedUrl={settings.mapEmbedUrl}
      />
    </>
  );
}