import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { dbClient } from "@/lib/donations/store";
import { resendHealth } from "@/lib/resend";
import { getLiveStatus, getOnAir, getSimulation } from "@/lib/streaming/service";
import { hasBlobStorage } from "@/lib/streaming/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const config = await getConfig();
  const [status, onair, resend, simulation] = await Promise.all([
    getLiveStatus(config.stream.videoId),
    getOnAir(),
    resendHealth(),
    getSimulation(),
  ]);

  const db = dbClient();

  return NextResponse.json(
    {
      youtube: {
        keyPresent: Boolean(process.env.YOUTUBE_API_KEY),
        channelUrl: "https://www.youtube.com/@KavanahPL35",
        ...status,
      },
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
