import { Schema, models, model } from "mongoose";

export interface INotice {
  title: string;
  message: string;
  image?: string;
  active: boolean;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notice = models.Notice || model<INotice>("Notice", NoticeSchema);

export default Notice;