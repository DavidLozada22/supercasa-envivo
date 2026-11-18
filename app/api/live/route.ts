import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfig();

  let online = { raisedCop: 0, donations: 0 };
  try {
    online = await progress();
  } catch {
    // Sin base de datos el recaudo manual sigue funcionando.
  }

  return NextResponse.json(
    {
      raised: config.totals.raised + online.raisedCop,
      goal: config.totals.goal,
      updatedAt: config.totals.updatedAt,
      online,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
