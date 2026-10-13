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
    category: string;
    price: number;
    discountPercent: number;
    featured: boolean;
  }

  export interface PublicNotice {
    _id: string;
    title: string;
    message: string;
    image: string;
    key: string; // changes whenever the notice is edited, so edited notices show again
  }