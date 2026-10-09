import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Second line of defense: middleware already blocks unauthenticated
  // visitors, but we verify again here at the data layer.
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="border-b border-gray-200 bg-white p-4 md:min-h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <p className="mb-4 text-lg font-bold text-gray-800">Hotel Heritage</p>
        <AdminNav />
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="mb-2 truncate text-xs text-gray-500">
            {session.user?.email}
          </p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}