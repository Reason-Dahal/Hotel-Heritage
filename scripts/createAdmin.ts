import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  },
  { timestamps: true }
);

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/createAdmin.ts <email> <password>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI as string);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.hashedPassword = hashedPassword;
    await existing.save();
    console.log(`Updated password for existing admin: ${email}`);
  } else {
    await Admin.create({ email, hashedPassword });
    console.log(`Created new admin: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});