"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// API errors are either a string or an object of field errors (from Zod)
function formatError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const messages = Object.values(error as Record<string, string[]>).flat();
    if (messages.length) return messages.join(" ");
  }
  return "Something went wrong. Please try again.";
}

export function useAdminCrud(
  endpoint: string,
  options: { updateMethod?: "PUT" | "PATCH" } = {}
) {
  const { updateMethod = "PUT" } = options;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function request(url: string, init: RequestInit): Promise<boolean> {
    try {
      const res = await fetch(url, init);

      if (res.status === 401) {
        router.push("/admin/login");
        return false;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(formatError(data?.error));
        return false;
      }

      router.refresh();
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    }
  }

  // id = null creates a new record, otherwise updates that record
  async function save(id: string | null, payload: unknown): Promise<boolean> {
    setError("");
    setSaving(true);
    const ok = await request(id ? `${endpoint}/${id}` : endpoint, {
      method: id ? updateMethod : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    return ok;
  }

  async function remove(id: string): Promise<boolean> {
    setError("");
    setDeletingId(id);
    const ok = await request(`${endpoint}/${id}`, { method: "DELETE" });
    setDeletingId(null);
    return ok;
  }

  return {
    saving,
    deletingId,
    error,
    clearError: () => setError(""),
    save,
    remove,
  };
}