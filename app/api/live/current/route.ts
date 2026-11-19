import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { getLiveStatus, getSimulation, snapshot } from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfig();
  const status = await getLiveStatus(config.stream.videoId);
  const snap = snapshot(status);

  if (await isAuthenticated()) {
    const simulation = await getSimulation();
    if (simulation?.videoId) {
      return NextResponse.json(
        {
          ...snap,
          videoId: simulation.videoId,
          live: true,
          source: "manual",
          simulatedUntil: simulation.until,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  return NextResponse.json(snap, {
    headers: { "Cache-Control": "no-store" },
  });
}
