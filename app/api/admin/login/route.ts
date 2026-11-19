import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionValue,
  sessionCookieOptions,
} from "@/lib/auth";
import { verifyUser } from "@/lib/users";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; reset: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function isBlocked(ip: string): boolean {
  const now = Date.now();
  if (attempts.size > 500) {
    for (const [key, value] of attempts) {
      if (value.reset <= now) attempts.delete(key);
    }
  }
  const record = attempts.get(ip);
  return Boolean(record && record.reset > now && record.count >= MAX_ATTEMPTS);
}

function registerFailure(ip: string): void {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || record.reset <= now) {
    attempts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return;
  }
  record.count += 1;
}

export async function POST(request: Request) {
  let username = "";
  let password = "";

  const ip = clientIp(request);
  if (isBlocked(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e intenta de nuevo." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as { username?: string; password?: string };
    username = typeof body.username === "string" ? body.username : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Escribe tu usuario y clave." }, { status: 400 });
  }

  const user = await verifyUser(username, password);
  if (!user) {
    registerFailure(ip);
    return NextResponse.json({ error: "Usuario o clave incorrectos." }, { status: 401 });
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true, name: user.name });
  response.cookies.set(SESSION_COOKIE, createSessionValue(user.username), sessionCookieOptions);
  return response;
}
