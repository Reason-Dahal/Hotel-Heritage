import { Schema, models, model, type Types } from "mongoose";
import "@/models/Category"; // makes sure the Category model is registered for populate

export interface IMenuItem {
  name: string;
  description?: string;
  images: string[];
  categoryId?: Types.ObjectId | null;
  price: number;
  discountPercent: number;
  featured: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem = models.MenuItem || model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;