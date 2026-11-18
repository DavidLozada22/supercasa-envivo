import type { AppConfig, PublicConfig } from "./types";
import { readConfig, writeConfig } from "./store";
import { DEFAULT_EMBED_URL } from "./youtube";

export const DEFAULT_CONFIG: AppConfig = {
  stream: {
    youtubeUrl: "https://www.youtube.com/@KavanahPL35/live",
    embedUrl:
      DEFAULT_EMBED_URL,
    rtmpUrl: "rtmp://a.rtmp.youtube.com/live2",
    streamKey: "",
    backupUrl: "https://www.youtube.com/@KavanahPL35/live",
  },
  totals: {
    raised: 0,
    goal: 250_000_000,
    updatedAt: new Date(0).toISOString(),
  },
  campaign: {
    name: "Súper Navidad: 48 Horas por la Supercasa",
    hashtags: "#SuperNavidad48H #PonteLaCapa #48HorasPorLaSupercasa",
    startsAt: "",
    endsAt: "",
  },
  meta: {
    pixelId: "",
    adAccountId: "",
    campaignId: "",
  },
};

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
}

export function normalizeConfig(raw: unknown): AppConfig {
  const input = (raw ?? {}) as Record<string, any>;
  const stream = (input.stream ?? {}) as Record<string, unknown>;
  const totals = (input.totals ?? {}) as Record<string, unknown>;
  const campaign = (input.campaign ?? {}) as Record<string, unknown>;
  const meta = (input.meta ?? {}) as Record<string, unknown>;

  return {
    stream: {
      youtubeUrl: asString(stream.youtubeUrl, DEFAULT_CONFIG.stream.youtubeUrl),
      embedUrl: asString(stream.embedUrl, DEFAULT_CONFIG.stream.embedUrl),
      rtmpUrl: asString(stream.rtmpUrl, DEFAULT_CONFIG.stream.rtmpUrl),
      streamKey: asString(stream.streamKey, ""),
      backupUrl: asString(stream.backupUrl, DEFAULT_CONFIG.stream.backupUrl),
    },
    totals: {
      raised: asNumber(totals.raised, DEFAULT_CONFIG.totals.raised),
      goal: asNumber(totals.goal, DEFAULT_CONFIG.totals.goal) || DEFAULT_CONFIG.totals.goal,
      updatedAt: asString(totals.updatedAt, new Date().toISOString()),
    },
    campaign: {
      name: asString(campaign.name, DEFAULT_CONFIG.campaign.name),
      hashtags: asString(campaign.hashtags, DEFAULT_CONFIG.campaign.hashtags),
      startsAt: asString(campaign.startsAt, ""),
      endsAt: asString(campaign.endsAt, ""),
    },
    meta: {
      pixelId: asString(meta.pixelId, "").replace(/[^0-9]/g, ""),
      adAccountId: asString(meta.adAccountId, ""),
      campaignId: asString(meta.campaignId, ""),
    },
  };
}

export async function getConfig(): Promise<AppConfig> {
  const stored = await readConfig();
  return normalizeConfig(stored ?? DEFAULT_CONFIG);
}

export async function saveConfig(next: AppConfig): Promise<AppConfig> {
  const normalized = normalizeConfig({
    ...next,
    totals: { ...next.totals, updatedAt: new Date().toISOString() },
  });
  await writeConfig(normalized);
  return normalized;
}

export function toPublicConfig(config: AppConfig): PublicConfig {
  return {
    stream: {
      youtubeUrl: config.stream.youtubeUrl,
      embedUrl: config.stream.embedUrl,
      backupUrl: config.stream.backupUrl,
    },
    totals: config.totals,
    campaign: config.campaign,
    meta: { pixelId: config.meta.pixelId },
  };
}
