import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        await connectDB();
        const admin = await Admin.findOne({ email });
        if (!admin) return null;

        const isValid = await bcrypt.compare(password, admin.hashedPassword);
        if (!isValid) return null;

        return { id: admin._id.toString(), email: admin.email };
      },
    }),
  ],
});