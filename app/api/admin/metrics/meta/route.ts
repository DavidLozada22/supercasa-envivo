import { NextResponse } from "next/server";
import { apiRole } from "@/lib/permissions";
import { getConfig } from "@/lib/config";
import { fetchMetaMetrics } from "@/lib/meta";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await apiRole(["admin", "editor"]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  const range = new URL(request.url).searchParams.get("range") ?? "7";
  const config = await getConfig();
  const metrics = await fetchMetaMetrics(config, range);

  return NextResponse.json(metrics, { headers: { "Cache-Control": "no-store" } });
}
