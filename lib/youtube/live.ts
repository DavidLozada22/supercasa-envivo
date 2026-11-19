export const DEFAULT_CHANNEL_ID = "UCrdNxBU4cfR0rEHY1OO9tQQ";
const API = "https://www.googleapis.com/youtube/v3";

export type LiveSource = "api-live" | "api-search" | "cached" | "fallback" | "manual";
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
  const maxAge = input.maxAgeMs ?? 25_000;

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
      if (response.status === 403) return failure("quota");
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

    const response = await request(
      `${API}/search?part=snippet&channelId=${encodeURIComponent(channelId)}&eventType=live&type=video&maxResults=1`,
    );
    if (response.status === 403) return failure("quota");
    if (!response.ok) return failure("api");

    const data = (await response.json()) as {
      items?: Array<{ id?: { videoId?: string } }>;
    };
    const found = data.items?.[0]?.id?.videoId ?? "";

    if (found) {
      const same = found === base.videoId;
      return {
        ...base,
        channelId,
        videoId: found,
        live: true,
        source: "api-search",
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

    return {
      ...base,
      channelId,
      live: false,
      source: "api-search",
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
