import { revalidatePath } from "next/cache";

// Public pages are statically generated. Call this after any content change
// so visitors see it immediately instead of after the hourly refresh.
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}