import { promises as fs } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { SEED_CHAPTERS } from "./seed";
import { parseDuration, slugify } from "./format";
import {
  CHAPTER_CATEGORIES,
  type Chapter,
  type ChapterCategory,
  type ChapterInput,
  type ChapterProvider,
  type ChapterStatus,
} from "./types";

type Sql = ReturnType<typeof postgres>;

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "chapters.json");
const globalStore = globalThis as unknown as {
  __supercasaChaptersSql?: Sql;
  __supercasaChaptersReady?: Promise<void>;
};

export class ChapterValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChapterValidationError";
  }
}

function db(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const clean = url.replace("channel_binding=require&", "").replace("channel_binding=require", "");
  globalStore.__supercasaChaptersSql ??= postgres(clean, {
    ssl: url.includes("localhost") ? false : "require",
    max: 1,
    idle_timeout: 20,
  });
  return globalStore.__supercasaChaptersSql;
}

function dateOnly(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value ?? "");
  return text.slice(0, 10);
}

function asChapter(row: Record<string, unknown>): Chapter {
  const category = CHAPTER_CATEGORIES.includes(row.category as ChapterCategory)
    ? (row.category as ChapterCategory)
    : "momentos";
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle ?? ""),
    description: String(row.description ?? ""),
    category,
    series: String(row.series ?? ""),
    episode:
      row.episode === null || row.episode === undefined || row.episode === ""
        ? null
        : Number(row.episode),
    provider: row.provider === "file" ? "file" : "drive",
    providerId: String(row.provider_id ?? ""),
    durationSeconds: Number(row.duration_seconds ?? 0),
    posterUrl: String(row.poster_url ?? ""),
    publishedAt: dateOnly(row.published_at),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order ?? 0),
    status: row.status === "hidden" ? "hidden" : "published",
    createdAt: row.created_at ? new Date(row.created_at as string | Date).toISOString() : "",
    updatedAt: row.updated_at ? new Date(row.updated_at as string | Date).toISOString() : "",
    updatedBy: String(row.updated_by ?? ""),
  };
}

async function upsertChapter(sql: Sql, chapter: Chapter): Promise<void> {
  await sql`
    insert into chapters (
      id, slug, title, subtitle, description, category, series, episode,
      provider, provider_id, duration_seconds, poster_url, published_at,
      featured, sort_order, status, created_at, updated_at, updated_by
    ) values (
      ${chapter.id}, ${chapter.slug}, ${chapter.title}, ${chapter.subtitle},
      ${chapter.description}, ${chapter.category}, ${chapter.series}, ${chapter.episode},
      ${chapter.provider}, ${chapter.providerId}, ${chapter.durationSeconds},
      ${chapter.posterUrl}, ${chapter.publishedAt}, ${chapter.featured},
      ${chapter.sortOrder}, ${chapter.status}, ${chapter.createdAt},
      ${chapter.updatedAt}, ${chapter.updatedBy}
    )
    on conflict (id) do update set
      slug = excluded.slug,
      title = excluded.title,
      subtitle = excluded.subtitle,
      description = excluded.description,
      category = excluded.category,
      series = excluded.series,
      episode = excluded.episode,
      provider = excluded.provider,
      provider_id = excluded.provider_id,
      duration_seconds = excluded.duration_seconds,
      poster_url = excluded.poster_url,
      published_at = excluded.published_at,
      featured = excluded.featured,
      sort_order = excluded.sort_order,
      status = excluded.status,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by`;
}

async function ensure(sql: Sql): Promise<void> {
  if (!globalStore.__supercasaChaptersReady) {
    globalStore.__supercasaChaptersReady = (async () => {
      await sql`
        create table if not exists chapters (
          id text primary key,
          slug text unique not null,
          title text not null,
          subtitle text not null default '',
          description text not null default '',
          category text not null default 'momentos',
          series text not null default '',
          episode integer,
          provider text not null default 'drive',
          provider_id text not null,
          duration_seconds integer not null default 0,
          poster_url text not null default '',
          published_at date not null default current_date,
          featured boolean not null default false,
          sort_order integer not null default 0,
          status text not null default 'published',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          updated_by text not null default ''
        )`;
      await sql`create index if not exists chapters_status_order_idx on chapters (status, sort_order)`;

      const rows = await sql`select count(*)::int as count from chapters`;
      if (Number(rows[0]?.count ?? 0) === 0) {
        for (const chapter of SEED_CHAPTERS) {
          await upsertChapter(sql, chapter);
        }
      }
    })().catch((error) => {
      globalStore.__supercasaChaptersReady = undefined;
      throw error;
    });
  }
  await globalStore.__supercasaChaptersReady;
}

function sortChapters(rows: Chapter[]): Chapter[] {
  return [...rows].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

async function readLocal(): Promise<Chapter[]> {
  try {
    const text = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(text) as unknown;
    if (Array.isArray(parsed)) return parsed as Chapter[];
  } catch {
    // Sin archivo local se usa la semilla.
  }
  return SEED_CHAPTERS.map((chapter) => ({ ...chapter }));
}

async function writeLocal(rows: Chapter[]): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, `${JSON.stringify(sortChapters(rows), null, 2)}\n`, "utf8");
}

