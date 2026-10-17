import { bookingHref } from "@/lib/booking";

interface Props {
  whatsappNumber: string;
  hotelName: string;
  roomName: string;
}

export default function BookNowButton({ whatsappNumber, hotelName, roomName }: Props) {
  return (
    <a
      href={bookingHref(whatsappNumber, hotelName, roomName)}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded border border-brand-700 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:mt-3 sm:py-2 sm:text-sm"
    >
      Book now
      <span className="sr-only">: {roomName} on WhatsApp (opens in a new tab)</span>
    </a>
  );
}