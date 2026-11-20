import { NextResponse } from "next/server";
import { apiProgramEditor } from "@/lib/permissions";
import { readProgram, writeProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await apiProgramEditor();
  if (!access.ok) {
    return NextResponse.json(
      {
        error:
          access.status === 401
            ? "No autorizado."
            : "Solo el editor del programa puede marcar segmentos.",
      },
      { status: access.status },
    );
  }

  let body: { segmentId?: unknown; done?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const segmentId = typeof body.segmentId === "string" ? body.segmentId : "";
  if (!segmentId) {
    return NextResponse.json({ error: "Falta el segmento." }, { status: 400 });
  }
  if (typeof body.done !== "boolean") {
    return NextResponse.json({ error: "Falta la marca." }, { status: 400 });
  }

  const program = await readProgram();
  if (!program.segments.some((segment) => segment.id === segmentId)) {
    return NextResponse.json({ error: "Ese segmento no existe." }, { status: 404 });
  }

  const segments = program.segments.map((segment) =>
    segment.id === segmentId ? { ...segment, done: body.done === true } : segment,
  );

  const next = await writeProgram(program.blocks, segments, access.username);

  return NextResponse.json(
    {
      segmentId,
      done: body.done === true,
      updatedAt: next.updatedAt,
      updatedBy: next.updatedBy,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