export async function readAllChapters(): Promise<Chapter[]> {
  const sql = db();
  if (!sql) return sortChapters(await readLocal());
  await ensure(sql);
  const rows = await sql`select * from chapters order by sort_order asc, published_at desc, title asc`;
  return sortChapters(rows.map(asChapter));
}

export async function readChapters(): Promise<Chapter[]> {
  const rows = await readAllChapters();
  return rows.filter((chapter) => chapter.status === "published");
}

export async function readChapter(slug: string): Promise<Chapter | null> {
  const rows = await readAllChapters();
  return rows.find((chapter) => chapter.slug === slug && chapter.status === "published") ?? null;
}

export function parseVideoLink(value: string): {
  provider: ChapterProvider;
  providerId: string;
} {
  const text = (value ?? "").trim();
  if (!text) return { provider: "drive", providerId: "" };
  if (/drive\.google\.com\/drive\/folders/i.test(text)) {
    throw new ChapterValidationError(
      "Ese es el link de la carpeta. Abre el video y pega el link del archivo.",
    );
  }
  const match =
    text.match(/drive\.google\.com\/file\/d\/([\w-]{10,})/) ??
    text.match(/[?&]id=([\w-]{10,})/);
  if (match) return { provider: "drive", providerId: match[1] };
  if (/^[\w-]{20,}$/.test(text)) return { provider: "drive", providerId: text };
  return { provider: "file", providerId: text };
}

function uniqueSlug(base: string, rows: Chapter[], keepId?: string): string {
  const clean = base || "capitulo";
  let candidate = clean;
  let index = 2;
  while (rows.some((row) => row.slug === candidate && row.id !== keepId)) {
    candidate = `${clean}-${index}`;
    index += 1;
  }
  return candidate;
}

function categoryOf(value: unknown, fallback: ChapterCategory): ChapterCategory {
  return CHAPTER_CATEGORIES.includes(value as ChapterCategory)
    ? (value as ChapterCategory)
    : fallback;
}

function statusOf(value: unknown, fallback: ChapterStatus): ChapterStatus {
  return value === "hidden" ? "hidden" : value === "published" ? "published" : fallback;
}

export async function saveChapter(input: ChapterInput, username: string): Promise<Chapter> {
  const rows = await readAllChapters();
  const existing = input.id ? rows.find((row) => row.id === input.id) : undefined;

  const title = String(input.title ?? existing?.title ?? "").trim();
  if (!title) throw new ChapterValidationError("El capítulo necesita un título.");

  const video = String(input.video ?? "").trim();
  const parsedVideo = video
    ? parseVideoLink(video)
    : { provider: existing?.provider ?? "drive", providerId: existing?.providerId ?? "" };
  if (!parsedVideo.providerId) {
    throw new ChapterValidationError("El capítulo necesita el link del video.");
  }

  const now = new Date().toISOString();
  const slug = existing?.slug ?? uniqueSlug(slugify(String(input.slug ?? title)), rows);
  const publishedAt = dateOnly(input.publishedAt ?? existing?.publishedAt ?? now);
  const episodeValue = input.episode ?? existing?.episode ?? null;
  const parsedEpisode =
    episodeValue === null || episodeValue === "" || episodeValue === undefined
      ? null
      : Number(episodeValue);

  const chapter: Chapter = {
    id: existing?.id ?? `ch-${slug}`,
    slug,
    title,
    subtitle: String(input.subtitle ?? existing?.subtitle ?? "").trim(),
    description: String(input.description ?? existing?.description ?? "").trim(),
    category: categoryOf(input.category, existing?.category ?? "momentos"),
    series: String(input.series ?? existing?.series ?? "").trim(),
    episode: Number.isFinite(parsedEpisode as number) ? (parsedEpisode as number) : null,
    provider: parsedVideo.provider,
    providerId: parsedVideo.providerId,
    durationSeconds: input.duration
      ? parseDuration(input.duration)
      : (existing?.durationSeconds ?? 0),
    posterUrl: String(input.posterUrl ?? existing?.posterUrl ?? "").trim(),
    publishedAt,
    featured: input.featured === undefined ? Boolean(existing?.featured) : Boolean(input.featured),
    sortOrder: Number(input.sortOrder ?? existing?.sortOrder ?? rows.length + 1),
    status: statusOf(input.status, existing?.status ?? "published"),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    updatedBy: username,
  };

  if (Number.isNaN(chapter.sortOrder)) chapter.sortOrder = rows.length + 1;
  if (!Number.isFinite(chapter.durationSeconds)) chapter.durationSeconds = 0;

  const sql = db();
  if (!sql) {
    await writeLocal([...rows.filter((row) => row.id !== chapter.id), chapter]);
    return chapter;
  }

  await ensure(sql);
  await upsertChapter(sql, chapter);
  return chapter;
}

export async function deleteChapter(id: string): Promise<boolean> {
  const sql = db();
  if (!sql) {
    const rows = await readLocal();
    const next = rows.filter((row) => row.id !== id);
    if (next.length === rows.length) return false;
    await writeLocal(next);
    return true;
  }
  await ensure(sql);
  const deleted = await sql`delete from chapters where id = ${id} returning id`;
  return deleted.length > 0;
}
