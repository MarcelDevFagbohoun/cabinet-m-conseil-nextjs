import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { execute } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/api";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000).allowed) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez plus tard." },
      { status: 429 }
    );
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." },
      { status: 422 }
    );
  }

  const data = parsed.data;
  // Champ piège rempli => robot, on répond OK sans rien enregistrer.
  if (data.website) return NextResponse.json({ ok: true });

  await execute(
    `INSERT INTO contact_messages (name, email, phone, subject, message, property_id, ip_hash)
     VALUES (?,?,?,?,?,?,?)`,
    [
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message,
      data.property_id,
      createHash("sha256").update(ip).digest("hex"),
    ]
  );

  return NextResponse.json({ ok: true });
}
