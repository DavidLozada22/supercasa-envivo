import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(
    {
      raised: config.totals.raised,
      goal: config.totals.goal,
      updatedAt: config.totals.updatedAt,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
