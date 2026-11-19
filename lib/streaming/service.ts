import { randomBytes } from "node:crypto";
import { liveState } from "@/lib/live";
import {
  DEFAULT_CHANNEL_ID,
  liveSnapshot,
  resolveLiveStatus,
  type LiveSnapshot,
  type LiveStatus,
} from "@/lib/youtube/live";
import { readJson, writeJson } from "./store";
import type { OnAirFields, OnAirState } from "./types";

export type { OnAirFields, OnAirState } from "./types";

const LIVE_KEY = "supercasa/streaming/live-status.json";
const ON_AIR_KEY = "supercasa/streaming/onair.json";
const SIM_KEY = "supercasa/streaming/simulation.json";
const MEMORY_TTL = 10_000;

export type Simulation = {
  videoId: string;
  until: string;
  fromVideoId: string | null;
  createdAt: string;
};

let memory: { status: LiveStatus; at: number } | null = null;
let inflight: Promise<LiveStatus> | null = null;

function channelId(): string {
  return process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;
}

function apiKey(): string {
  return process.env.YOUTUBE_API_KEY || "";
}

export async function readLiveStatus(): Promise<LiveStatus | null> {
  if (memory) return memory.status;
  return readJson<LiveStatus>(LIVE_KEY);
}

export async function getLiveStatus(fallbackId: string, force = false): Promise<LiveStatus> {
  if (!force) {
    if (memory && Date.now() - memory.at < MEMORY_TTL) return memory.status;
    const cached = await readJson<LiveStatus>(LIVE_KEY);
    if (cached && Date.now() - Date.parse(cached.checkedAt) < MEMORY_TTL) {
      memory = { status: cached, at: Date.now() };
      return cached;
    }
  }

  if (inflight) return inflight;

  inflight = (async () => {
    const last = force ? (memory?.status ?? (await readJson<LiveStatus>(LIVE_KEY))) : await readJson<LiveStatus>(LIVE_KEY);
    const next = await resolveLiveStatus({ last, fallbackId });
    memory = { status: next, at: Date.now() };
    await writeJson(LIVE_KEY, next).catch(() => undefined);
    return next;
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}

export function snapshot(status: LiveStatus): LiveSnapshot {
  const state = liveState();
  return liveSnapshot(status, state);
}

export async function getSimulation(): Promise<Simulation | null> {
  const value = await readJson<Simulation>(SIM_KEY);
  if (!value) return null;
  if (Date.parse(value.until) <= Date.now()) return null;
  return value;
}

export async function setSimulation(videoId: string, seconds: number, fromVideoId: string | null): Promise<Simulation> {
  const safe = Math.max(15, Math.min(120, Math.round(seconds)));
  const value: Simulation = {
    videoId,
    fromVideoId,
    until: new Date(Date.now() + safe * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  await writeJson(SIM_KEY, value);
  return value;
}

export async function clearSimulation(): Promise<void> {
  await writeJson(SIM_KEY, { videoId: "", until: new Date(0).toISOString(), createdAt: new Date(0).toISOString(), fromVideoId: null });
}

export async function recentChannelVideos(count = 5): Promise<string[]> {
  const key = apiKey();
  if (!key) return [];
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId());
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(Math.max(1, Math.min(10, count))));
    const response = await fetch(url, {
      headers: { "X-Goog-Api-Key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { items?: Array<{ id?: { videoId?: string } }> };
    return (data.items ?? [])
      .map((item) => item.id?.videoId ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function simulationVideo(excludeId: string | null): Promise<string> {
  const ids = await recentChannelVideos(5);
  return ids.find((id) => id && id !== excludeId) ?? "";
}

function newToken(): string {
  return randomBytes(16).toString("hex");
}

export async function getOnAir(): Promise<OnAirState> {
  const stored = await readJson<OnAirState>(ON_AIR_KEY);
  if (stored) {
    if (!stored.token) {
      const withToken = { ...stored, token: newToken() };
      await writeJson(ON_AIR_KEY, withToken).catch(() => undefined);
      return withToken;
    }
    return stored;
  }
  const initial: OnAirState = {
    sceneId: "ya-volvemos",
    fields: {},
    token: newToken(),
    updatedAt: new Date(0).toISOString(),
  };
  await writeJson(ON_AIR_KEY, initial).catch(() => undefined);
  return initial;
}

export async function setOnAir(input: { sceneId: string; fields: OnAirFields }): Promise<OnAirState> {
  const current = await getOnAir();
  const next: OnAirState = {
    sceneId: input.sceneId,
    fields: input.fields,
    token: current.token,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(ON_AIR_KEY, next);
  return next;
}

export async function rotateOverlayToken(): Promise<OnAirState> {
  const current = await getOnAir();
  const next: OnAirState = {
    ...current,
    token: newToken(),
    updatedAt: new Date().toISOString(),
  };
  await writeJson(ON_AIR_KEY, next);
  return next;
}

export async function isOnAirToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const state = await getOnAir();
  return Boolean(state.token) && state.token === token;
}
