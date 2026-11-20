import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { getConfig } from "@/lib/config";
import {
  clearSimulation,
  getLiveStatus,
  getSimulation,
  setSimulation,
  simulationVideo,
} from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await getSimulation(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  let seconds = 60;
  try {
    const body = (await request.json()) as { seconds?: number };
    if (Number.isFinite(body?.seconds)) seconds = Number(body.seconds);
  } catch {
    // Sin cuerpo usa 60 segundos.
  }

  const config = await getConfig();
  const status = await getLiveStatus(config.stream.videoId);
  const target = await simulationVideo(status.videoId || null);

  if (!target) {
    return NextResponse.json(
      { error: "No encontré un video de referencia en el canal para el simulacro." },
      { status: 409 },
    );
  }

  const simulation = await setSimulation(target, seconds, status.videoId || null);
  return NextResponse.json(simulation, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function DELETE() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  await clearSimulation();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
