# 0009. Manage menu categories as a collection referenced by id

## Status
Accepted

## Context
Menu items originally stored their category as free text, entered by the
admin through a text box with suggestions. This allowed typos and
inconsistent spellings ("Dessert" vs "Desert" vs "desserts"), each of which
silently created a separate public menu section. The display order was
hard-coded in the application, and the admin could not control it. The
client wants to create and edit categories himself.

## Decision
Introduce a `categories` collection (`name`, `sortOrder`) managed from an
admin Categories page (create, rename, reorder, delete). Menu items
reference a category through a new `categoryId` field. The public menu
groups dishes by category in the admin-defined order; dishes without a
category appear last under "Other".

- Names are unique ignoring capital letters, enforced by a
  case-insensitive unique index and a pre-check for a clear error message.
- A category cannot be deleted while menu items use it (409 Conflict), so
  items are never left referencing a missing category.
- Reordering sends the full ordered list of ids in one request, so the
  result is deterministic and avoids races between neighbouring updates.
- Existing text categories are converted by a one-time, idempotent script
  (`scripts/migrateCategories.ts`) with a `--dry-run` mode. It keeps the
  previous public ordering (Starter, Main Course, Dessert, Beverage first).

## Alternatives Considered
- **Keep free text with suggestions**: no new code, but typos and
  inconsistent names continue, and ordering stays hard-coded.
- **Store the category name on each item and validate against the list**:
  simpler reads, but renaming a category would require updating every item,
  and a partial failure would leave inconsistent data.
- **A fixed enum in code**: consistent, but any change needs a developer,
  which defeats the goal of client self-service.

## Consequences
- Positive: renames propagate automatically; consistent, admin-controlled
  categories and ordering; this is the first reference between collections,
  and it prepares the ground for future features such as category-level
  reports.
- Negative: reading menu items needs the category name (a populate or a
  second lookup); referential integrity is enforced in application code
  (MongoDB has no foreign keys), so any new code that deletes categories
  must go through the same "in use" check.
