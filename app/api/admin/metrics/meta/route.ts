import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { fetchMetaMetrics } from "@/lib/meta";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const range = new URL(request.url).searchParams.get("range") ?? "7";
  const config = await getConfig();
  const metrics = await fetchMetaMetrics(config, range);

  return NextResponse.json(metrics, { headers: { "Cache-Control": "no-store" } });
}
