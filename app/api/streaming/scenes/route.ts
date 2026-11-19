import { NextResponse } from "next/server";
import { SCENES } from "@/lib/streaming/scenes";

export const revalidate = 300;

export async function GET() {
  return NextResponse.json(
    SCENES.map((scene) => ({
      id: scene.id,
      label: scene.label,
      kind: scene.kind,
      group: scene.group ?? "generic",
    })),
  );
}
