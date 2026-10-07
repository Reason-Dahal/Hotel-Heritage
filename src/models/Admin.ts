import { Schema, models, model } from "mongoose";

export interface IAdmin {
  email: string;
  hashedPassword: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);

export default Admin;