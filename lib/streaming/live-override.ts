import { readJson, writeJson } from "./store";
import { clearOverrideRow, readOverrideRow, writeOverrideRow } from "./override-db";

const KEY = "supercasa/streaming/live-override.json";

export type LiveOverride = {
  videoId: string;
  updatedAt: string;
  updatedBy: string;
};

function normalize(value: unknown): LiveOverride | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.videoId !== "string" || !row.videoId) return null;
  return {
    videoId: row.videoId,
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : "",
    updatedBy: typeof row.updatedBy === "string" ? row.updatedBy : "",
  };
}

/**
 * El link manual vive en Postgres. El Blob del proyecto quedó suspendido y
 * por eso el panel respondía "Error de conexión al guardar el link".
 */
export async function readLiveOverride(): Promise<LiveOverride | null> {
  const fromDb = await readOverrideRow();
  if (fromDb) return fromDb;
  return normalize(await readJson<LiveOverride>(KEY));
}

export async function writeLiveOverride(
  videoId: string,
  updatedBy: string,
): Promise<LiveOverride> {
  const saved = await writeOverrideRow(videoId, updatedBy);
  if (saved) return saved;

  const next: LiveOverride = {
    videoId,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await writeJson(KEY, next);
  return next;
}

export async function clearLiveOverride(updatedBy: string): Promise<void> {
  if (await clearOverrideRow(updatedBy)) return;
  await writeJson(KEY, {
    videoId: "",
    updatedAt: new Date().toISOString(),
    updatedBy,
  });
}
