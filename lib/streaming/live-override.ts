import { readJson, writeJson } from "./store";

const KEY = "supercasa/streaming/live-override.json";

export type LiveOverride = {
  videoId: string;
  updatedAt: string;
  updatedBy: string;
};

export async function readLiveOverride(): Promise<LiveOverride | null> {
  const value = await readJson<LiveOverride>(KEY);
  if (!value || typeof value.videoId !== "string" || !value.videoId) return null;
  return {
    videoId: value.videoId,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
    updatedBy: typeof value.updatedBy === "string" ? value.updatedBy : "",
  };
}

export async function writeLiveOverride(
  videoId: string,
  updatedBy: string,
): Promise<LiveOverride> {
  const next: LiveOverride = {
    videoId,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await writeJson(KEY, next);
  return next;
}

export async function clearLiveOverride(updatedBy: string): Promise<void> {
  await writeJson(KEY, {
    videoId: "",
    updatedAt: new Date().toISOString(),
    updatedBy,
  });
}
