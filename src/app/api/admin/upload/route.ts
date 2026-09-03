import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
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

// Dossier public servi tel quel par Next (`public/uploads/**` est ignoré par git).
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

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
  const filename = `${crypto.randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch {
    return NextResponse.json(
      { error: "Enregistrement du fichier impossible sur le serveur." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    url: `/uploads/${filename}`,
    kind: file.type === "application/pdf" ? "document" : "image",
  });
}
