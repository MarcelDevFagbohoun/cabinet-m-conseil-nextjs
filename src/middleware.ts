import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "cmc_session";

/**
 * Protège /admin/** (hors page de connexion) et /api/admin/**.
 * La vérification cryptographique du jeton se fait ici, en amont du rendu.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;

  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  // /api/admin/login : authentifie lui-même.
  // /api/admin/upload : gère son auth (jeton d'upload) et reçoit un rappel
  //   serveur-à-serveur signé de Vercel Blob, sans cookie de session.
  const selfGuarded =
    pathname.startsWith("/api/admin/login") || pathname.startsWith("/api/admin/upload");

  if (pathname.startsWith("/api/admin/") && !selfGuarded) {
    if (!valid) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname === "/gestion-9f2a7c/login") {
    if (valid) return NextResponse.redirect(new URL("/gestion-9f2a7c", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/gestion-9f2a7c")) {
    if (!valid) {
      const url = new URL("/gestion-9f2a7c/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gestion-9f2a7c/:path*", "/api/admin/:path*"],
};
