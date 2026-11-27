import { posterFor } from "./format";
import type { Chapter, PublicChapter } from "./types";

export function toPublicChapter(chapter: Chapter): PublicChapter {
  return {
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    subtitle: chapter.subtitle,
    description: chapter.description,
    category: chapter.category,
    series: chapter.series,
    episode: chapter.episode,
    instagram: chapter.instagram,
    website: chapter.website,
    provider: chapter.provider,
    videoUrl: chapter.provider === "file" ? chapter.providerId : "",
    durationSeconds: chapter.durationSeconds,
    posterUrl: posterFor(chapter),
    publishedAt: chapter.publishedAt,
    featured: chapter.featured,
    sortOrder: chapter.sortOrder,
  };
}
