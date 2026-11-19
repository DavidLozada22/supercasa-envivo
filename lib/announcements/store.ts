import { readJson, writeJson } from "@/lib/streaming/store";

const KEY = "supercasa/announcements.json";

export type AnnouncementLogEntry = {
  at: string;
  kind: string;
  subject: string;
  audience: number;
  sent: number;
  failed: number;
};

export async function readAnnouncementLog(): Promise<AnnouncementLogEntry[]> {
  const value = await readJson<AnnouncementLogEntry[]>(KEY);
  return Array.isArray(value) ? value : [];
}

export async function appendAnnouncementLog(entry: AnnouncementLogEntry): Promise<void> {
  const current = await readAnnouncementLog();
  await writeJson(KEY, [entry, ...current].slice(0, 60));
}
