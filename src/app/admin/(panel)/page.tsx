import connectDB from "@/lib/db";
import Room from "@/models/Room";
import MenuItem from "@/models/MenuItem";
import Notice from "@/models/Notice";

// Always show live numbers, never a cached build-time snapshot
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [rooms, menuItems, activeNotices] = await Promise.all([
    Room.countDocuments(),
    MenuItem.countDocuments(),
    Notice.countDocuments({ active: true }),
  ]);

  const stats = [
    { label: "Rooms", value: rooms },
    { label: "Menu items", value: menuItems },
    { label: "Active notices", value: activeNotices },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-1 text-gray-600">Overview of your site content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}