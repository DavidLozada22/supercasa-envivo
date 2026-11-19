export const LIVE_START = new Date("2026-11-20T18:00:00-05:00");
export const LIVE_END = new Date("2026-11-22T18:00:00-05:00");
export const BOGOTA_NOTE = "Hora de Bogotá (GMT-5)";

export type LiveState = "before" | "live" | "after";

export function liveState(now = new Date()): LiveState {
  if (now < LIVE_START) return "before";
  if (now > LIVE_END) return "after";
  return "live";
}

const DEFAULT_CHANNEL = "UCrdNxBU4cfR0rEHY1OO9tQQ";

/**
 * Resuelve el ID del directo actual del canal con YouTube Data API.
 * Sin YOUTUBE_API_KEY devuelve el ID configurado en el panel.
 */
export async function resolveLiveVideoId(fallback: string): Promise<string> {
  const key = process.env.YOUTUBE_API_KEY;
  const channel = process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL;
  if (!key) return fallback;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channel);
    url.searchParams.set("eventType", "live");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("key", key);

    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return fallback;
    const data = (await response.json()) as {
      items?: Array<{ id?: { videoId?: string } }>;
    };
    return data.items?.[0]?.id?.videoId ?? fallback;
  } catch {
    return fallback;
  }
}
