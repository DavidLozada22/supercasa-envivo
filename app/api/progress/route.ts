import { NextResponse } from "next/server";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const totals = await progress();
  return NextResponse.json(totals, { headers: { "Cache-Control": "no-store" } });
}
