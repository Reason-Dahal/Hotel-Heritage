# 0003. Use Cloudinary for image storage

## Status
Accepted

## Context
The site is image-heavy: hotel photos, signature dish photos, room photos,
all uploaded by the admin through the admin panel. The chosen hosting
platform (Vercel) has an ephemeral filesystem in production — files
written to disk during a serverless function's execution are not
guaranteed to persist and are wiped on redeploy. Images therefore cannot
be saved directly onto the server's disk the way a traditional VPS setup
might.

## Decision
Use Cloudinary (free tier) as external image storage. Admin-uploaded
images are sent to Cloudinary via its API from the API Routes; only the
returned Cloudinary URL is stored in MongoDB documents (Room, MenuItem,
Notice), not the raw image file.

## Alternatives Considered
- **Store images directly on the Vercel filesystem**: rejected — not
  persistent in a serverless environment, images would be lost on
  redeploy.
- **Store images as Base64 strings directly in MongoDB**: rejected —
  bloats document size significantly, degrades database read/write
  performance, and MongoDB's free tier has a 512MB total storage cap that
  images would consume quickly.
- **Firebase Storage**: a viable free alternative, but Cloudinary offers
  built-in image transformation/optimization (resizing, format
  conversion) out of the box, which directly benefits page load speed and
  therefore SEO.

## Consequences
- Positive: images persist reliably regardless of redeploys; automatic
  image optimization improves page speed (an SEO ranking factor);
  MongoDB documents stay small and fast.
- Negative: introduces a third-party dependency and a free-tier usage cap
  (25GB storage / 25GB bandwidth per month on Cloudinary's free plan as of
  this writing) that must be monitored as the site grows.
