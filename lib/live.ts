import { EVENT_END, EVENT_START } from "./event";

export const LIVE_START = EVENT_START;
export const LIVE_END = EVENT_END;
export const BOGOTA_NOTE = "Hora de Bogotá (GMT-5)";

export type LiveState = "before" | "live" | "after";

export function liveState(now = new Date()): LiveState {
  if (now < LIVE_START) return "before";
  if (now > LIVE_END) return "after";
  return "live";
}
