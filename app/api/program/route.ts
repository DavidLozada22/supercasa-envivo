import { NextResponse } from "next/server";
import { readProgram } from "@/lib/program/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readProgram(), {
    headers: { "Cache-Control": "no-store" },
  });
}
