"use client";

import { useState } from "react";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploaderProps {
  // May return a promise; files are processed one at a time, in order
  onUploaded: (url: string) => void | Promise<void>;
  multiple?: boolean;
  disabled?: boolean;
}

function problemWith(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `image must be smaller than ${MAX_SIZE_MB}MB`;
  }
  return null;
}

async function uploadToCloudinary(file: File): Promise<string> {
  // 1. Ask our server for a signature (admin-only)
  const signRes = await fetch("/api/upload/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Not authorized to upload.");
  const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json();

  // 2. Send the file straight to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed.");

  const data = await uploadRes.json();
  return data.secure_url as string;
}

function asSentence(text: string) {
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
  return capitalized.endsWith(".") ? capitalized : `${capitalized}.`;
}

export default function ImageUploader({
  onUploaded,
  multiple = false,
  disabled = false,
}: ImageUploaderProps) {
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const uploading = progress !== null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    setError("");
    const problems: { name: string; reason: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      const problem = problemWith(file);
      if (problem) {
        problems.push({ name: file.name, reason: problem });
        continue;
      }

      try {
        await onUploaded(await uploadToCloudinary(file));
      } catch (err) {
        problems.push({
          name: file.name,
          reason: err instanceof Error ? err.message : "upload failed",
        });
      }
    }

    setProgress(null);
    input.value = ""; // allow re-selecting the same files

    if (problems.length === 1 && files.length === 1) {
      setError(asSentence(problems[0].reason));
    } else if (problems.length > 0) {
      setError(
        `${problems.length} of ${files.length} photos could not be added: ` +
          problems.map((p) => `${p.name} (${p.reason.replace(/\.$/, "")})`).join("; ") +
          "."
      );
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={uploading || disabled}
      />
      {progress && (
        <p role="status" className="mt-2 text-sm text-gray-600">
          {progress.total > 1
            ? `Uploading ${progress.current} of ${progress.total}...`
            : "Uploading..."}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}