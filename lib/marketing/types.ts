import type { AdTheme, QrTarget, CreativeSlide } from "./campaign-kit";

export type AccentColor = NonNullable<CreativeSlide["accentColor"]>;
export type AdAspect = "9:16" | "4:5" | "1:1";

export type SlideEdit = {
  kicker?: string;
  headline?: string;
  speechBubble?: string;
  body?: string;
  giantNumber?: string;
  accentColor?: AccentColor;
  urlText?: string;
  urlLabel?: string;
  characterImage?: string;
  fullSceneImage?: string;
  showQr?: boolean;
};

export type CreativeEdit = {
  theme?: AdTheme;
  aspect?: AdAspect;
  qrTarget?: QrTarget;
  showQr?: boolean;
  caption?: string;
  slides: Record<string, SlideEdit>;
};

export type MarketingState = {
  edits: Record<string, CreativeEdit>;
  updatedAt: string;
  updatedBy: string;
};
