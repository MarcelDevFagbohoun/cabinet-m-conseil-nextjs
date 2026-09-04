import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sonde légère. Sert aussi de « keep-alive » : à pinger toutes les ~4 min
 * (cron externe gratuit type cron-job.org) pour éviter la mise en veille
 * de TiDB Serverless, qui rend la 1ʳᵉ requête lente après une pause.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    await query("SELECT 1");
    return NextResponse.json({ ok: true, db: "up", ms: Date.now() - startedAt });
  } catch {
    return NextResponse.json({ ok: false, db: "down", ms: Date.now() - startedAt }, { status: 503 });
  }
}
