import { NextResponse } from "next/server";
import { readStreamingContent } from "@/lib/streaming/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readStreamingContent();
  return NextResponse.json(
    { scenes: content.scenes, copy: content.copy, updatedAt: content.updatedAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
