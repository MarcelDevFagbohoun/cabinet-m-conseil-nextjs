import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo

// Types autorisés uniquement (photos + documents) : pas d'exécutable ni de SVG.
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (8 Mo maximum)." }, { status: 413 });
  }
  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Format non autorisé (JPG, PNG, WEBP ou PDF)." },
      { status: 415 }
    );
  }

  // Nom de fichier généré côté serveur : le nom d'origine n'est jamais utilisé.
  const filename = `uploads/${crypto.randomUUID()}${extension}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return NextResponse.json({
    ok: true,
    url: blob.url,
    kind: file.type === "application/pdf" ? "document" : "image",
  });
}