# 0007. Split NextAuth config into edge-safe and full versions

## Status
Accepted

## Context
Next.js middleware (`src/middleware.ts`) runs in the Edge Runtime, a
lightweight execution environment that does not support full Node.js
APIs. The project's NextAuth configuration originally lived in a single
`src/lib/auth.ts` file that imported `bcryptjs` (for password comparison)
and the Mongoose-based `connectDB`/`Admin` model (for the Credentials
provider's `authorize` function). Because middleware needs to call
`auth()` to check session state on every request to `/admin/*`, it was
transitively importing this Node-only code, causing a runtime error
("A Node.js API is used... not supported in the Edge Runtime").

## Decision
Split the NextAuth configuration into two files:
- `src/lib/auth.config.ts`: edge-safe. Contains only the `pages` config
  and the `authorized` callback (route-protection logic), no providers,
  no bcrypt, no database access.
- `src/lib/auth.ts`: full config. Spreads `authConfig` and adds the
  actual `Credentials` provider with its `bcrypt`/Mongoose-dependent
  `authorize` function. Used by API routes and server components, which
  run in the standard Node.js runtime.

`src/middleware.ts` imports only from `auth.config.ts`, never from
`auth.ts`.

## Alternatives Considered
- **Move middleware logic into a Node.js API route instead of edge
  middleware**: rejected — loses the performance benefit of edge
  middleware running before the request reaches any page/route handler,
  and is not the pattern NextAuth v5 is designed around.
- **Avoid bcrypt, use an edge-compatible hashing approach**: rejected —
  bcrypt is a well-established, secure choice for password hashing;
  working around it would weaken security for the sake of avoiding a
  file split that solves the problem cleanly anyway.

## Consequences
- Positive: middleware runs correctly in the Edge Runtime; the split is
  the officially recommended NextAuth v5 pattern, so it is a well
  documented, supported approach going forward (e.g. if additional
  providers are added later, like Google OAuth for a future multi-admin
  scenario).
- Negative: two files to keep in sync conceptually — any change to route
  protection logic (the `authorized` callback) must happen in
  `auth.config.ts`, while provider/credential logic stays in `auth.ts`.
  A developer unfamiliar with this split could initially be confused
  about which file to edit; this ADR exists specifically to resolve that
  confusion.
