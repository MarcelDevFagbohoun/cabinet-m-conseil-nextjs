"use client";

import { useState } from "react";

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

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Téléversement impossible.");
        break;
      }
      onUploaded(data.url);
    }

    setBusy(false);
    event.target.value = "";
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
