import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { getConfig } from "@/lib/config";
import { getLiveStatus } from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export async function POST() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const config = await getConfig();
  const status = await getLiveStatus(config.stream.videoId, true);

  return NextResponse.json(
    { ...status, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
