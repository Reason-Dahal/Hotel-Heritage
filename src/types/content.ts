export interface RoomDTO {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  discountPercent: number;
  capacity?: number;
  featured: boolean;
}

export interface MenuItemDTO {
  _id: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string; // empty string = no category
  category: string; // the category's name, for display
  price: number;
  discountPercent: number;
  featured: boolean;
}

export interface CategoryDTO {
  _id: string;
  name: string;
  sortOrder: number;
  itemCount?: number; // only filled in for the admin page
}

export interface PublicNotice {
  _id: string;
  title: string;
  message: string;
  image: string;
  key: string; // changes whenever the notice is edited, so edited notices show again
}

export interface BookingInfo {
  whatsappNumber: string;
  hotelName: string;
}