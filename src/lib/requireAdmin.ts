import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Call this at the top of any write handler (POST/PUT/PATCH/DELETE).
 * Returns an error response if the request is not from a logged-in admin
 * on our own site, or null if it is allowed.
 */
export async function requireAdmin() {
  // Browsers attach an Origin header to change requests. If it names a
  // different website, the request came from another site, so refuse it.
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (origin && host) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      // A malformed Origin never matches
    }
    if (originHost !== host) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}