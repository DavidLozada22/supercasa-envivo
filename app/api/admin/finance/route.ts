import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { dbClient } from "@/lib/donations/store";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function toManual(row: Row) {
  return {
    reference: String(row.reference),
    amount: Number(row.amount_cop),
    method: row.payment_method ? String(row.payment_method) : "Bancolombia",
    note: row.notes ? String(row.notes) : "",
    createdAt: String(row.created_at),
  };
}

function toWompi(row: Row) {
  return {
    reference: String(row.reference),
    amount: Number(row.amount_cop),
    donorName: row.donor_name ? String(row.donor_name) : null,
    createdAt: String(row.created_at),
  };
}

export async function GET() {
  const access = await apiRole(["admin", "finance"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const config = await getConfig();
  const db = dbClient();
  if (!db) {
    return NextResponse.json({
      totals: { total: 0, wompi: 0, breb: 0, bancolombia: 0 },
      goal: config.totals.goal,
      manual: [],
      wompi: [],
    });
  }

  const rows = (await db`
    select reference, source, amount_cop, payment_method, donor_name, notes, created_at
    from donations
    where status = 'approved'
    order by created_at desc
    limit 500
  `) as Row[];

  let total = 0;
  let wompiTotal = 0;
  let brebTotal = 0;
  let bankTotal = 0;
  const manual: ReturnType<typeof toManual>[] = [];
  const wompi: ReturnType<typeof toWompi>[] = [];

  for (const row of rows) {
    const amount = Number(row.amount_cop) || 0;
    const source = String(row.source);
    total += amount;

    if (source === "wompi" || source === "demo") {
      wompiTotal += amount;
      wompi.push(toWompi(row));
      continue;
    }

    if (source === "manual" || source === "transfer") {
      const method = String(row.payment_method ?? "").toLowerCase();
      const note = String(row.notes ?? "").toLowerCase();
      const isBreb =
        method.includes("bre") || note.includes("bre-b") || note.includes("breb");
      if (isBreb) brebTotal += amount;
      else bankTotal += amount;
      manual.push(toManual(row));
    }
  }

  return NextResponse.json(
    {
      totals: {
        total,
        wompi: wompiTotal,
        breb: brebTotal,
        bancolombia: bankTotal,
      },
      goal: config.totals.goal,
      manual,
      wompi: wompi.slice(0, 20),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const access = await apiRole(["admin", "finance"]);
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
  const method = body.method === "breb" ? "Bre-B" : "Bancolombia";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 240) : "";
  const date =
    typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? new Date(`${body.date}T12:00:00-05:00`)
      : new Date();
  const createdAt = date.toISOString();

  if (!Number.isFinite(amount) || amount < 1_000) {
    return NextResponse.json(
      { error: "El monto mínimo es $1.000." },
      { status: 400 },
    );
  }

  const reference = `SC-F-${Date.now()}-${randomBytes(3).toString("hex")}`;

  try {
    await db`
      insert into donations (
        reference, status, source, frequency, piece_id, amount_cop, currency,
        charge_amount, fee, donor_name, donor_email, donor_phone, consent,
        show_on_wall, certificate, notes, created_by, created_at, approved_at,
        payment_method
      ) values (
        ${reference}, 'approved', 'manual', 'once', 'recaudo', ${amount}, 'COP',
        ${amount}, 0, null, null, null, true, false, null, ${note || null},
        ${`finance:${session?.username ?? "finance"}`}, ${createdAt}, ${createdAt},
        ${method}
      )
    `;
    return NextResponse.json({ ok: true, reference }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el aporte.",
      },
      { status: 500 },
    );
  }
}
