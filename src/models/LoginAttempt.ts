import { Schema, models, model } from "mongoose";

export const LOGIN_WINDOW_SECONDS = 15 * 60;

export interface ILoginAttempt {
  ip: string;
  email: string;
  createdAt: Date;
}

const LoginAttemptSchema = new Schema<ILoginAttempt>({
  ip: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  // MongoDB deletes each record by itself once the window has passed
  createdAt: { type: Date, default: Date.now, expires: LOGIN_WINDOW_SECONDS },
});

const LoginAttempt =
  models.LoginAttempt || model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);

export default LoginAttempt;