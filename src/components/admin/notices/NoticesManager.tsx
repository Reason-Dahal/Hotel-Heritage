"use client";

import { useState } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import NoticeForm, { type NoticePayload } from "./NoticeForm";
import NoticesTable from "./NoticesTable";
import type { NoticeDTO } from "./types";

export default function NoticesManager({ notices }: { notices: NoticeDTO[] }) {
  const { saving, deletingId, error, clearError, save, remove } = useAdminCrud(
    "/api/notices",
    { updateMethod: "PATCH" }
  );

  // null = form closed, "new" = creating, otherwise the notice being edited
  const [editing, setEditing] = useState<NoticeDTO | "new" | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const closeForm = () => {
    setEditing(null);
    clearError();
  };

  const handleSave = async (payload: NoticePayload) => {
    const id = editing && editing !== "new" ? editing._id : null;
    if (await save(id, payload)) closeForm();
  };

  const handleToggle = async (notice: NoticeDTO) => {
    setTogglingId(notice._id);
    await save(notice._id, { active: !notice.active });
    setTogglingId(null);
  };

  const handleDelete = async (notice: NoticeDTO) => {
    if (!window.confirm(`Delete "${notice.title}"? This cannot be undone.`)) return;
    await remove(notice._id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notices</h1>
          <p className="mt-1 text-gray-600">
            Active notices appear as a popup when visitors open your website.
          </p>
        </div>
        {editing === null && (
          <button
            onClick={() => {
              clearError();
              setEditing("new");
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add notice
          </button>
        )}
      </div>

      {error && editing === null && (
        <p role="alert" className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {editing !== null && (
        <NoticeForm
          key={editing === "new" ? "new" : editing._id}
          notice={editing === "new" ? null : editing}
          saving={saving}
          error={error}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <NoticesTable
          notices={notices}
          deletingId={deletingId}
          togglingId={togglingId}
          busy={saving || deletingId !== null}
          onToggle={handleToggle}
          onEdit={(notice) => {
            clearError();
            setEditing(notice);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}