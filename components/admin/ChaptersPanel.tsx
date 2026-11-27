"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { Chapter, ChapterCategory, ChapterStatus } from "@/lib/chapters/types";
import {
  CHAPTER_CATEGORIES,
  CHAPTER_CATEGORY_LABELS,
} from "@/lib/chapters/types";
import { formatDuration, posterFor } from "@/lib/chapters/format";

type FormState = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ChapterCategory;
  series: string;
  episode: string;
  instagram: string;
  website: string;
  video: string;
  duration: string;
  posterUrl: string;
  publishedAt: string;
  featured: boolean;
  status: ChapterStatus;
  sortOrder: string;
};

const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

const label = "mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-slate-500";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(sortOrder: number): FormState {
  return {
    id: "",
    title: "",
    subtitle: "",
    description: "",
    category: "podcast",
    series: "Hilos Invisibles",
    episode: "",
    instagram: "",
    website: "",
    video: "",
    duration: "",
    posterUrl: "",
    publishedAt: today(),
    featured: false,
    status: "published",
    sortOrder: String(sortOrder),
  };
}

function formFrom(chapter: Chapter): FormState {
  return {
    id: chapter.id,
    title: chapter.title,
    subtitle: chapter.subtitle,
    description: chapter.description,
    category: chapter.category,
    series: chapter.series,
    episode: chapter.episode === null ? "" : String(chapter.episode),
    instagram: chapter.instagram,
    website: chapter.website,
    video:
      chapter.provider === "drive"
        ? `https://drive.google.com/file/d/${chapter.providerId}/view`
        : chapter.providerId,
    duration: formatDuration(chapter.durationSeconds),
    posterUrl: chapter.posterUrl,
    publishedAt: chapter.publishedAt,
    featured: chapter.featured,
    status: chapter.status,
    sortOrder: String(chapter.sortOrder),
  };
}

