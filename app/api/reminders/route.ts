import { NextResponse } from "next/server";
import { dbClient } from "@/lib/donations/store";
import { sendReminderEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const hits = new Map<string, { count: number; until: number }>();

function rateLimited(request: Request): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.until < now) {
    hits.set(ip, { count: 1, until: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const ref = typeof body.ref === "string" ? body.ref.trim().slice(0, 60) : "";

  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Revisa tu correo." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Necesitamos tu autorización para escribirte." },
      { status: 400 },
    );
  }

  const db = dbClient();
  if (!db) {
    return NextResponse.json({ error: "No se pudo guardar tu correo." }, { status: 503 });
  }

  try {
    const inserted = await db`
      insert into reminders (email, name, consent, source, ref_code)
      values (${email}, ${name || null}, true, 'envivo', ${ref || null})
      on conflict (lower(email)) do nothing
      returning id
    `;

    if (inserted.length) {
      await sendReminderEmail({ to: email, name, kind: "confirmation" });
    }

    return NextResponse.json({ ok: true, already: inserted.length === 0 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar tu correo." }, { status: 500 });
  }
}
