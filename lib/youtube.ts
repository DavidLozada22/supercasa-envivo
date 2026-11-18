export const DEFAULT_EMBED_URL =
  "https://www.youtube.com/embed/live_stream?channel=UCrdNxBU4cfR0rEHY1OO9tQQ&autoplay=1&mute=1";

export function youtubeVideoId(input: string): string {
  const value = (input ?? "").trim();
  if (!value) return "";
  if (/^[\w-]{11}$/.test(value)) return value;
  const match = value.match(
    /(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([\w-]{11})/,
  );
  return match?.[1] ?? "";
}

export function youtubeEmbedUrl(input: string): string {
  const value = input.trim();
  if (!value) return DEFAULT_EMBED_URL;
  const id = youtubeVideoId(value);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  if (value.includes("/embed/")) return value;
  return DEFAULT_EMBED_URL;
}
