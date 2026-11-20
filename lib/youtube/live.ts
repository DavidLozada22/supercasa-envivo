export const DEFAULT_CHANNEL_ID = "UCrdNxBU4cfR0rEHY1OO9tQQ";
const API = "https://www.googleapis.com/youtube/v3";
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function parseVideoId(input: string): string {
  const value = (input ?? "").trim();
  if (!value) return "";
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return "";
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "").toLowerCase();
  const isYouTube = host === "youtube.com" || host.endsWith(".youtube.com");
  const isShort = host === "youtu.be";
  if (!isYouTube && !isShort) return "";

  if (isShort) {
    const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return VIDEO_ID.test(id) ? id : "";
  }

  const direct = url.searchParams.get("v") ?? "";
  if (VIDEO_ID.test(direct)) return direct;

  const parts = url.pathname.split("/").filter(Boolean);
  const index = parts.findIndex((part) =>
    ["live", "embed", "shorts", "v"].includes(part.toLowerCase()),
  );
  const candidate = index >= 0 ? parts[index + 1] ?? "" : "";
  return VIDEO_ID.test(candidate) ? candidate : "";
}

export type LiveSource =
  | "api-live"
  | "api-search"
  | "api-uploads"
  | "cached"
  | "fallback"
  | "manual";
export type LiveError = "missing_key" | "quota" | "network" | "api" | null;

export type LiveHistoryEntry = {
  at: string;
  from: string | null;
  to: string;
  reason: "first" | "new_live" | "streak_ended" | "manual";
};

export type LiveStatus = {
  videoId: string;
  live: boolean;
  source: LiveSource;
  checkedAt: string;
  changedAt: string | null;
  error: LiveError;
  channelId: string;
  history: LiveHistoryEntry[];
};

