import { NextResponse } from "next/server";
import {
  ProgramValidationError,
  readProgram,
  resetProgram,
  writeProgram,
} from "@/lib/program/store";
import { apiProgramEditor } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function denied(status: 401 | 403) {
  return NextResponse.json(
    { error: status === 401 ? "No autorizado." : "Solo el editor del programa puede hacer esto." },
    { status },
  );
}

export async function GET() {
  const access = await apiProgramEditor();
  if (!access.ok) return denied(access.status);
  return NextResponse.json(await readProgram(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const access = await apiProgramEditor();
  if (!access.ok) return denied(access.status);

  let body: { blocks?: unknown; segments?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  try {
    const program = await writeProgram(
      Array.isArray(body.blocks) ? body.blocks : [],
      Array.isArray(body.segments) ? body.segments : [],
      access.username,
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
  const access = await apiProgramEditor();
  if (!access.ok) return denied(access.status);

  let body: { reset?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (body.reset !== true) {
    return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
  }

  const program = await resetProgram(access.username);
  return NextResponse.json(program, { headers: { "Cache-Control": "no-store" } });
}
