export const DEFAULT_EMBED_URL =
  "https://www.youtube.com/embed/live_stream?channel=UCrdNxBU4cfR0rEHY1OO9tQQ&autoplay=1&mute=1";

export function youtubeEmbedUrl(input: string): string {
  const value = input.trim();
  if (!value) return DEFAULT_EMBED_URL;
  const id = value.match(/(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([\w-]{6,})/);
  if (id) return `https://www.youtube.com/embed/${id[1]}?autoplay=1&mute=1`;
  if (value.includes("/embed/")) return value;
  return DEFAULT_EMBED_URL;
}
