import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";
import { query, execute } from "@/lib/db";
import type { ContactMessage } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let messages: ContactMessage[] = [];
  try {
    messages = await query<ContactMessage>(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100"
    );
    await execute("UPDATE contact_messages SET is_read = 1 WHERE is_read = 0");
  } catch {
    messages = [];
  }

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl text-ink">Messages reçus</h1>
      <p className="mt-1 text-sm text-ink-dim">{messages.length} message(s).</p>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <article key={message.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{message.name}</p>
                <p className="text-xs text-ink-faint">
                  <a href={`mailto:${message.email}`} className="hover:text-gold">{message.email}</a>
                  {message.phone ? ` · ${message.phone}` : ""}
                </p>
              </div>
              <p className="text-xs text-ink-faint">{formatDate(message.created_at)}</p>
            </div>
            {message.subject && (
              <p className="mt-3 text-sm font-semibold text-ink">{message.subject}</p>
            )}
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-dim">
              {message.message}
            </p>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="card p-8 text-center text-ink-faint">Aucun message pour le moment.</p>
        )}
      </div>
    </AdminShell>
  );
}
