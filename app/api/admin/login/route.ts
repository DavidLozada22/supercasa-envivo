import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionValue,
  sessionCookieOptions,
} from "@/lib/auth";
import { verifyUser } from "@/lib/users";

export async function POST(request: Request) {
  let username = "";
  let password = "";

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
    return NextResponse.json({ error: "Usuario o clave incorrectos." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, name: user.name });
  response.cookies.set(SESSION_COOKIE, createSessionValue(user.username), sessionCookieOptions);
  return response;
}
