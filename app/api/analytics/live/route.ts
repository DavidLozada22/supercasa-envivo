import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isBotUserAgent, recordLiveEvent } from "@/lib/analytics/live";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (isBotUserAgent(request.headers.get("user-agent"))) {
      return new NextResponse(null, { status: 204 });
    }

    // El equipo no cuenta como audiencia.
    const session = await getSession();
    if (session) return new NextResponse(null, { status: 204 });

    const body = (await request.json()) as {
      visitorId?: unknown;
      path?: unknown;
      kind?: unknown;
    };
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
    const path = typeof body.path === "string" ? body.path : "";
    const kind = body.kind === "view" ? "view" : "ping";

    if (visitorId && path) {
      await recordLiveEvent({ visitorId, path, kind });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
