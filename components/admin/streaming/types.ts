export type YoutubeHealth = {
  keyPresent: boolean;
  channelId: string;
  channelUrl: string;
  videoId: string;
  live: boolean;
  source: string;
  checkedAt: string;
  changedAt: string | null;
  error: string | null;
  history: Array<{
    at: string;
    from: string | null;
    to: string;
    reason: string;
  }>;
};

export type Health = {
  youtube: YoutubeHealth;
  resend: {
    keyPresent: boolean;
    from: string;
    domain: string;
    status: string;
    checkedAt: string;
  };
  onair: {
    sceneId: string;
    fields: Record<string, string | undefined>;
    token: string;
    updatedAt: string;
  };
  simulation: { videoId: string; until: string } | null;
  override: { videoId: string; updatedAt: string; updatedBy: string } | null;
  capabilities: { blob: boolean; database: boolean };
  now: string;
};
