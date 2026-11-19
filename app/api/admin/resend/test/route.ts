import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sendTestEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  }

  const result = await sendTestEmail(email);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "No se pudo enviar." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
