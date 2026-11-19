import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getOnAir,
  rotateOverlayToken,
  setOnAir,
} from "@/lib/streaming/service";
import { getScene } from "@/lib/streaming/scenes";
import type { OnAirFields } from "@/lib/streaming/types";

export const dynamic = "force-dynamic";

const FIELD_KEYS: Array<keyof OnAirFields> = [
  "title",
  "subtitle",
  "note",
  "guest",
  "guestRole",
  "returnAt",
];

function cleanFields(raw: unknown): OnAirFields {
  const input = (raw ?? {}) as Record<string, unknown>;
  const fields: OnAirFields = {};
  for (const key of FIELD_KEYS) {
    const value = input[key];
    if (typeof value === "string") fields[key] = value.trim().slice(0, 240);
  }
  return fields;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getOnAir(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: { sceneId?: string; fields?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const sceneId = typeof body.sceneId === "string" ? body.sceneId : "";
  const scene = getScene(sceneId);
  if (!scene) {
    return NextResponse.json({ error: "Esa cortina no existe." }, { status: 400 });
  }

  const state = await setOnAir({ sceneId, fields: cleanFields(body.fields) });
  return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await rotateOverlayToken(), {
    headers: { "Cache-Control": "no-store" },
  });
}
