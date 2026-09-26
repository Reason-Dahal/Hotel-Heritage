# 0006. Use Zod for runtime input validation

## Status
Accepted

## Context
The `openapi.yaml` specification (Phase 2) documents the expected shape of
`RoomInput` and `MenuItemInput` — required fields, types, and constraints
like `discountPercent` being between 0 and 100. However, documenting a
contract does not enforce it. Without runtime validation, malformed data
(e.g. a missing `name`, a negative `price`, or a non-numeric value) could
either crash the request with an unclear Mongoose error or, in some cases,
be saved to the database in a bad state.

## Decision
Use Zod (free, open source, TypeScript-first) to define validation schemas
in `src/lib/validation.ts` that mirror the OpenAPI input schemas. Every
`POST` and `PUT` handler parses and validates the incoming request body
with `safeParse()` before touching the database, returning a `400` with
clear field-level error messages on failure.

## Alternatives Considered
- **Rely on Mongoose schema validation alone**: Mongoose does provide some
  validation (e.g. `required: true`), but its error messages are verbose
  and not designed to be returned directly to an API consumer. It also
  only validates at the database-write step, not at the API boundary,
  meaning bad requests travel further through the system before being
  rejected.
- **Joi**: a mature, widely used validation library, but not
  TypeScript-first — Zod infers static types directly from its schemas,
  which keeps validation and TypeScript types in sync automatically as
  the project grows.
- **No validation layer, rely on manual `if` checks in each route**:
  rejected as unmaintainable and error-prone once more routes (bookings,
  orders) are added in future phases.

## Consequences
- Positive: bad requests are rejected early with clear, consistent error
  responses; validation logic is centralized in one file per resource
  rather than scattered `if` checks; Zod schemas double as a single
  source of truth that can generate TypeScript types.
- Negative: introduces a manual-sync responsibility — `validation.ts` and
  `openapi.yaml` are two separate hand-written files describing the same
  shape, and nothing currently enforces they stay identical if one is
  updated without the other. Acceptable trade-off at this project's
  scale; worth revisiting (e.g. generating OpenAPI from Zod schemas) if
  the number of resources grows significantly in future phases.
