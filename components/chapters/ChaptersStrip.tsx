import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readChapters } from "@/lib/chapters/store";
import { toPublicChapter } from "@/lib/chapters/public";
import type { Chapter, PublicChapter } from "@/lib/chapters/types";
import ChapterCard from "@/components/chapters/ChapterCard";

export default async function ChaptersStrip() {
  let chapters: Chapter[] = [];
  try {
    chapters = await readChapters();
  } catch {
    return null;
  }

  const featured: PublicChapter[] = chapters
    .filter((chapter) => chapter.featured)
    .slice(0, 3)
    .map(toPublicChapter);
  if (featured.length === 0) return null;

  return (
    <section className="chapters-strip" aria-labelledby="chapters-strip-title">
      <div className="chapters-strip__inner">
        <div className="chapters-strip__head">
          <div>
            <p className="chapters-strip__eyebrow">Podcast y archivo</p>
            <h2 id="chapters-strip-title">Revive las 48 horas</h2>
            <p className="chapters-strip__lead">
              Las entrevistas, la música de Machare y los momentos que quedaron de la maratón.
            </p>
          </div>
          <Link href="/capitulos" className="chapters-strip__all">
            Ver todos los capítulos
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="chapters-grid chapters-grid--featured">
          {featured.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
