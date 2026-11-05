import { NextResponse, after } from "next/server";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getSiteSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePublicSite } from "@/lib/revalidate";
import { siteSettingsInputSchema } from "@/lib/validation";
import { deleteCloudinaryImages } from "@/lib/cloudinaryCleanup";

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
    const parsed = siteSettingsInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const before = await SiteSettings.findOne({ key: "main" })
      .select("heroImage")
      .lean();

    await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { $set: parsed.data },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // A replaced or removed hero photo is deleted after the response
    const oldHero: string = before?.heroImage ?? "";
    if (
      oldHero &&
      parsed.data.heroImage !== undefined &&
      parsed.data.heroImage !== oldHero
    ) {
      after(() => deleteCloudinaryImages([oldHero]));
    }

    // Make the public site pick up the change immediately
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}