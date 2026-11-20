import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiRole } from "@/lib/permissions";
import {
  readStreamingContent,
  writeStreamingContent,
  type SceneOverride,
  type StreamingContent,
  type StreamingCopy,
} from "@/lib/streaming/content";
import { CALVITOS, SCENES, type CalvitoKey, type SceneAccent, type SceneQrTarget } from "@/lib/streaming/scenes";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor", "marketing"] as const;
const ACCENTS: SceneAccent[] = ["fuchsia", "lime", "yellow", "cyan"];
const QR_TARGETS: SceneQrTarget[] = ["donate", "live"];
const TEXT_KEYS = [
  "eyebrow",
  "title",
  "subtitle",
  "note",
  "cta",
  "badge",
  "countValue",
  "countUnit",
  "guest",
  "guestRole",
  "returnAt",
  "progressCaption",
] as const;

function cleanCopy(raw: unknown): StreamingCopy | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const copy: StreamingCopy = {};
  const keys = [
    "donateUrl",
    "liveUrl",
    "breB",
    "bank",
    "hashtag",
    "igFsv",
    "igKav",
  ] as const;
  for (const key of keys) {
    if (typeof input[key] === "string") {
      copy[key] = (input[key] as string).slice(0, 240);
    }
  }
  return copy;
}

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
  if (QR_TARGETS.includes(input.qrTarget as SceneQrTarget)) {
    override.qrTarget = input.qrTarget as SceneQrTarget;
  }
  if (typeof input.progressLive === "boolean") {
    override.progressLive = input.progressLive;
  }
  if (typeof input.progressPercent === "number" && Number.isFinite(input.progressPercent)) {
    override.progressPercent = Math.max(0, Math.min(100, Math.round(input.progressPercent)));
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

  let body: { scenes?: unknown; copy?: unknown };
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

  const current = await readStreamingContent();
  const copy = body.copy === undefined ? current.copy : cleanCopy(body.copy) ?? {};

  const session = await getSession();
  const content = await writeStreamingContent({
    scenes,
    copy,
    updatedAt: "",
    updatedBy: session?.username ?? "",
  });

  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}
