import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { execute, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { uniquePostSlug } from "@/lib/properties";

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

  const parsed = postSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 422 }
    );
  }

  const existing = await queryOne<{ id: number; published_at: string | null }>(
    "SELECT id, published_at FROM posts WHERE id = ? LIMIT 1",
    [id]
  );
  if (!existing) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });

  const data = parsed.data;
  const slug = await uniquePostSlug(data.slug || slugify(data.title), id);
  const publishedAt = data.is_published
    ? existing.published_at
      ? new Date(existing.published_at)
      : new Date()
    : null;

  await execute(
    `UPDATE posts SET slug = ?, title = ?, category = ?, excerpt = ?, content = ?,
       cover_image = ?, is_published = ?, published_at = ?, meta_title = ?, meta_description = ?
     WHERE id = ?`,
    [
      slug,
      data.title,
      data.category,
      data.excerpt,
      data.content,
      data.cover_image,
      data.is_published ? 1 : 0,
      publishedAt,
      data.meta_title,
      data.meta_description,
      id,
    ]
  );

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ ok: true, id, slug });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });

  await execute("DELETE FROM posts WHERE id = ?", [id]);
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}
