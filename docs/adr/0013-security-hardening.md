# 0013. Security hardening before launch

## Status
Accepted

## Context
The public pages are read-only. The sensitive parts are the admin login, the
write API routes, and the image upload endpoint. The site runs on serverless
hosting with a free database, so any protection has to work without a
dedicated server or an extra paid service.

## Decision
- **Login rate limiting** is stored in MongoDB in a `loginattempts` collection
  whose records delete themselves after 15 minutes (a TTL index). Failures are
  counted per client address (5 per 15 minutes) and per email (20 per 15
  minutes). Passwords are compared against a dummy hash when the email is
  unknown, so response time does not reveal which emails exist. Only plain
  text values are accepted for email and password.
- **Origin check**: `requireAdmin()` refuses any change request whose `Origin`
  header names a different site, as defense in depth beside the SameSite session
  cookie.
- **Session length** is 8 hours.
- **Upload signature** fixes the allowed formats to jpg, png, and webp and
  scales stored images to at most 2400 x 2400 pixels.
- **Image links** accepted by the API must be photos in our own Cloudinary
  account. Photos removed from a record, or belonging to a deleted record, are
  deleted from Cloudinary after the response is sent. Only files inside the
  `hotel-heritage` folder are ever deleted, and a failure is logged without
  failing the admin's request.
- **Security headers** are applied to production builds: a Content Security
  Policy, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and HSTS. `X-Powered-By` is removed.
- Malformed record ids return `400` instead of `500`.
- Next.js 16 renamed `middleware` to `proxy`; the route guard file is now
  `src/proxy.ts`.

## Alternatives Considered
- **In-memory rate limiting**: each serverless instance has its own memory, so
  an attacker would mostly reach instances with empty counters.
- **A hosted Redis or a rate-limiting service**: stronger and faster, but adds
  another account and dependency for one admin login.
- **A nonce-based Content Security Policy**: removes `'unsafe-inline'` for
  scripts, but forces every page to render per request, giving up static
  generation and its speed and SEO benefits.
- **Locking the admin account after repeated failures**: stops an attacker with
  many addresses, but lets anyone lock the owner out, so only the generous
  per-email cap is used.

## Consequences
- Positive: no new services, no new dependencies, and every protection works on
  the free tier.
- Negative: failed logins cause small database writes. The owner can be blocked
  for up to 15 minutes after repeated mistakes, and in a sustained attack the
  per-email cap could do the same. A strong admin password remains the main
  defense. `'unsafe-inline'` makes the Content Security Policy weaker than a
  nonce-based one. Image cleanup is best effort, so a Cloudinary outage leaves
  an unused file behind, never a broken page.
