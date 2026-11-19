import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { announcementHtml } from "@/lib/announcements/templates";
import {
  appendAnnouncementLog,
  readAnnouncementLog,
} from "@/lib/announcements/store";
import { dbClient } from "@/lib/donations/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_RECIPIENTS = 1000;
const CHUNK = 100;

type Recipient = { email: string; name: string | null };

async function loadAudience(): Promise<Recipient[]> {
  const db = dbClient();
  if (!db) return [];
  const rows = await db`
    select email, name from reminders
    where consent = true
    order by created_at asc
    limit ${MAX_RECIPIENTS}
  `;
  return rows.map((row: Record<string, unknown>) => ({
    email: String(row.email),
    name: row.name ? String(row.name) : null,
  }));
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const db = dbClient();
  let total = 0;
  if (db) {
    try {
      const rows = await db`select count(*)::int as total from reminders where consent = true`;
      total = Number(rows[0]?.total ?? 0);
    } catch {
      total = 0;
    }
  }

  return NextResponse.json(
    {
      audience: { total, database: Boolean(db) },
      history: await readAnnouncementLog(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Falta RESEND_API_KEY en el servidor." },
      { status: 503 },
    );
  }

  let body: {
    kind?: string;
    subject?: string;
    message?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const kind = (body.kind ?? "libre").slice(0, 40);
  const subject = (body.subject ?? "").trim().slice(0, 140);
  const message = (body.message ?? "").trim().slice(0, 2000);
  const ctaLabel = (body.ctaLabel ?? "").trim().slice(0, 60) || "Entrar al live";
  const rawCta = (body.ctaUrl ?? "").trim();
  const ctaUrl = /^https?:\/\//.test(rawCta) ? rawCta : "https://supercasa.svgvisual.com/envivo";

  if (subject.length < 4) {
    return NextResponse.json({ error: "El asunto es demasiado corto." }, { status: 400 });
  }
  if (message.length < 12) {
    return NextResponse.json({ error: "El mensaje es demasiado corto." }, { status: 400 });
  }

  const history = await readAnnouncementLog();
  const recent = history.find(
    (entry) =>
      entry.subject === subject &&
      Date.now() - Date.parse(entry.at) < 2 * 60 * 1000,
  );
  if (recent) {
    return NextResponse.json(
      { error: "Ese mismo asunto se envió hace menos de dos minutos. Revisa el historial." },
      { status: 409 },
    );
  }

  const audience = await loadAudience();
  if (audience.length === 0) {
    return NextResponse.json(
      { error: "No hay correos inscritos con consentimiento." },
      { status: 409 },
    );
  }

  const from =
    process.env.RESEND_FROM || "La Supercasa <hola@supercasa.svgvisual.com>";

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < audience.length; index += CHUNK) {
    const chunk = audience.slice(index, index + CHUNK);
    const payload = chunk.map((recipient) => ({
      from,
      to: [recipient.email],
      subject,
      html: announcementHtml(
        { subject, message, ctaLabel, ctaUrl },
        recipient.name,
      ),
    }));

    try {
      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = (await response.json()) as { data?: unknown[] };
        sent += data.data?.length ?? chunk.length;
      } else {
        failed += chunk.length;
      }
    } catch {
      failed += chunk.length;
    }

    if (index + CHUNK < audience.length) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
  }

  await appendAnnouncementLog({
    at: new Date().toISOString(),
    kind,
    subject,
    audience: audience.length,
    sent,
    failed,
  });

  return NextResponse.json({
    sent,
    failed,
    total: audience.length,
    remaining: 0,
  });
}
