import { NextResponse } from "next/server";
import { liveReport } from "@/lib/analytics/live";
import { getConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const YOUTUBE_STUDIO =
  "https://studio.youtube.com/channel/UCrdNxBU4cfR0rEHY1OO9tQQ/analytics/tab-overview/period-default";

export async function GET() {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const [report, config] = await Promise.all([liveReport(), getConfig()]);
  let online = { raisedCop: 0, donations: 0 };
  try {
    online = await progress();
  } catch {
    // Sin base de datos el recaudo manual sigue disponible.
  }

  return NextResponse.json(
    {
      ...report,
      donations: {
        ...report.donations,
        onlineRaised: online.raisedCop,
        onlineCount: online.donations,
        manualRaised: config.totals.raised,
        totalRaised: config.totals.raised + online.raisedCop,
        goal: config.totals.goal,
      },
      youtube: {
        studioUrl: YOUTUBE_STUDIO,
        channelUrl: "https://www.youtube.com/@KavanahPL35",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
