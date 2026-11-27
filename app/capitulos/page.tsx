import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ChaptersBrowser from "@/components/chapters/ChaptersBrowser";
import { readChapters } from "@/lib/chapters/store";
import type { Chapter } from "@/lib/chapters/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Capítulos",
  description:
    "Hilos Invisibles y los momentos de la maratón de 48 horas por La Supercasa. Entrevistas, música y videos para volver a ver.",
  alternates: { canonical: "/capitulos" },
  openGraph: {
    title: "Capítulos de La Supercasa",
    description:
      "Entrevistas, música y momentos de la maratón de 48 horas por La Supercasa.",
    url: "/capitulos",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "La SUPERCASA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capítulos de La Supercasa",
    description: "Entrevistas, música y momentos de la maratón de 48 horas.",
    images: ["/og-image.jpg"],
  },
};

function totalLabel(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);
  if (hours <= 0) return `${minutes} min de video`;
  if (minutes <= 0) return `${hours} h de video`;
  return `${hours} h ${minutes} min de video`;
}

export default async function ChaptersPage() {
  let chapters: Chapter[] = [];
  try {
    chapters = await readChapters();
  } catch {
    chapters = [];
  }

  const totalSeconds = chapters.reduce((total, chapter) => total + chapter.durationSeconds, 0);

  return (
    <>
      <SiteHeader current="chapters" />

      <main className="chapters-root">
        <section className="chapters-hero" aria-labelledby="chapters-title">
          <div className="chapters-hero__inner">
            <p className="chapters-hero__eyebrow">Hilos Invisibles</p>
            <h1 id="chapters-title">Los capítulos de las 48 horas</h1>
            <p className="chapters-hero__lead">
              Las entrevistas del podcast, la música de Machare y los momentos que quedaron de la
              maratón por La Supercasa. Todo queda aquí para volver a verlo cuando quieras.
            </p>

            <div className="chapters-hero__meta">
              <span>{chapters.length} capítulos</span>
              <span>{totalLabel(totalSeconds)}</span>
            </div>

            <div className="chapters-hero__actions">
              <Link href="/donar" className="chapter-btn chapter-btn--primary">
                <Heart className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                Donar ahora
              </Link>
              <Link href="/" className="chapter-btn chapter-btn--ghost">
                Conoce La Supercasa
              </Link>
            </div>
          </div>
        </section>

        {chapters.length > 0 ? (
          <ChaptersBrowser chapters={chapters} />
        ) : (
          <section className="chapters-empty-wrap">
            <h2>Estamos organizando el archivo</h2>
            <p>Muy pronto vas a poder ver aquí todas las entrevistas y los momentos de la maratón.</p>
            <Link href="/" className="chapter-btn chapter-btn--primary">
              Volver al inicio
            </Link>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
