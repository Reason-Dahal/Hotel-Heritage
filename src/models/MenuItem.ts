import { Schema, models, model } from "mongoose";

export interface IMenuItem {
  name: string;
  description?: string;
  images: string[];
  category?: string;
  price: number;
  discountPercent: number;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    category: { type: String },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

const MenuItem = models.MenuItem || model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;