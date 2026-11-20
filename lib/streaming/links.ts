import { mergeScene, type SceneOverride } from "./merge";
import type { SceneDef } from "./scenes";

const TEXT_KEYS = [
  "eyebrow",
  "title",
  "subtitle",
  "note",
  "guest",
  "guestRole",
  "returnAt",
  "badge",
  "cta",
  "countValue",
  "countUnit",
  "progressCaption",
] as const;

type LinkOptions = {
  /** Incluye todos los valores actuales, no solo los que tienen override. */
  all?: boolean;
  /** Origen opcional. En el navegador se resuelve al copiar. */
  origin?: string;
};

function clean(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function scenePath(
  scene: SceneDef,
  override?: SceneOverride,
  options: LinkOptions = {},
): string {
  const params = new URLSearchParams();
  const set = (key: string, value: unknown) => {
    const next = clean(value);
    if (next) params.set(key, next);
  };

  if (options.all) {
    const merged = mergeScene(scene, override);
    for (const key of TEXT_KEYS) set(key, merged[key]);
    set("qrTarget", merged.qrTarget);
    set("progressLive", typeof merged.progressLive === "boolean" ? merged.progressLive : "");
    set("progressPercent", merged.progressPercent);
  } else if (override) {
    for (const key of TEXT_KEYS) set(key, override[key]);
    set("qrTarget", override.qrTarget);
    set("progressLive", typeof override.progressLive === "boolean" ? override.progressLive : "");
    set("progressPercent", override.progressPercent);
  }

  const query = params.toString();
  return `${options.origin ?? ""}/pantalla/${scene.id}${query ? `?${query}` : ""}`;
}

export function absoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}
