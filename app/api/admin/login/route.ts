import { NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionValue, sessionCookieOptions, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Clave incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  return response;
}
