import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

const FOLDER = "hotel-heritage";
const ALLOWED_FORMATS = "jpg,png,webp";
// Larger photos are scaled down on arrival, which also saves storage
const TRANSFORMATION = "c_limit,w_2400,h_2400";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const params = {
    timestamp: Math.round(Date.now() / 1000),
    folder: FOLDER,
    allowed_formats: ALLOWED_FORMATS,
    transformation: TRANSFORMATION,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    success: true,
    signature,
    ...params,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}