export type LiveSnapshot = {
  state: "before" | "live" | "after";
  videoId: string;
  live: boolean;
  source: LiveSource;
  checkedAt: string;
  changedAt: string | null;
  simulatedUntil?: string;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type ResolveInput = {
  last?: LiveStatus | null;
  fallbackId?: string;
  key?: string | null;
  channelId?: string;
  fetchImpl?: FetchLike;
  now?: Date;
  maxAgeMs?: number;
};

function emptyStatus(channelId: string, checkedAt: string): LiveStatus {
  return {
    videoId: "",
    live: false,
    source: "fallback",
    checkedAt,
    changedAt: null,
    error: null,
    channelId,
    history: [],
  };
}

function withHistory(status: LiveStatus, entry: LiveHistoryEntry): LiveHistoryEntry[] {
  return [entry, ...status.history].slice(0, 12);
}

/**
 * Resuelve el directo actual del canal.
 *
 * Orden: comprobar el ultimo ID conocido (1 unidad) y, si ya no esta en vivo,
 * buscar el directo activo del canal (100 unidades). Nunca lanza: devuelve el
 * ultimo estado conocido con el error marcado.
 */
export async function resolveLiveStatus(input: ResolveInput = {}): Promise<LiveStatus> {
  const now = input.now ?? new Date();
  const checkedAt = now.toISOString();
  const channelId =
    input.channelId ?? process.env.YOUTUBE_CHANNEL_ID ?? DEFAULT_CHANNEL_ID;
  const key =
    input.key === undefined ? process.env.YOUTUBE_API_KEY ?? "" : input.key ?? "";
  const doFetch: FetchLike = input.fetchImpl ?? fetch;
  const last = input.last ?? null;
  const maxAge = input.maxAgeMs ?? 30_000;

  const base = last ?? {
    ...emptyStatus(channelId, checkedAt),
    videoId: (input.fallbackId ?? "").trim(),
  };

  if (last) {
    const age = now.getTime() - Date.parse(last.checkedAt);
    const ttl = last.error ? 10_000 : maxAge;
    if (Number.isFinite(age) && age >= 0 && age < ttl) return last;
  }

  if (!key) {
    return {
      ...base,
      channelId,
      live: false,
      source: "fallback",
      checkedAt,
      error: "missing_key",
    };
  }

  const candidate = (last?.videoId || input.fallbackId || "").trim();

  const failure = (error: LiveError): LiveStatus => ({
    ...base,
    channelId,
    checkedAt,
    error,
    source: "cached",
  });

  const request = (url: string) =>
    doFetch(url, {
      headers: { "X-Goog-Api-Key": key },
      cache: "no-store" as RequestCache,
    });

  try {
    if (candidate) {
      const response = await request(
        `${API}/videos?part=snippet,liveStreamingDetails&id=${encodeURIComponent(candidate)}`,
      );
      if (response.status === 403 || response.status === 429) return failure("quota");
      if (!response.ok) return failure("api");
      const data = (await response.json()) as {
        items?: Array<{
          snippet?: { liveBroadcastContent?: string };
          liveStreamingDetails?: { actualEndTime?: string };
        }>;
      };
      const item = data.items?.[0];
      const isLive = Boolean(
        item &&
          item.snippet?.liveBroadcastContent === "live" &&
          !item.liveStreamingDetails?.actualEndTime,
      );

      if (isLive) {
        return {
          ...base,
          channelId,
          videoId: candidate,
          live: true,
          source: "api-live",
          checkedAt,
          changedAt: base.changedAt ?? checkedAt,
          error: null,
        };
      }
    }

    // El buscador de YouTube gasta 100 unidades y suele tardar en indexar el
    // directo. La lista de subidas del canal cuesta 2 unidades y trae el vivo
    // al instante. Funciona con la lista UU<canal>.
    const uploads = channelId.startsWith("UC") ? `UU${channelId.slice(2)}` : "";
    if (!uploads) {
      return {
        ...base,
        channelId,
        live: false,
        source: "api-uploads",
        checkedAt,
        error: null,
      };
    }

    const listResponse = await request(
      `${API}/playlistItems?part=contentDetails&playlistId=${encodeURIComponent(uploads)}&maxResults=12`,
    );
    if (listResponse.status === 403 || listResponse.status === 429) {
      return failure("quota");
    }
    if (!listResponse.ok) return failure("api");

    const listData = (await listResponse.json()) as {
      items?: Array<{ contentDetails?: { videoId?: string } }>;
    };
    const ids = (listData.items ?? [])
      .map((item) => item.contentDetails?.videoId ?? "")
      .filter(Boolean)
      .slice(0, 12);

    if (ids.length > 0) {
      const videosResponse = await request(
        `${API}/videos?part=snippet,liveStreamingDetails&id=${ids.join(",")}`,
      );
      if (videosResponse.status === 403 || videosResponse.status === 429) {
        return failure("quota");
      }
      if (!videosResponse.ok) return failure("api");

      const videosData = (await videosResponse.json()) as {
        items?: Array<{
          id?: string;
          snippet?: { liveBroadcastContent?: string };
          liveStreamingDetails?: { actualEndTime?: string };
        }>;
      };
      const liveItem = (videosData.items ?? []).find(
        (item) =>
          item.snippet?.liveBroadcastContent === "live" &&
          !item.liveStreamingDetails?.actualEndTime,
      );
      const found = liveItem?.id ?? "";

      if (found) {
        const same = found === base.videoId;
        return {
          ...base,
          channelId,
          videoId: found,
          live: true,
          source: "api-uploads",
          checkedAt,
          changedAt: same ? base.changedAt ?? checkedAt : checkedAt,
          error: null,
          history: same
            ? base.history
            : withHistory(base, {
                at: checkedAt,
                from: base.videoId || null,
                to: found,
                reason: base.live ? "streak_ended" : "new_live",
              }),
        };
      }
    }

    return {
      ...base,
      channelId,
      live: false,
      source: "api-uploads",
      checkedAt,
      error: null,
    };
  } catch {
    return failure("network");
  }
}

export function liveSnapshot(status: LiveStatus, state: LiveSnapshot["state"]): LiveSnapshot {
  return {
    state,
    videoId: status.videoId,
    live: status.live,
    source: status.source,
    checkedAt: status.checkedAt,
    changedAt: status.changedAt,
  };
}
