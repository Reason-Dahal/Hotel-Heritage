export interface SiteSettingsDTO {
  hotelName: string;
  tagline: string;
  description: string;
  currency: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string; // digits only, with country code
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  mapEmbedUrl: string;
  heroImage: string;
  heroImageAlt: string;
  heroSubtitle: string;
  bannerMessages: string[];
  tickerMessages: string[];
}

// Used until the admin saves settings for the first time
export const DEFAULT_SETTINGS: SiteSettingsDTO = {
  hotelName: "Hotel Heritage",
  tagline: "",
  description: "",
  currency: "NPR",
  address: "",
  phone: "",
  email: "",
  whatsappNumber: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  mapEmbedUrl: "",
  heroImage: "",
  heroImageAlt: "",
  heroSubtitle: "",
  bannerMessages: [],
  tickerMessages: [],
};

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "NPR", label: "Nepalese rupee (NPR)" },
  { value: "INR", label: "Indian rupee (INR)" },
  { value: "USD", label: "US dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British pound (GBP)" },
  { value: "AUD", label: "Australian dollar (AUD)" },
];