# 0008. Store site settings in the database as a singleton document

## Status
Accepted

## Context
The public site needs hotel-wide details in several places: the hotel name
in the header, contact details and social links in the footer, a map on the
homepage, and a hero image plus rotating banner messages. The client wants
to change these himself without involving a developer.

## Decision
Store these values in a single `site_settings` document (always
`key: "main"`) in MongoDB, editable from a Settings page in the admin
panel. Reading is public (`GET /api/settings`); writing is admin-only
(`PUT /api/settings`) and uses an upsert, so the document is created on
first save. Saving triggers `revalidatePath` so public pages refresh
immediately. Link fields are validated to `http(s)` only, and the map field
to Google Maps embed URLs only, because these values are rendered into
`href` and `iframe src` attributes.

## Alternatives Considered
- **A config file in the code**: simplest, but every change (a new phone
  number, a new Instagram link) needs a developer, a commit, and a
  redeploy. Rejected because client self-service was an explicit goal.
- **A generic key-value settings collection**: more flexible, but loses
  typing and per-field validation, and the set of settings here is small
  and known.

## Consequences
- Positive: the client controls site-wide content; no redeploy needed for
  content changes; one validated schema is the source of truth.
- Negative: public pages now depend on one extra database read (mitigated
  by per-request caching and `revalidatePath`); the app needs a sensible
  default when no settings document exists yet (`DEFAULT_SETTINGS`).
