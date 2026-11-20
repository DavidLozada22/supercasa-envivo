import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { AD_CREATIVES } from "@/lib/marketing/campaign-kit";
import {
  readMarketingState,
  writeMarketingState,
} from "@/lib/marketing/store";
import type {
  AccentColor,
  CreativeEdit,
  MarketingState,
  SlideEdit,
} from "@/lib/marketing/types";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor", "marketing"] as const;
const TEXT_KEYS = [
  "kicker",
  "headline",
  "speechBubble",
  "body",
  "giantNumber",
  "urlText",
  "urlLabel",
  "characterImage",
  "fullSceneImage",
] as const;
const ACCENTS: AccentColor[] = ["magenta", "lime", "yellow", "cyan"];

function text(value: unknown, max = 600): string | undefined {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

function cleanRows(
  raw: unknown,
  keys: [string, string, string],
): Array<Record<string, string>> | undefined {
  if (!Array.isArray(raw)) return undefined;
  const rows: Array<Record<string, string>> = [];
  for (const item of raw.slice(0, 12)) {
    if (!item || typeof item !== "object") continue;
    const source = item as Record<string, unknown>;
    const row: Record<string, string> = {};
    for (const key of keys) {
      if (typeof source[key] === "string") row[key] = (source[key] as string).slice(0, 160);
    }
    if (Object.keys(row).length > 0) rows.push(row);
  }
  return rows;
}

function cleanEdit(raw: unknown): CreativeEdit | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const edit: CreativeEdit = { slides: {} };

  if (input.theme === "cortina" || input.theme === "calvito") edit.theme = input.theme;
  if (input.aspect === "9:16" || input.aspect === "4:5" || input.aspect === "1:1") {
    edit.aspect = input.aspect;
  }
  if (input.qrTarget === "live" || input.qrTarget === "donate") {
    edit.qrTarget = input.qrTarget;
  }
  if (typeof input.showQr === "boolean") edit.showQr = input.showQr;
  if (typeof input.caption === "string") edit.caption = input.caption.slice(0, 2000);
  for (const key of ["hoursValue", "kickHandle", "creatorHandle"] as const) {
    if (typeof input[key] === "string") {
      edit[key] = (input[key] as string).slice(0, 80);
    }
  }

  const slides = input.slides;
  if (slides && typeof slides === "object") {
    for (const [slideId, rawSlide] of Object.entries(slides as Record<string, unknown>)) {
      if (!rawSlide || typeof rawSlide !== "object") continue;
      const source = rawSlide as Record<string, unknown>;
      const slide: SlideEdit = {};
      for (const key of TEXT_KEYS) {
        const value = text(source[key]);
        if (value !== undefined) slide[key] = value;
      }
      if (ACCENTS.includes(source.accentColor as AccentColor)) {
        slide.accentColor = source.accentColor as AccentColor;
      }
      if (typeof source.showQr === "boolean") slide.showQr = source.showQr;
      if (typeof source.showProgressBar === "boolean") {
        slide.showProgressBar = source.showProgressBar;
      }
      if (typeof source.progressPercent === "number" && Number.isFinite(source.progressPercent)) {
        slide.progressPercent = Math.max(0, Math.min(100, Math.round(source.progressPercent)));
      }
      const schedule = cleanRows(source.scheduleRows, ["time", "title", "host"]);
      if (schedule) slide.scheduleRows = schedule as SlideEdit["scheduleRows"];
      const tiers = cleanRows(source.tierRows, ["label", "amount", "note"]);
      if (tiers) slide.tierRows = tiers as SlideEdit["tierRows"];
      edit.slides[slideId] = slide;
    }
  }

  return edit;
}

export async function GET() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
      { status: access.status },
    );
  }
  return NextResponse.json(await readMarketingState(), {
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

  let body: { edits?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const allowedIds = new Set(AD_CREATIVES.map((creative) => creative.id));
  const edits: MarketingState["edits"] = {};
  const rawEdits = body.edits;
  if (rawEdits && typeof rawEdits === "object") {
    for (const [creativeId, raw] of Object.entries(rawEdits as Record<string, unknown>)) {
      if (!allowedIds.has(creativeId)) continue;
      const edit = cleanEdit(raw);
      if (edit) edits[creativeId] = edit;
    }
  }

  const session = await getSession();
  const state = await writeMarketingState({
    edits,
    updatedAt: "",
    updatedBy: session?.username ?? "",
  });

  return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
}
