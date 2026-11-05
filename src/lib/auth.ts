import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { authConfig } from "@/lib/auth.config";
import {
  clientIp,
  clearLoginFailures,
  isLoginBlocked,
  recordLoginFailure,
} from "@/lib/loginGuard";

// Comparing against this when the email is unknown keeps the response time the
// same, so timing cannot reveal which emails exist. Built once, on first use.
let dummyHash: string | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("not-a-real-password", 10));

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const rawEmail = credentials?.email;
        const password = credentials?.password;

        // Only plain text is accepted, never objects (guards against query injection)
        if (typeof rawEmail !== "string" || typeof password !== "string") return null;
        const emailInput = rawEmail.trim();
        if (!emailInput || !password || password.length > 200) return null;

        const guardEmail = emailInput.toLowerCase();
        const ip = clientIp(request);

        await connectDB();
        if (await isLoginBlocked(ip, guardEmail)) return null;

        const admin = await Admin.findOne({ email: emailInput });
        const isValid = await bcrypt.compare(
          password,
          admin?.hashedPassword ?? getDummyHash()
        );

        if (!admin || !isValid) {
          await recordLoginFailure(ip, guardEmail);
          return null;
        }

        await clearLoginFailures(ip, guardEmail);
        return { id: admin._id.toString(), email: admin.email };
      },
    }),
  ],
});