import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { execute, queryOne, transaction } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { propertySchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import {
  PROPERTY_COLUMNS,
  insertPropertyChildren,
  propertyValues,
  uniquePropertySlug,
} from "@/lib/properties";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });

  const parsed = propertySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 422 }
    );
  }

  const existing = await queryOne<{ id: number; slug: string }>(
    "SELECT id, slug FROM properties WHERE id = ? LIMIT 1",
    [id]
  );
  if (!existing) return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });

  const data = parsed.data;
  const slug = await uniquePropertySlug(data.slug || slugify(data.title), id);
  const setClause = PROPERTY_COLUMNS.map((c) => `\`${c}\` = ?`).join(", ");

  await transaction(async (conn) => {
    await conn.execute(`UPDATE properties SET ${setClause} WHERE id = ?`, [
      ...propertyValues(data, slug),
      id,
    ]);
    await conn.execute("DELETE FROM property_images WHERE property_id = ?", [id]);
    await conn.execute("DELETE FROM property_documents WHERE property_id = ?", [id]);
    await insertPropertyChildren(conn, id, data);
  });

  revalidatePath("/biens-immobiliers");
  revalidatePath(`/biens-immobiliers/${slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true, id, slug });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });

  await execute("DELETE FROM properties WHERE id = ?", [id]);
  revalidatePath("/biens-immobiliers");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
