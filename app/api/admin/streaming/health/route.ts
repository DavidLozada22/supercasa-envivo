import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { getConfig } from "@/lib/config";
import { dbClient } from "@/lib/donations/store";
import { resendHealth } from "@/lib/resend";
import { getLiveStatus, getOnAir, getSimulation } from "@/lib/streaming/service";
import { readLiveOverride } from "@/lib/streaming/live-override";
import { hasBlobStorage } from "@/lib/streaming/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const config = await getConfig();
  const [status, onair, resend, simulation, override] = await Promise.all([
    getLiveStatus(config.stream.videoId),
    getOnAir(),
    resendHealth(),
    getSimulation(),
    readLiveOverride(),
  ]);

  const db = dbClient();

  return NextResponse.json(
    {
      youtube: {
        keyPresent: Boolean(process.env.YOUTUBE_API_KEY),
        channelUrl: "https://www.youtube.com/@KavanahPL35",
        ...status,
      },
      override,
      resend,
      onair,
      simulation,
      capabilities: {
        blob: hasBlobStorage(),
        database: Boolean(db),
      },
      now: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
