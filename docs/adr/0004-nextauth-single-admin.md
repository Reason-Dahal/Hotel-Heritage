# 0004. Use NextAuth.js with a single Credentials-based admin account

## Status
Accepted

## Context
The admin panel needs to be protected so only the hotel's designated staff
can create/edit/delete rooms, menu items, and notices. The client
confirmed a single admin account is sufficient for now, with no immediate
need for multiple staff logins or role-based permissions.

## Decision
Use NextAuth.js with the Credentials provider (email + password) backed by
a single `Admin` document in MongoDB, with the password stored as a bcrypt
hash. All write API routes are protected by checking for a valid NextAuth
session.

## Alternatives Considered
- **Third-party auth service (e.g. Auth0, Clerk)**: offers more features
  (social login, multi-user roles) out of the box, but adds complexity and
  another external account/dependency that is unnecessary for a single
  admin use case, and free tiers often have user-count limits.
- **Custom-rolled JWT auth from scratch**: rejected — reinventing session
  handling, cookie security, and CSRF protection is unnecessary risk when
  NextAuth already solves these problems and integrates natively with
  Next.js.

## Consequences
- Positive: simple to implement and reason about for a single admin;
  NextAuth handles session cookies and security best practices; free and
  open source.
- Negative: not designed for multi-role permission systems out of the box
  — if the client later wants multiple staff accounts with different
  permission levels (e.g. "can edit menu but not delete rooms"), the
  `Admin` model and middleware will need to be extended with a `role`
  field and per-route permission checks. This is a foreseeable, low-cost
  future change, not a redesign.
