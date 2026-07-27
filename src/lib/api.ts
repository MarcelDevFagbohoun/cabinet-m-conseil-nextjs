import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./auth";

/** Garde d'accès pour les Route Handlers d'administration. */
export async function requireAdmin(): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Non autorisé" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

/** Limiteur de débit en mémoire (par IP + clé d'action). */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  bucket.count += 1;
  if (bucket.count > limit) return { allowed: false, remaining: 0 };
  return { allowed: true, remaining: limit - bucket.count };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}
