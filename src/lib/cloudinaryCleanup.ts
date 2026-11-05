import cloudinary from "@/lib/cloudinary";

const OUR_FOLDER = "hotel-heritage/";
const URL_PATTERN =
  /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.[A-Za-z0-9]+$/;

// "https://res.cloudinary.com/x/image/upload/v1/hotel-heritage/abc.jpg" -> "hotel-heritage/abc"
// Only files inside our own folder are ever touched.
export function publicIdFromUrl(url: string): string | null {
  const match = URL_PATTERN.exec(url);
  if (!match) return null;
  try {
    const id = decodeURIComponent(match[1]);
    return id.startsWith(OUR_FOLDER) ? id : null;
  } catch {
    return null;
  }
}

// The addresses that were in `before` but are no longer in `after`
export function removedUrls(
  before: readonly string[] = [],
  after: readonly string[] = []
): string[] {
  const keep = new Set(after);
  return before.filter((url) => url && !keep.has(url));
}

// Best effort: a failure is logged and never breaks the admin's request
export async function deleteCloudinaryImages(urls: readonly string[]) {
  const ids = [
    ...new Set(
      urls.map(publicIdFromUrl).filter((id): id is string => id !== null)
    ),
  ];

  const results = await Promise.allSettled(
    ids.map((id) => cloudinary.uploader.destroy(id, { invalidate: true }))
  );
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Cloudinary cleanup failed:", result.reason);
    }
  }
}