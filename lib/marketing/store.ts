import { readJson, writeJson } from "@/lib/streaming/store";
import type { MarketingState } from "./types";

const KEY = "supercasa/marketing.json";

export const EMPTY_MARKETING: MarketingState = {
  edits: {},
  updatedAt: new Date(0).toISOString(),
  updatedBy: "",
};

export async function readMarketingState(): Promise<MarketingState> {
  const value = await readJson<MarketingState>(KEY);
  if (!value || typeof value !== "object" || !value.edits) return EMPTY_MARKETING;
  return value;
}

export async function writeMarketingState(state: MarketingState): Promise<MarketingState> {
  const next: MarketingState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(KEY, next);
  return next;
}
