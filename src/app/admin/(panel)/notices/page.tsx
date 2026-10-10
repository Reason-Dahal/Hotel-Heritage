import connectDB from "@/lib/db";
import Notice from "@/models/Notice";
import NoticesManager from "@/components/admin/notices/NoticesManager";
import type { NoticeDTO } from "@/components/admin/notices/types";

export const dynamic = "force-dynamic";

export default async function AdminNoticesPage() {
  await connectDB();
  const docs = await Notice.find({}).sort({ createdAt: -1 }).lean();

  const notices: NoticeDTO[] = docs.map((n) => ({
    _id: String(n._id),
    title: n.title,
    message: n.message,
    image: n.image ?? "",
    active: n.active ?? false,
  }));

  return <NoticesManager notices={notices} />;
}