import { Schema, models, model } from "mongoose";

export interface ICategory {
  name: string;
  sortOrder: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Names are unique regardless of capital letters ("Starter" and "starter" clash)
CategorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;