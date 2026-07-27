import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query, transaction } from "@/lib/db";
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

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const rows = await query(
    "SELECT id, slug, title, type, `transaction`, status, price, price_unit, city, is_published, is_featured, updated_at FROM properties ORDER BY updated_at DESC LIMIT 200"
  );
  return NextResponse.json({ properties: rows });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = propertySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const slug = await uniquePropertySlug(data.slug || slugify(data.title));
  const columns = PROPERTY_COLUMNS.map((c) => `\`${c}\``).join(", ");
  const placeholders = PROPERTY_COLUMNS.map(() => "?").join(", ");

  const id = await transaction(async (conn) => {
    const [result] = await conn.execute(
      `INSERT INTO properties (${columns}, created_by) VALUES (${placeholders}, ?)`,
      [...propertyValues(data, slug), Number(guard.session.sub)]
    );
    const newId = (result as any).insertId as number;
    await insertPropertyChildren(conn, newId, data);
    return newId;
  });

  revalidatePath("/biens-immobiliers");
  revalidatePath("/");
  return NextResponse.json({ ok: true, id, slug }, { status: 201 });
}