export default function ChaptersPanel() {
  const [rows, setRows] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(1));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/chapters", { cache: "no-store" });
      const data = (await response.json()) as { chapters?: Chapter[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudieron cargar los capítulos.");
        setRows([]);
        return;
      }
      setRows(data.chapters ?? []);
    } catch {
      setError("Error de conexión al cargar los capítulos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return b.publishedAt.localeCompare(a.publishedAt);
      }),
    [rows],
  );

  const startNew = () => {
    setForm(emptyForm(rows.length + 1));
    setError("");
    setMessage("");
    setOpen(true);
  };

  const startEdit = (chapter: Chapter) => {
    setForm(formFrom(chapter));
    setError("");
    setMessage("");
    setOpen(true);
  };

  const close = () => {
    if (saving) return;
    setOpen(false);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("El capítulo necesita un título.");
      return;
    }
    if (!form.video.trim()) {
      setError("Pega el link del video de Drive.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          category: form.category,
          series: form.series,
          episode: form.episode === "" ? null : Number(form.episode),
          instagram: form.instagram,
          website: form.website,
          video: form.video,
          duration: form.duration,
          posterUrl: form.posterUrl,
          publishedAt: form.publishedAt,
          featured: form.featured,
          status: form.status,
          sortOrder: Number(form.sortOrder),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo guardar el capítulo.");
        return;
      }
      setMessage(form.id ? "Capítulo actualizado." : "Capítulo creado.");
      setOpen(false);
      await load();
    } catch {
      setError("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const quick = async (
    chapter: Chapter,
    patch: { status?: ChapterStatus; featured?: boolean },
  ) => {
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chapter.id, ...patch }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo actualizar el capítulo.");
        return;
      }
      setMessage("Capítulo actualizado.");
      await load();
    } catch {
      setError("Error de conexión al actualizar.");
    }
  };

  const remove = async (chapter: Chapter) => {
    const ok = window.confirm(`¿Borrar "${chapter.title}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/chapters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chapter.id }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo borrar el capítulo.");
        return;
      }
      setMessage("Capítulo borrado.");
      await load();
    } catch {
      setError("Error de conexión al borrar.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">Archivo público</p>
          <h2 className="text-xl font-extrabold text-[#0F2354]">Capítulos</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Hilos Invisibles, música y momentos de la maratón. Los videos se quedan en Drive y aquí
            solo guardamos el link, el título y el orden.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#a80073] transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          Nuevo capítulo
        </button>
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Cargando capítulos
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-bold text-[#0F2354]">Todavía no hay capítulos.</p>
          <p className="mt-1 text-sm text-slate-500">
            Crea el primero con el link de Drive del video.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((chapter) => (
            <li
              key={chapter.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
            >
              <img
                src={posterFor(chapter) || "/og-image.jpg"}
                alt=""
                loading="lazy"
                className="h-16 w-28 shrink-0 rounded-xl bg-slate-100 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                  {CHAPTER_CATEGORY_LABELS[chapter.category]} ·{" "}
                  {formatDuration(chapter.durationSeconds)}
                </p>
                <p className="truncate text-sm font-extrabold text-[#0F2354]">{chapter.title}</p>
                <p className="truncate text-xs text-slate-500">
                  {chapter.subtitle || chapter.slug}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {chapter.status === "published" ? "Publicado" : "Oculto"} · orden{" "}
                  {chapter.sortOrder} · {chapter.provider === "drive" ? "Drive" : "MP4"}
                  {chapter.featured ? " · destacado" : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void quick(chapter, { featured: !chapter.featured })}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                    chapter.featured
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-slate-200 text-slate-600 hover:border-amber-300"
                  }`}
                >
                  <Star
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                    fill={chapter.featured ? "currentColor" : "none"}
                  />
                  {chapter.featured ? "Destacado" : "Destacar"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void quick(chapter, {
                      status: chapter.status === "published" ? "hidden" : "published",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-slate-300"
                >
                  {chapter.status === "published" ? (
                    <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  {chapter.status === "published" ? "Ocultar" : "Publicar"}
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(chapter)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-[#E6009E] hover:text-[#E6009E]"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => void remove(chapter)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 transition hover:border-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/50 p-4">
          <div className="mx-auto mt-4 w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl sm:mt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                  Capítulo
                </p>
                <h2 className="text-lg font-extrabold text-[#0F2354]">
                  {form.id ? "Editar capítulo" : "Nuevo capítulo"}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="chapter-video">
                  Link del video
                </label>
                <input
                  id="chapter-video"
                  className={input}
                  value={form.video}
                  onChange={(event) => update("video", event.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Pega el link del archivo de Drive o una URL pública de MP4. La miniatura sale
                  del thumbnail de Drive si no pones una.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="chapter-title">
                  Título
                </label>
                <input
                  id="chapter-title"
                  className={input}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="Hilos Invisibles: Patricia Avendaño"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="chapter-subtitle">
                  Subtítulo
                </label>
                <input
                  id="chapter-subtitle"
                  className={input}
                  value={form.subtitle}
                  onChange={(event) => update("subtitle", event.target.value)}
                  placeholder="Fundadora de la Fundación Segundos de Vida"
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-category">
                  Categoría
                </label>
                <select
                  id="chapter-category"
                  className={input}
                  value={form.category}
                  onChange={(event) => update("category", event.target.value as ChapterCategory)}
                >
                  {CHAPTER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CHAPTER_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={label} htmlFor="chapter-duration">
                  Duración
                </label>
                <input
                  id="chapter-duration"
                  className={input}
                  value={form.duration}
                  onChange={(event) => update("duration", event.target.value)}
                  placeholder="48:09"
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-series">
                  Serie
                </label>
                <input
                  id="chapter-series"
                  className={input}
                  value={form.series}
                  onChange={(event) => update("series", event.target.value)}
                  placeholder="Hilos Invisibles"
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-episode">
                  Episodio
                </label>
                <input
                  id="chapter-episode"
                  className={input}
                  type="number"
                  min="1"
                  value={form.episode}
                  onChange={(event) => update("episode", event.target.value)}
                  placeholder="1"
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-date">
                  Fecha
                </label>
                <input
                  id="chapter-date"
                  className={input}
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) => update("publishedAt", event.target.value)}
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-order">
                  Orden
                </label>
                <input
                  id="chapter-order"
                  className={input}
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => update("sortOrder", event.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="chapter-description">
                  Descripción
                </label>
                <textarea
                  id="chapter-description"
                  className={`${input} min-h-[96px]`}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="De qué trata el capítulo"
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-instagram">
                  Instagram
                </label>
                <input
                  id="chapter-instagram"
                  className={input}
                  value={form.instagram}
                  onChange={(event) => update("instagram", event.target.value)}
                  placeholder="https://www.instagram.com/..."
                />
              </div>

              <div>
                <label className={label} htmlFor="chapter-website">
                  Sitio web
                </label>
                <input
                  id="chapter-website"
                  className={input}
                  value={form.website}
                  onChange={(event) => update("website", event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="chapter-poster">
                  Miniatura (URL del JPG)
                </label>
                <input
                  id="chapter-poster"
                  className={input}
                  value={form.posterUrl}
                  onChange={(event) => update("posterUrl", event.target.value)}
                  placeholder="/video/miniatura.jpg"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => update("featured", event.target.checked)}
                    className="h-4 w-4 accent-[#E6009E]"
                  />
                  Destacado
                </label>
              </div>

              <div>
                <label className={label} htmlFor="chapter-status">
                  Estado
                </label>
                <select
                  id="chapter-status"
                  className={input}
                  value={form.status}
                  onChange={(event) => update("status", event.target.value as ChapterStatus)}
                >
                  <option value="published">Publicado</option>
                  <option value="hidden">Oculto</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={close}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F2354] px-4 py-2.5 text-sm font-extrabold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                  )}
                  Guardar capítulo
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
