# 0011. Server-rendered pages read data through shared helpers, not the API

## Status
Accepted. Supersedes the Phase 2 Container-diagram rule that "the frontend
never talks to MongoDB directly; everything goes through the API routes".

## Context
Phase 2 assumed a classic split: pages call API routes, and only API routes
touch the database. During implementation with the Next.js App Router, pages
turned out to be server components that run on the server. Making them call
their own API over HTTP would add a network hop to every page, would not work
at build time when the API is not yet running, and would duplicate queries for
no benefit. Search ranking is the top priority, so pages must render complete
content on the server quickly.

## Decision
- Public pages and admin pages read content by calling shared server helpers
  (`src/lib/content.ts`, `src/lib/settings.ts`) and the Mongoose models
  directly.
- API routes handle all changes (create, update, delete, reorder, upload
  signature, settings save). The public `GET` routes remain as a documented
  interface for any future external consumer, such as a mobile app.
- Client components never reach the database. They call API routes only for
  admin changes.
- Because direct reads skip the API's login check, admin pages are protected by
  two layers: the route guard (middleware) and a second session check in the
  panel layout. New admin pages must live under `src/app/admin/(panel)/`.

## Alternatives Considered
- **Pages fetch their own API routes**: one query path, but an extra HTTP hop
  per request, trouble at build time, and slower first paint.
- **Client-side fetching after load**: simple, but content would not be in the
  server HTML, which harms search ranking.

## Consequences
- Positive: faster pages, complete server-rendered HTML for crawlers, and one
  implementation of each read query.
- Negative: the public `GET` routes and the read helpers are now two code paths
  that could drift apart, and the site itself no longer uses those routes.
  They should be kept only while a future consumer needs them, and removed
  otherwise. Authorization for admin reads depends on the page being placed
  under `(panel)`, so that convention has to be maintained.
