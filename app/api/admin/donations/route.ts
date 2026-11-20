import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbClient } from "@/lib/donations/store";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function toDonation(row: Row) {
  return {
    reference: String(row.reference),
    createdAt: String(row.created_at),
    status: String(row.status),
    source: String(row.source),
    pieceId: String(row.piece_id),
    amountCop: Number(row.amount_cop),
    donorName: row.donor_name ? String(row.donor_name) : null,
    donorEmail: row.donor_email ? String(row.donor_email) : null,
    donorPhone: row.donor_phone ? String(row.donor_phone) : null,
    paymentMethod: row.payment_method ? String(row.payment_method) : null,
    statusMessage: row.status_message ? String(row.status_message) : null,
    notes: row.notes ? String(row.notes) : null,
    attribution: row.attribution ?? null,
    certificate: row.certificate ?? null,
    showOnWall: Boolean(row.show_on_wall),
  };
}

export async function GET(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const db = dbClient();
  if (!db) return NextResponse.json({ donations: [] });

  const status = new URL(request.url).searchParams.get("status") ?? "all";
  const rows =
    status === "all"
      ? await db`select * from donations order by created_at desc limit 200`
      : await db`select * from donations where status = ${status} order by created_at desc limit 200`;

  return NextResponse.json(
    { donations: rows.map((row) => toDonation(row as Row)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const db = dbClient();
  if (!db) {
    return NextResponse.json(
      { error: "La base de datos no está conectada." },
      { status: 503 },
    );
  }

  const session = await getSession();
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const amount = Math.round(Number(body.amount));
  const donorName = typeof body.donorName === "string" ? body.donorName.trim().slice(0, 80) : "";
  const donorEmail = typeof body.donorEmail === "string" ? body.donorEmail.trim().toLowerCase().slice(0, 254) : "";
  const donorPhone = typeof body.donorPhone === "string" ? body.donorPhone.trim().slice(0, 20) : "";
  const method = typeof body.method === "string" ? body.method.slice(0, 40) : "manual";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 300) : "";

  if (!Number.isFinite(amount) || amount < 1_000) {
    return NextResponse.json({ error: "El monto mínimo es $1.000." }, { status: 400 });
  }
  if (!donorName && !donorEmail) {
    return NextResponse.json({ error: "Escribe el nombre o el correo del donante." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Confirma que la persona autorizó el registro de sus datos." },
      { status: 400 },
    );
  }

  const reference = `SC-M-${Date.now()}-${randomBytes(3).toString("hex")}`;
  const source = method === "transfer" ? "transfer" : "manual";

  try {
    const rows = await db`
      insert into donations (
        reference, status, source, frequency, piece_id, amount_cop, currency,
        charge_amount, fee, donor_name, donor_email, donor_phone, consent,
        show_on_wall, certificate, notes, created_by, approved_at, payment_method
      ) values (
        ${reference}, 'approved', ${source}, 'once', 'manual', ${amount}, 'COP',
        ${amount}, 0, ${donorName || null}, ${donorEmail || null}, ${donorPhone || null}, true,
        false, null, ${notes || null}, ${`admin:${session?.username ?? "admin"}`}, now(), ${method || null}
      )
      returning *
    `;
    return NextResponse.json({ donation: toDonation(rows[0] as Row) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo registrar el aporte." },
      { status: 500 },
    );
  }
}
