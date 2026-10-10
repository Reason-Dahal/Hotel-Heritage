export interface SiteSettingsDTO {
    hotelName: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    youtubeUrl: string;
    whatsappUrl: string;
    mapEmbedUrl: string;
    heroImage: string;
    bannerMessages: string[];
    currency: string;
  }
  
  // Used until the admin saves settings for the first time
  export const DEFAULT_SETTINGS: SiteSettingsDTO = {
    hotelName: "Hotel Heritage",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    whatsappUrl: "",
    mapEmbedUrl: "",
    heroImage: "",
    bannerMessages: [],
    currency: "NPR",
  };

  export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
    { value: "NPR", label: "Nepalese rupee (NPR)" },
    { value: "INR", label: "Indian rupee (INR)" },
    { value: "USD", label: "US dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British pound (GBP)" },
    { value: "AUD", label: "Australian dollar (AUD)" },
  ];