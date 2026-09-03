import { NextResponse } from "next/server";
import { execute } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Marque tous les messages comme lus. */
export async function PATCH() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  await execute("UPDATE contact_messages SET is_read = 1 WHERE is_read = 0");
  return NextResponse.json({ ok: true });
}
