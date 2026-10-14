// Keep digits and a leading + only, so the tel: link always works
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

// number: digits only, with country code (as stored in Site Settings)
export const whatsappHref = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;