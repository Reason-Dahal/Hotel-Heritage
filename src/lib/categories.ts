import Category from "@/models/Category";

// Case-insensitive, so "starter" is rejected when "Starter" already exists
export async function categoryNameTaken(name: string, excludeId?: string) {
  const filter: Record<string, unknown> = { name };
  if (excludeId) filter._id = { $ne: excludeId };
  return Boolean(
    await Category.exists(filter).collation({ locale: "en", strength: 2 })
  );
}

export function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}