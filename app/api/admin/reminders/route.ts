import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { dbClient } from "@/lib/donations/store";
import { sendReminderEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

export async function GET() {
  const access = await apiRole(["admin", "editor", "marketing"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  const db = dbClient();
  if (!db) return NextResponse.json({ reminders: [] });

  const rows = await db`select * from reminders order by created_at desc limit 500`;
  return NextResponse.json(
    {
      reminders: rows.map((row: Row) => ({
        id: String(row.id),
        email: String(row.email),
        name: row.name ? String(row.name) : null,
        createdAt: String(row.created_at),
        sentAt: row.sent_at ? String(row.sent_at) : null,
        ref: row.ref_code ? String(row.ref_code) : null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  const access = await apiRole(["admin", "editor", "marketing"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  const db = dbClient();
  if (!db) return NextResponse.json({ error: "Sin base de datos." }, { status: 503 });

  const pending = await db`
    select id, email, name from reminders
    where sent_at is null
    order by created_at asc
    limit 100
  `;

  let sent = 0;
  let failed = 0;
  let lastError = "";

  for (const row of pending) {
    const result = await sendReminderEmail({
      to: String(row.email),
      name: row.name ? String(row.name) : null,
      kind: "reminder",
    });
    if (result.ok) {
      await db`update reminders set sent_at = now() where id = ${row.id}`;
      sent += 1;
    } else {
      failed += 1;
      lastError = result.error ?? "Error de envío";
    }
  }

  return NextResponse.json({ sent, failed, error: failed ? lastError : null });
}
