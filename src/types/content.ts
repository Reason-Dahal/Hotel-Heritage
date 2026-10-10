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