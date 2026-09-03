"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function MessageList({ initial }: { initial: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [busy, setBusy] = useState<number | "all" | null>(null);

  const unread = useMemo(() => messages.filter((m) => !m.is_read).length, [messages]);

  async function markAllRead() {
    setBusy("all");
    await fetch("/api/admin/messages", { method: "PATCH" });
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: 1 })));
    setBusy(null);
    router.refresh();
  }

  async function toggleRead(message: ContactMessage) {
    const next = message.is_read ? 0 : 1;
    setBusy(message.id);
    await fetch(`/api/admin/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: next === 1 }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, is_read: next } : m))
    );
    setBusy(null);
    router.refresh();
  }

  async function remove(message: ContactMessage) {
    if (!confirm("Supprimer ce message ? Cette action est définitive.")) return;
    setBusy(message.id);
    await fetch(`/api/admin/messages/${message.id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
    setBusy(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-dim">
          {messages.length} message(s){unread > 0 ? ` · ${unread} non lu(s)` : ""}.
        </p>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            disabled={busy === "all"}
            className="btn-ghost !py-2 text-xs disabled:opacity-60"
          >
            {busy === "all" ? "…" : "Tout marquer comme lu"}
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`card p-5 sm:p-6 ${message.is_read ? "" : "border-l-4 border-l-gold"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  {!message.is_read && (
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-gold" />
                  )}
                  {message.name}
                </p>
                <p className="mt-0.5 break-words text-xs text-ink-faint">
                  <a href={`mailto:${message.email}`} className="hover:text-gold">
                    {message.email}
                  </a>
                  {message.phone ? ` · ${message.phone}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-xs text-ink-faint">{formatDate(message.created_at)}</p>
            </div>

            {message.subject && (
              <p className="mt-3 text-sm font-semibold text-ink">{message.subject}</p>
            )}
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-dim">
              {message.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-xs">
              <a
                href={`mailto:${message.email}${
                  message.subject ? `?subject=${encodeURIComponent("Re : " + message.subject)}` : ""
                }`}
                className="font-bold text-gold hover:underline"
              >
                Répondre
              </a>
              <button
                onClick={() => toggleRead(message)}
                disabled={busy === message.id}
                className="font-semibold text-ink-dim hover:text-gold disabled:opacity-60"
              >
                {message.is_read ? "Marquer non lu" : "Marquer lu"}
              </button>
              <button
                onClick={() => remove(message)}
                disabled={busy === message.id}
                className="font-bold text-wine hover:underline disabled:opacity-60"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}

        {messages.length === 0 && (
          <p className="card p-8 text-center text-ink-faint">Aucun message pour le moment.</p>
        )}
      </div>
    </>
  );
}
