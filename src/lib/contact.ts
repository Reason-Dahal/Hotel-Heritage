// Keep digits and a leading + only, so the tel: link always works
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;