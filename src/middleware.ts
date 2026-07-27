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

  if (pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/login")) {
    if (!valid) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (valid) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!valid) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
