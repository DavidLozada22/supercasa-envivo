import type { Chapter } from "./types";

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(rest)}`;
  return `${minutes}:${pad(rest)}`;
}

export function parseDuration(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  const text = String(value ?? "").trim();
  if (!text) return 0;
  if (/^\d+$/.test(text)) return Math.max(0, Number(text));
  const parts = text.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  return Math.max(
    0,
    parts.reduce((total, part) => total * 60 + Math.max(0, Math.round(part)), 0),
  );
}

export function isoDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  let value = "PT";
  if (hours > 0) value += `${hours}H`;
  if (minutes > 0) value += `${minutes}M`;
  if (rest > 0 || value === "PT") value += `${rest}S`;
  return value;
}

export function formatChapterDate(value: string): string {
  const date = new Date(`${value}T12:00:00-05:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  }).format(date);
}

export function posterFor(chapter: Pick<Chapter, "provider" | "providerId" | "posterUrl">): string {
  if (chapter.posterUrl) return chapter.posterUrl;
  if (chapter.provider === "drive") {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(chapter.providerId)}&sz=w1280`;
  }
  return "";
}

export function embedUrl(chapter: Pick<Chapter, "provider" | "providerId">): string {
  if (chapter.provider === "drive") {
    return `https://drive.google.com/file/d/${chapter.providerId}/preview`;
  }
  return chapter.providerId;
}

export function watchUrl(chapter: Pick<Chapter, "provider" | "providerId">): string {
  if (chapter.provider === "drive") {
    return `https://drive.google.com/file/d/${chapter.providerId}/view`;
  }
  return chapter.providerId;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
