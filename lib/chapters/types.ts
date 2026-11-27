export const CHAPTER_CATEGORIES = ["podcast", "musica", "momentos", "capsulas"] as const;

export type ChapterCategory = (typeof CHAPTER_CATEGORIES)[number];

export const CHAPTER_CATEGORY_LABELS: Record<ChapterCategory, string> = {
  podcast: "Podcast",
  musica: "Música",
  momentos: "Momentos",
  capsulas: "Cápsulas",
};

export const CHAPTER_CATEGORY_DESCRIPTIONS: Record<ChapterCategory, string> = {
  podcast: "Las entrevistas de Hilos Invisibles.",
  musica: "La música que sonó en la maratón.",
  momentos: "Los bloques y recorridos de las 48 horas.",
  capsulas: "Piezas cortas de la campaña.",
};

export type ChapterProvider = "drive" | "file";
export type ChapterStatus = "published" | "hidden";

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ChapterCategory;
  series: string;
  episode: number | null;
  provider: ChapterProvider;
  providerId: string;
  durationSeconds: number;
  posterUrl: string;
  publishedAt: string;
  featured: boolean;
  sortOrder: number;
  status: ChapterStatus;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type ChapterInput = {
  id?: string;
  slug?: string;
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  category?: unknown;
  series?: unknown;
  episode?: unknown;
  video?: unknown;
  duration?: unknown;
  posterUrl?: unknown;
  publishedAt?: unknown;
  featured?: unknown;
  status?: unknown;
  sortOrder?: unknown;
};

// Vista pública: no lleva providerId para no exponer el archivo de Drive en el HTML.
export type PublicChapter = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ChapterCategory;
  series: string;
  episode: number | null;
  provider: ChapterProvider;
  videoUrl: string;
  durationSeconds: number;
  posterUrl: string;
  publishedAt: string;
  featured: boolean;
  sortOrder: number;
};
