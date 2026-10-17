import { whatsappHref } from "@/lib/contact";

const MAX_NAME_LENGTH = 100;

// The pre-written message. To change the wording, edit the sentence below.
export function bookingMessage(hotelName: string, roomName: string): string {
  const room = roomName.trim().slice(0, MAX_NAME_LENGTH);
  return `Hello ${hotelName}, I would like to book the ${room}. Is it available? Please share the details.`;
}

export function bookingHref(
  whatsappNumber: string,
  hotelName: string,
  roomName: string
): string {
  return whatsappHref(whatsappNumber, bookingMessage(hotelName, roomName));
}