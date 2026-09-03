import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Bascule l'état lu / non lu d'un message. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const isRead = body?.is_read ? 1 : 0;

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM contact_messages WHERE id = ? LIMIT 1",
    [id]
  );
  if (!existing) return NextResponse.json({ error: "Message introuvable." }, { status: 404 });

  await execute("UPDATE contact_messages SET is_read = ? WHERE id = ?", [isRead, id]);
  return NextResponse.json({ ok: true, is_read: isRead });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });

  await execute("DELETE FROM contact_messages WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
