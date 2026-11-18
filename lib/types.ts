export type StreamConfig = {
  youtubeUrl: string;
  embedUrl: string;
  rtmpUrl: string;
  streamKey: string;
  backupUrl: string;
};

export type Totals = {
  raised: number;
  goal: number;
  updatedAt: string;
};

export type CampaignConfig = {
  name: string;
  hashtags: string;
  startsAt: string;
  endsAt: string;
};

export type MetaConfig = {
  pixelId: string;
  adAccountId: string;
  campaignId: string;
};

export type AppConfig = {
  stream: StreamConfig;
  totals: Totals;
  campaign: CampaignConfig;
  meta: MetaConfig;
};

export type PublicConfig = {
  stream: Pick<StreamConfig, "youtubeUrl" | "embedUrl" | "backupUrl">;
  totals: Totals;
  campaign: CampaignConfig;
  meta: Pick<MetaConfig, "pixelId">;
};
