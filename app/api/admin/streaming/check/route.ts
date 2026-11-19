import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { getLiveStatus } from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const config = await getConfig();
  const status = await getLiveStatus(config.stream.videoId, true);

  return NextResponse.json(
    { ...status, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
