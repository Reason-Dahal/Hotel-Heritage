import { Schema, models, model } from "mongoose";

export interface IGalleryImage {
  url: string;
  alt: string;
  sortOrder: number;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "", maxlength: 160 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryImage =
  models.GalleryImage || model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;