import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { attributionReport } from "@/lib/analytics/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const days = Number(new URL(request.url).searchParams.get("days") ?? "30");
  const report = await attributionReport(Number.isFinite(days) ? days : 30);
  return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
}
