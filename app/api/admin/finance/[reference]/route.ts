import { NextResponse } from "next/server";
import { dbClient } from "@/lib/donations/store";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const access = await apiRole(["admin", "finance"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const db = dbClient();
  if (!db) {
    return NextResponse.json({ error: "Sin base de datos." }, { status: 503 });
  }

  const { reference } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const amount = Math.round(Number(body.amount));
  const method = body.method === "breb" ? "Bre-B" : "Bancolombia";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 240) : "";

  if (!Number.isFinite(amount) || amount < 1_000) {
    return NextResponse.json(
      { error: "El monto mínimo es $1.000." },
      { status: 400 },
    );
  }

  try {
    const rows = await db`
      update donations
      set amount_cop = ${amount},
          charge_amount = ${amount},
          payment_method = ${method},
          notes = ${note || null}
      where reference = ${reference}
        and source in ('manual', 'transfer')
      returning reference
    `;
    if (!rows.length) {
      return NextResponse.json(
        { error: "Ese aporte no existe o no es manual." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el aporte.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const access = await apiRole(["admin", "finance"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const db = dbClient();
  if (!db) {
    return NextResponse.json({ error: "Sin base de datos." }, { status: 503 });
  }

  const { reference } = await params;

  try {
    const rows = await db`
      delete from donations
      where reference = ${reference}
        and source in ('manual', 'transfer')
      returning reference
    `;
    if (!rows.length) {
      return NextResponse.json(
        { error: "Ese aporte no existe o no es manual." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo borrar el aporte.",
      },
      { status: 500 },
    );
  }
}
