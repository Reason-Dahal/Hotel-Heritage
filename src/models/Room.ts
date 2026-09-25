import { Schema, models, model } from "mongoose";

export interface IRoom {
  name: string;
  description?: string;
  images: string[];
  price: number;
  discountPercent: number;
  capacity?: number;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    capacity: { type: Number },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

// Prevents Next.js hot reload from redefining the model and crashing
const Room = models.Room || model<IRoom>("Room", RoomSchema);

export default Room;