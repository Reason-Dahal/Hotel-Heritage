import Image from "next/image";
import type { NoticeDTO } from "./types";

interface Props {
  notices: NoticeDTO[];
  deletingId: string | null;
  togglingId: string | null;
  busy: boolean;
  onToggle: (notice: NoticeDTO) => void;
  onEdit: (notice: NoticeDTO) => void;
  onDelete: (notice: NoticeDTO) => void;
}

export default function NoticesTable({
  notices,
  deletingId,
  togglingId,
  busy,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  if (notices.length === 0) {
    return (
      <p className="p-6 text-sm text-gray-600">
        No notices yet. Click &quot;Add notice&quot; to create the first one.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
        <tr>
          <th className="p-3">Image</th>
          <th className="p-3">Title</th>
          <th className="p-3">Message</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {notices.map((notice) => (
          <tr key={notice._id} className="border-b border-gray-100 last:border-0">
            <td className="p-3">
              {notice.image ? (
                <Image
                  src={notice.image}
                  alt={notice.title}
                  width={64}
                  height={48}
                  className="h-12 w-16 rounded object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </td>
            <td className="p-3 font-medium text-gray-800">{notice.title}</td>
            <td className="max-w-xs truncate p-3 text-gray-700">{notice.message}</td>
            <td className="p-3">
              <button
                onClick={() => onToggle(notice)}
                disabled={busy}
                aria-label={`${notice.active ? "Deactivate" : "Activate"} ${notice.title}`}
                className={`rounded px-2 py-1 text-xs font-semibold disabled:opacity-60 ${
                  notice.active
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {togglingId === notice._id
                  ? "Updating..."
                  : notice.active
                    ? "Active"
                    : "Inactive"}
              </button>
            </td>
            <td className="p-3">
              <button
                onClick={() => onEdit(notice)}
                className="mr-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(notice)}
                disabled={deletingId === notice._id}
                className="text-red-600 hover:underline disabled:opacity-60"
              >
                {deletingId === notice._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}