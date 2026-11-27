import Link from "next/link";
import { Play } from "lucide-react";
import type { PublicChapter } from "@/lib/chapters/types";
import { CHAPTER_CATEGORY_LABELS } from "@/lib/chapters/types";
import { formatDuration } from "@/lib/chapters/format";

export default function ChapterCard({
  chapter,
  featured = false,
}: {
  chapter: PublicChapter;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/capitulos/${chapter.slug}`}
      className={`chapter-card${featured ? " chapter-card--featured" : ""}`}
    >
      <span className="chapter-card__media">
        {chapter.posterUrl ? <img src={chapter.posterUrl} alt="" loading="lazy" /> : null}
        <span className="chapter-card__shade" aria-hidden="true" />
        <span className="chapter-card__play" aria-hidden="true">
          <Play className="h-4 w-4" strokeWidth={2.4} fill="currentColor" />
        </span>
        <span className="chapter-card__duration">{formatDuration(chapter.durationSeconds)}</span>
      </span>
      <span className="chapter-card__body">
        <span className="chapter-card__category">{CHAPTER_CATEGORY_LABELS[chapter.category]}</span>
        <span className="chapter-card__title">{chapter.title}</span>
        {chapter.subtitle ? (
          <span className="chapter-card__subtitle">{chapter.subtitle}</span>
        ) : null}
      </span>
    </Link>
  );
}
