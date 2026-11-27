import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Heart } from "lucide-react";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ChapterPlayer from "@/components/chapters/ChapterPlayer";
import ChapterCard from "@/components/chapters/ChapterCard";
import ShareChapter from "@/components/chapters/ShareChapter";
import { readChapter, readChapters } from "@/lib/chapters/store";
import {
  embedUrl,
  formatChapterDate,
  formatDuration,
  isoDuration,
  posterFor,
  watchUrl,
} from "@/lib/chapters/format";
import { CHAPTER_CATEGORY_LABELS } from "@/lib/chapters/types";

export const dynamic = "force-dynamic";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://supercasa.svgvisual.com").replace(
  /\/+$/,
  "",
);

function absolute(url: string): string {
  if (!url) return `${BASE}/og-image.jpg`;
  return url.startsWith("http") ? url : `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function fallbackDescription(category: string): string {
  if (category === "podcast") {
    return "Una conversación del podcast Hilos Invisibles, grabada durante la maratón de 48 horas por La Supercasa.";
  }
  return "Un video del archivo de la maratón de 48 horas por La Supercasa.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await readChapter(slug);
  if (!chapter) {
    return { title: "Capítulo no encontrado" };
  }

  const description = chapter.description || fallbackDescription(chapter.category);
  const poster = absolute(posterFor(chapter));

  return {
    title: chapter.title,
    description,
    alternates: { canonical: `/capitulos/${chapter.slug}` },
    openGraph: {
      title: chapter.title,
      description,
      url: `/capitulos/${chapter.slug}`,
      type: "video.other",
      images: [{ url: poster, width: 1200, height: 675, alt: chapter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: chapter.title,
      description,
      images: [poster],
    },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = await readChapter(slug);
  if (!chapter) notFound();

  const all = await readChapters();
  const sameCategory = all.filter(
    (item) => item.id !== chapter.id && item.category === chapter.category,
  );
  const rest = all.filter((item) => item.id !== chapter.id && item.category !== chapter.category);
  const related = [...sameCategory, ...rest].slice(0, 3);

  const poster = posterFor(chapter);
  const description = chapter.description || fallbackDescription(chapter.category);
  const shareUrl = `${BASE}/capitulos/${chapter.slug}`;
  const externalLabel =
    chapter.provider === "drive" ? "Abrir el video en Drive" : "Abrir el video";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: chapter.title,
    description,
    thumbnailUrl: [absolute(poster)],
    uploadDate: `${chapter.publishedAt}T12:00:00-05:00`,
    duration: isoDuration(chapter.durationSeconds),
    embedUrl: absolute(embedUrl(chapter)),
    contentUrl: absolute(watchUrl(chapter)),
    inLanguage: "es-CO",
    publisher: {
      "@type": "Organization",
      name: "Fundación Segundos de Vida",
      url: BASE,
    },
  };

  return (
    <>
      <SiteHeader current="chapters" />

      <main className="chapters-root">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="chapter-detail">
          <nav className="chapter-detail__crumbs" aria-label="Ruta">
            <Link href="/capitulos">Capítulos</Link>
            <span aria-hidden="true">/</span>
            <span>{CHAPTER_CATEGORY_LABELS[chapter.category]}</span>
          </nav>

          <div className="chapter-detail__grid">
            <div className="chapter-detail__main">
              <ChapterPlayer
                provider={chapter.provider}
                src={embedUrl(chapter)}
                poster={poster}
                title={chapter.title}
                externalUrl={watchUrl(chapter)}
                externalLabel={externalLabel}
                durationLabel={formatDuration(chapter.durationSeconds)}
              />

              <p className="chapter-detail__category">
                {CHAPTER_CATEGORY_LABELS[chapter.category]}
                {chapter.series ? ` · ${chapter.series}` : ""}
                {chapter.episode ? ` · Episodio ${chapter.episode}` : ""}
              </p>

              <h1 className="chapter-detail__title">{chapter.title}</h1>
              {chapter.subtitle ? (
                <p className="chapter-detail__subtitle">{chapter.subtitle}</p>
              ) : null}

              <div className="chapter-detail__meta">
                <span>
                  <Clock className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {formatDuration(chapter.durationSeconds)}
                </span>
                <span>
                  <CalendarDays className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {formatChapterDate(chapter.publishedAt)}
                </span>
              </div>

              <p className="chapter-detail__description">{description}</p>

              <div className="chapter-detail__actions">
                <ShareChapter title={chapter.title} url={shareUrl} />
                <Link href="/donar" className="chapter-btn chapter-btn--primary">
                  <Heart className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  Donar ahora
                </Link>
              </div>
            </div>

            <aside className="chapter-detail__aside" aria-labelledby="related-title">
              <h2 id="related-title">Sigue viendo</h2>
              <div className="chapter-detail__related">
                {related.map((item) => (
                  <ChapterCard key={item.id} chapter={item} />
                ))}
              </div>
              <Link href="/capitulos" className="chapter-btn chapter-btn--ghost">
                Ver todo el archivo
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
