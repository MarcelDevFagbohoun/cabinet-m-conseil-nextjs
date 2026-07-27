"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  endpoint,
  label = "Supprimer",
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Confirmer la suppression ? Cette action est définitive.")) return;
    setBusy(true);
    await fetch(endpoint, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-xs font-bold text-wine hover:underline">
      {busy ? "…" : label}
    </button>
  );
}
