import { absoluteUrl } from "@/lib/site";
import { discountedPrice } from "@/lib/price";
import type { MenuSection } from "@/lib/content";
import type { RoomDTO } from "@/types/content";
import type { SiteSettingsDTO } from "@/types/settings";

type Json = Record<string, unknown>;

// Drops empty values so the markup never contains blank fields
function clean(value: Json): Json {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => {
      if (v === undefined || v === null || v === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );
}

// The price a visitor actually pays today, after any discount
const currentPrice = (price: number, discountPercent: number) =>
  discountPercent > 0 ? discountedPrice(price, discountPercent) : price;

export function hotelJsonLd(settings: SiteSettingsDTO): Json {
  const sameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.tiktokUrl,
    settings.youtubeUrl,
  ].filter(Boolean);

  return clean({
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: settings.hotelName,
    url: absoluteUrl("/"),
    description: settings.description,
    image: settings.heroImage ? [settings.heroImage] : [],
    telephone: settings.phone,
    email: settings.email,
    address: settings.address
      ? { "@type": "PostalAddress", streetAddress: settings.address }
      : undefined,
    sameAs,
  });
}

export function roomsJsonLd(rooms: RoomDTO[], currency: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rooms.map((room, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: clean({
        "@type": "HotelRoom",
        name: room.name,
        description: room.description,
        image: room.images[0],
        occupancy: room.capacity
          ? { "@type": "QuantitativeValue", maxValue: room.capacity }
          : undefined,
        offers: {
          "@type": "Offer",
          price: currentPrice(room.price, room.discountPercent),
          priceCurrency: currency,
        },
      }),
    })),
  };
}

export function menuJsonLd(
  name: string,
  sections: MenuSection[],
  currency: string
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name,
    hasMenuSection: sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      hasMenuItem: section.items.map((item) =>
        clean({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          image: item.images[0],
          offers: {
            "@type": "Offer",
            price: currentPrice(item.price, item.discountPercent),
            priceCurrency: currency,
          },
        })
      ),
    })),
  };
}