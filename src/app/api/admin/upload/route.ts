import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Upload direct navigateur → Vercel Blob : le fichier ne transite pas par
// cette fonction (contourne la limite de 4,5 Mo des fonctions serverless).
// Ici on ne fait que délivrer un jeton d'upload à un admin authentifié.
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      // Appelé lors de la demande de jeton (requête navigateur → porte le cookie admin).
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session) throw new Error("Non autorisé.");
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: false,
        };
      },
      // Rappel serveur-à-serveur de Vercel Blob (signé). Rien à faire :
      // l'URL finale est renvoyée au navigateur par le SDK.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Téléversement impossible." },
      { status: 400 }
    );
  }
}
