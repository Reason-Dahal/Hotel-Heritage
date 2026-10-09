"use client";

import { useState } from "react";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import RoomForm, { type RoomPayload } from "./RoomForm";
import RoomsTable from "./RoomsTable";
import type { RoomDTO } from "./types";

export default function RoomsManager({ rooms }: { rooms: RoomDTO[] }) {
  const { saving, deletingId, error, clearError, save, remove } =
    useAdminCrud("/api/rooms");

  // null = form closed, "new" = creating, otherwise the room being edited
  const [editing, setEditing] = useState<RoomDTO | "new" | null>(null);

  const closeForm = () => {
    setEditing(null);
    clearError();
  };

  const handleSave = async (payload: RoomPayload) => {
    const id = editing && editing !== "new" ? editing._id : null;
    if (await save(id, payload)) closeForm();
  };

  const handleDelete = async (room: RoomDTO) => {
    if (!window.confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    await remove(room._id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
          <p className="mt-1 text-gray-600">Manage the rooms shown on your website.</p>
        </div>
        {editing === null && (
          <button
            onClick={() => {
              clearError();
              setEditing("new");
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add room
          </button>
        )}
      </div>

      {error && editing === null && (
        <p role="alert" className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {editing !== null && (
        <RoomForm
          key={editing === "new" ? "new" : editing._id}
          room={editing === "new" ? null : editing}
          saving={saving}
          error={error}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <RoomsTable
          rooms={rooms}
          deletingId={deletingId}
          onEdit={(room) => {
            clearError();
            setEditing(room);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}