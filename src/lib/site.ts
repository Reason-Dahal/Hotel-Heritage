// The public address of the site, without a trailing slash.
// Set NEXT_PUBLIC_SITE_URL to the real domain on Vercel.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/+$/, "");
  
  export const absoluteUrl = (path = "/") =>
    `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;