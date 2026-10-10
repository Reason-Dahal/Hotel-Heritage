import { getSiteSettings } from "@/lib/settings";
import Hero from "@/components/public/Hero";
import MessageBanner from "@/components/public/MessageBanner";
import MapSection from "@/components/public/MapSection";

// Refreshes instantly when settings are saved, and at least hourly otherwise
export const revalidate = 3600;

export default async function HomePage() {
  const settings = await getSiteSettings();

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

      {/* 3.11b: signature dish and featured room slideshows go here */}

      <MapSection
        hotelName={settings.hotelName}
        address={settings.address}
        embedUrl={settings.mapEmbedUrl}
      />
    </>
  );
}