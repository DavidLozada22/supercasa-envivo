import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ProgramValidationError,
  readProgram,
  resetProgram,
  writeProgram,
} from "@/lib/program/store";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor", "marketing"] as const;

export async function GET() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await readProgram(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  let body: { blocks?: unknown; segments?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const session = await getSession();
  try {
    const program = await writeProgram(
      Array.isArray(body.blocks) ? body.blocks : [],
      Array.isArray(body.segments) ? body.segments : [],
      session?.username ?? "",
    );
    return NextResponse.json(program, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ProgramValidationError) {
      return NextResponse.json(
        { error: "Revisa los campos marcados.", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "No se pudo guardar el programa." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  let body: { reset?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (body.reset !== true) {
    return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
  }

  const session = await getSession();
  const program = await resetProgram(session?.username ?? "");
  return NextResponse.json(program, { headers: { "Cache-Control": "no-store" } });
}
