import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Call this at the top of any write handler (POST/PUT/PATCH/DELETE).
 * Returns a 401 response if not authenticated, or null if authorized.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}