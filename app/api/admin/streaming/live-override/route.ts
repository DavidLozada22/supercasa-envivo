import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiRole } from "@/lib/permissions";
import { clearLiveOverride, writeLiveOverride } from "@/lib/streaming/live-override";
import { forgetLiveOverride } from "@/lib/streaming/service";
import { parseVideoId } from "@/lib/youtube/live";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor"] as const;
const INVALID = "Pega un link de YouTube o el ID de 11 caracteres.";

export async function POST(request: Request) {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  let body: { url?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const videoId = parseVideoId(typeof body.url === "string" ? body.url : "");
  if (!videoId) {
    return NextResponse.json({ error: INVALID }, { status: 400 });
  }

  const session = await getSession();
  const override = await writeLiveOverride(videoId, session?.username ?? "");
  forgetLiveOverride();

  return NextResponse.json(
    { ok: true, override },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const session = await getSession();
  await clearLiveOverride(session?.username ?? "");
  forgetLiveOverride();

  return NextResponse.json(
    { ok: true, override: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
