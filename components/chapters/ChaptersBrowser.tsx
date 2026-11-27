"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Chapter, ChapterCategory } from "@/lib/chapters/types";
import {
  CHAPTER_CATEGORIES,
  CHAPTER_CATEGORY_LABELS,
} from "@/lib/chapters/types";
import ChapterCard from "./ChapterCard";

type Filter = "all" | ChapterCategory;

export default function ChaptersBrowser({ chapters }: { chapters: Chapter[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: chapters.length,
      podcast: 0,
      musica: 0,
      momentos: 0,
      capsulas: 0,
    };
    for (const chapter of chapters) result[chapter.category] += 1;
    return result;
  }, [chapters]);

  const featured = useMemo(
    () => chapters.filter((chapter) => chapter.featured).slice(0, 3),
    [chapters],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return chapters.filter((chapter) => {
      if (filter !== "all" && chapter.category !== filter) return false;
      if (!term) return true;
      return `${chapter.title} ${chapter.subtitle} ${chapter.description} ${chapter.series}`
        .toLowerCase()
        .includes(term);
    });
  }, [chapters, filter, query]);

  const showFeatured = filter === "all" && !query.trim() && featured.length > 0;

  return (
    <div className="chapters-browser">
      {showFeatured ? (
        <section className="chapters-featured" aria-labelledby="chapters-featured-title">
          <div className="chapters-section-head">
            <div>
              <p className="chapters-section-head__eyebrow">Para empezar</p>
              <h2 id="chapters-featured-title">Los más vistos de la maratón</h2>
            </div>
          </div>
          <div className="chapters-grid chapters-grid--featured">
            {featured.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} featured />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="chapters-all-title">
        <div className="chapters-section-head">
          <div>
            <p className="chapters-section-head__eyebrow">Archivo completo</p>
            <h2 id="chapters-all-title">Todos los capítulos</h2>
          </div>
        </div>

        <div className="chapters-toolbar">
          <div className="chapters-filters" role="group" aria-label="Filtrar por categoría">
            <button
              type="button"
              className={`chapters-filter${filter === "all" ? " is-active" : ""}`}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              Todo <span>{counts.all}</span>
            </button>
            {CHAPTER_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`chapters-filter${filter === category ? " is-active" : ""}`}
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
              >
                {CHAPTER_CATEGORY_LABELS[category]} <span>{counts[category]}</span>
              </button>
            ))}
          </div>

          <label className="chapters-search">
            <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o tema"
              aria-label="Buscar capítulos"
            />
          </label>
        </div>

        <p className="chapters-count" aria-live="polite">
          {filtered.length === 1 ? "1 capítulo" : `${filtered.length} capítulos`}
        </p>

        {filtered.length > 0 ? (
          <div className="chapters-grid">
            {filtered.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        ) : (
          <p className="chapters-empty">
            No encontramos capítulos con esa búsqueda. Prueba con otra palabra o cambia el filtro.
          </p>
        )}
      </section>
    </div>
  );
}
