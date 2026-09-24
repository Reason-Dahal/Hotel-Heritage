# 0002. Use MongoDB Atlas as the database

## Status
Accepted

## Context
The system stores three independent, flexible-shaped collections (Room,
MenuItem, Notice) with no relational joins between them in Phase 1. Data
must be admin-editable (images, price, discount) with no rigid schema
migrations expected for common edits. The project must use only free-tier
infrastructure, and pairs with a Next.js/Node backend.

## Decision
Use MongoDB Atlas (free tier, 512MB) as the primary database, accessed via
Mongoose from Next.js API Routes.

## Alternatives Considered
- **PostgreSQL (e.g. Vercel Postgres / Supabase free tier)**: strong choice
  for relational data with joins and strict schemas, but this project's
  data does not require relational joins in Phase 1, and MongoDB's
  document model maps more directly onto "one document per room / menu
  item / notice" without extra table design.
- **SQLite (file-based)**: rejected outright because hosting platforms
  like Vercel have ephemeral/read-only filesystems in production — a
  file-based database would not persist reliably.

## Consequences
- Positive: schema flexibility fits admin-driven content well (e.g. easy
  to add a new field to a room later without a formal migration); Atlas
  free tier has no time limit (not a trial); works well with Mongoose
  for validation at the application level.
- Negative: if Phase 2+ features (bookings, orders) later need strict
  relational integrity (e.g. guaranteeing a booking always references a
  valid room), that integrity must be enforced in application code rather
  than by the database itself, since MongoDB does not enforce foreign
  keys natively.
