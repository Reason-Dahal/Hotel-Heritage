import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Keeps the public menu looking the same as before on the first run
const CLASSIC_ORDER = ["starter", "main course", "dessert", "beverage"];

const rank = (key: string) => {
  const i = CLASSIC_ORDER.indexOf(key);
  return i === -1 ? 100 : i;
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await mongoose.connect(process.env.MONGODB_URI as string);

  const db = mongoose.connection.db!;
  const menuItems = db.collection("menuitems");
  const categories = db.collection("categories");

  // Only items that still have the old text category
  const legacy = await menuItems.find({ category: { $type: "string" } }).toArray();
  if (legacy.length === 0) {
    console.log("Nothing to migrate.");
    await mongoose.disconnect();
    return;
  }

  // One entry per distinct name, ignoring capital letters and extra spaces
  const wanted = new Map<string, string>();
  for (const item of legacy) {
    const name = String(item.category).trim();
    if (name && !wanted.has(name.toLowerCase())) wanted.set(name.toLowerCase(), name);
  }

  const existing = await categories.find({}).toArray();
  const idByKey = new Map<string, unknown>(
    existing.map((c): [string, unknown] => [String(c.name).toLowerCase(), c._id])
  );

  const last = await categories.find({}).sort({ sortOrder: -1 }).limit(1).toArray();
  let nextOrder = last.length ? (last[0].sortOrder ?? 0) + 1 : 0;

  const toCreate = [...wanted.entries()]
    .filter(([key]) => !idByKey.has(key))
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));

  for (const [key, name] of toCreate) {
    console.log(`${dryRun ? "[dry run] Would create" : "Creating"} category: ${name}`);
    if (dryRun) continue;
    const now = new Date();
    const result = await categories.insertOne({
      name,
      sortOrder: nextOrder++,
      createdAt: now,
      updatedAt: now,
    });
    idByKey.set(key, result.insertedId);
  }

  let updated = 0;
  for (const item of legacy) {
    const categoryId = idByKey.get(String(item.category).trim().toLowerCase()) ?? null;
    if (!dryRun) {
      await menuItems.updateOne(
        { _id: item._id },
        { $set: { categoryId }, $unset: { category: "" } }
      );
    }
    updated++;
  }

  console.log(`${dryRun ? "[dry run] Would update" : "Updated"} ${updated} menu item(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});