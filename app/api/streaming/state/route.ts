import { NextResponse } from "next/server";
import { getOnAir, isOnAirToken } from "@/lib/streaming/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("k");
  if (!(await isOnAirToken(token))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getOnAir(), {
    headers: { "Cache-Control": "no-store" },
  });
}
