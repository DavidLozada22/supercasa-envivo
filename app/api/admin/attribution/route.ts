import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { attributionReport } from "@/lib/analytics/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  const days = Number(new URL(request.url).searchParams.get("days") ?? "30");
  const report = await attributionReport(Number.isFinite(days) ? days : 30);
  return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
}
