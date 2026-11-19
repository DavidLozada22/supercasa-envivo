import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getSimulation(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  await clearSimulation();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
