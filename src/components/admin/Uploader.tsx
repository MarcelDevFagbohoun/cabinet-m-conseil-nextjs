"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo

export default function Uploader({
  label,
  accept = "image/jpeg,image/png,image/webp",
  onUploaded,
}: {
  label: string;
  accept?: string;
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError(null);

    try {
      for (const file of files) {
        const ext = EXT[file.type];
        if (!ext) {
          setError(`${file.name} : format non autorisé (JPG, PNG, WEBP ou PDF).`);
          break;
        }
        if (file.size > MAX_SIZE) {
          setError(`${file.name} : trop volumineux (8 Mo maximum).`);
          break;
        }

        // Upload direct vers Vercel Blob ; /api/admin/upload ne fait que
        // délivrer le jeton (admin authentifié).
        const blob = await upload(`uploads/${crypto.randomUUID()}.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType: file.type,
        });
        onUploaded(blob.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Téléversement impossible.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className="btn-ghost cursor-pointer !py-2 text-xs">
        {busy ? "Téléversement…" : label}
        <input type="file" accept={accept} multiple onChange={handleChange} className="hidden" />
      </label>
      {error && <p className="mt-2 text-xs font-semibold text-wine">{error}</p>}
    </div>
  );
}
