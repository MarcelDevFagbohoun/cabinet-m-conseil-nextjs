import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { execute, query } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { uniquePostSlug } from "@/lib/properties";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const rows = await query(
    "SELECT id, slug, title, category, is_published, published_at, updated_at FROM posts ORDER BY updated_at DESC LIMIT 200"
  );
  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = postSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const slug = await uniquePostSlug(data.slug || slugify(data.title));

  const result = await execute(
    `INSERT INTO posts
      (slug, title, category, excerpt, content, cover_image, is_published, published_at, meta_title, meta_description, created_by)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      slug,
      data.title,
      data.category,
      data.excerpt,
      data.content,
      data.cover_image,
      data.is_published ? 1 : 0,
      data.is_published ? new Date() : null,
      data.meta_title,
      data.meta_description,
      Number(guard.session.sub),
    ]
  );

  revalidatePath("/blog");
  return NextResponse.json({ ok: true, id: result.insertId, slug }, { status: 201 });
}
