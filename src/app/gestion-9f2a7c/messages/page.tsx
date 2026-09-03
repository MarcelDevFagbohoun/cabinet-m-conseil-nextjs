import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import MessageList from "@/components/admin/MessageList";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import type { ContactMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/gestion-9f2a7c/login");

  let messages: ContactMessage[] = [];
  try {
    messages = await query<ContactMessage>(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100"
    );
  } catch {
    messages = [];
  }

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl text-ink">Messages reçus</h1>
      <MessageList initial={messages} />
    </AdminShell>
  );
}
