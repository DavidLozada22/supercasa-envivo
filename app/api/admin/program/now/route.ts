import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PROGRAM_SEGMENTS } from "@/lib/program/data";
import { readProgramNow, writeProgramNow } from "@/lib/program/now";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor"] as const;

export async function GET() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await readProgramNow(), {
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

  let body: { segmentId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const raw = body.segmentId;
  const segmentId =
    raw === null || raw === "" ? null : typeof raw === "string" ? raw : undefined;

  if (segmentId === undefined) {
    return NextResponse.json({ error: "Segmento inválido." }, { status: 400 });
  }
  if (segmentId && !PROGRAM_SEGMENTS.some((segment) => segment.id === segmentId)) {
    return NextResponse.json({ error: "Ese segmento no existe." }, { status: 400 });
  }

  const session = await getSession();
  const next = await writeProgramNow({
    segmentId,
    updatedBy: session?.username ?? "",
  });
  return NextResponse.json(next, { headers: { "Cache-Control": "no-store" } });
}
