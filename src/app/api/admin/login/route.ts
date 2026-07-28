import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne, execute } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminRow = {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: "admin" | "editor";
  is_active: number;
  failed_attempts: number;
  locked_until: string | null;
};

export async function POST(request: Request) {
  const ip = clientIp(request);
if (!rateLimit(`login:${ip}`, 30, 2 * 60 * 1000).allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await queryOne<AdminRow>(
    "SELECT * FROM admin_users WHERE email = ? LIMIT 1",
    [email]
  );

  // Message identique dans tous les cas d'échec : pas d'énumération de comptes.
  const genericError = NextResponse.json(
    { error: "Email ou mot de passe incorrect." },
    { status: 401 }
  );

  if (!user || !user.is_active) {
    await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
    return genericError;
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return NextResponse.json(
      { error: "Compte temporairement verrouillé. Réessayez plus tard." },
      { status: 423 }
    );
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const attempts = user.failed_attempts + 1;
    const lock = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    await execute(
      "UPDATE admin_users SET failed_attempts = ?, locked_until = ? WHERE id = ?",
      [attempts, lock, user.id]
    );
    return genericError;
  }

  await execute(
    "UPDATE admin_users SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?",
    [user.id]
  );

  const token = await signSession({
    sub: String(user.id),
    email: user.email,
    name: user.full_name,
    role: user.role,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
