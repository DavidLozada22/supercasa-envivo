import { NextResponse } from "next/server";
import { processEvent } from "@/lib/donations/service";
import type { WompiEvent } from "@/lib/donations/wompi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let event: WompiEvent;
  try {
    event = (await request.json()) as WompiEvent;
  } catch {
    return NextResponse.json({ ok: false, reason: "json inválido" }, { status: 400 });
  }

  try {
    const result = await processEvent(event);
    return NextResponse.json(result, { status: result.ok ? 200 : 401 });
  } catch (error) {
    console.error("[supercasa] webhook wompi", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
