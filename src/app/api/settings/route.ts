import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getSiteSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/requireAdmin";
import { siteSettingsInputSchema } from "@/lib/validation";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const body = await request.json();

    const parsed = siteSettingsInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { $set: parsed.data },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // Make the public site pick up the change immediately
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}