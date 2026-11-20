import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiRole } from "@/lib/permissions";
import {
  readStreamingContent,
  writeStreamingContent,
  type SceneOverride,
  type StreamingContent,
} from "@/lib/streaming/content";
import { CALVITOS, SCENES, type CalvitoKey, type SceneAccent } from "@/lib/streaming/scenes";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor", "marketing"] as const;
const ACCENTS: SceneAccent[] = ["fuchsia", "lime", "yellow", "cyan"];
const TEXT_KEYS = [
  "eyebrow",
  "title",
  "subtitle",
  "note",
  "cta",
  "countValue",
  "countUnit",
] as const;

function cleanOverride(raw: unknown): SceneOverride | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const override: SceneOverride = {};

  for (const key of TEXT_KEYS) {
    if (typeof input[key] === "string") {
      override[key] = (input[key] as string).slice(0, 300);
    }
  }
  if (ACCENTS.includes(input.accent as SceneAccent)) {
    override.accent = input.accent as SceneAccent;
  }
  if (input.illustration === null) {
    override.illustration = null;
  } else if (CALVITOS.includes(input.illustration as CalvitoKey)) {
    override.illustration = input.illustration as CalvitoKey;
  }
  if (input.illustrationCluster === null) {
    override.illustrationCluster = null;
  } else if (Array.isArray(input.illustrationCluster)) {
    const cluster = input.illustrationCluster
      .filter((item): item is CalvitoKey => CALVITOS.includes(item as CalvitoKey))
      .slice(0, 3);
    override.illustrationCluster = cluster.length ? cluster : null;
  }

  return override;
}

export async function GET() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await readStreamingContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }

  let body: { scenes?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const allowedIds = new Set(SCENES.map((scene) => scene.id));
  const scenes: StreamingContent["scenes"] = {};
  if (body.scenes && typeof body.scenes === "object") {
    for (const [sceneId, raw] of Object.entries(
      body.scenes as Record<string, unknown>,
    )) {
      if (!allowedIds.has(sceneId)) continue;
      const override = cleanOverride(raw);
      if (override) scenes[sceneId] = override;
    }
  }

  const session = await getSession();
  const content = await writeStreamingContent({
    scenes,
    updatedAt: "",
    updatedBy: session?.username ?? "",
  });

  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}
