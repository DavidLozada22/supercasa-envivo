import { NextResponse } from "next/server";
import { insertVisit } from "@/lib/analytics/store";
import { normalizeAttribution } from "@/lib/attribution";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      path?: string;
      referrer?: string;
      attribution?: unknown;
    };
    if (!body.sessionId || !body.path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await insertVisit({
      sessionId: body.sessionId,
      path: body.path,
      referrer: body.referrer ?? null,
      attribution: normalizeAttribution(body.attribution),
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
