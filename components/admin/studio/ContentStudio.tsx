"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Check,
  Clapperboard,
  Copy,
  Download,
  Layers,
  Loader2,
  Palette,
  Pencil,
  RotateCcw,
  Save,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import AdCanvasPreview from "@/components/admin/marketing/AdCanvasPreview";
import LiveThumb from "@/components/admin/studio/LiveThumb";
import ObsCopyButton from "@/components/admin/streaming/ObsCopyButton";
import SceneView from "@/components/streaming/SceneView";
import { downloadAdPng, renderAdToDataUrl } from "@/lib/marketing/ad-exporter";
import {
  AD_CREATIVES,
  creativeQrFallback,
  resolveQrTarget,
  type AdCategory,
  type AdCreative,
  type AdFormat,
  type CreativeSlide,
} from "@/lib/marketing/campaign-kit";
import type {
  AccentColor,
  AdAspect,
  CreativeEdit,
  MarketingState,
  SlideEdit,
} from "@/lib/marketing/types";
import {
  displayUrl,
  mergeScene,
  resolveStreamingCopy,
  type SceneOverride,
  type StreamingContent,
  type StreamingCopy,
} from "@/lib/streaming/merge";
import { scenePath } from "@/lib/streaming/links";
import { creativePath } from "@/lib/marketing/links";
import {
  CALVITOS,
  SCENES,
  isBasicScene,
  type CalvitoKey,
  type SceneAccent,
  type SceneDef,
} from "@/lib/streaming/scenes";

type Tab = "marketing" | "cortinas" | "overlays";
type SceneType = "general" | "cuenta" | "hora" | "casa" | "bloque" | "basicas";

const TABS: Array<{ id: Tab; label: string; icon: typeof Palette }> = [
  { id: "marketing", label: "Marketing", icon: Palette },
  { id: "cortinas", label: "Cortinas", icon: Clapperboard },
  { id: "overlays", label: "Overlays OBS", icon: SlidersHorizontal },
];

const ACCENTS: Array<{ id: AccentColor; label: string; color: string }> = [
  { id: "magenta", label: "Magenta", color: "#E6009E" },
  { id: "lime", label: "Lima", color: "#B5F43D" },
  { id: "yellow", label: "Amarillo", color: "#FFD400" },
  { id: "cyan", label: "Cian", color: "#00A8E8" },
];

const SCENE_ACCENTS: SceneAccent[] = ["fuchsia", "lime", "yellow", "cyan"];

const CALVITO_LABELS: Record<CalvitoKey, string> = {
  bombero: "Bombero",
  chef: "Chef",
  constructor: "Constructor",
  doctor: "Doctor",
  doctora: "Doctora",
  ejecutivo: "Ejecutivo",
  empresaria: "Empresaria",
  piloto: "Piloto",
  "policia-calvita": "Policía Calvita",
  policia: "Policía",
};

const SCENE_TYPES: Array<{ id: "all" | SceneType; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "basicas", label: "Básicas" },
  { id: "general", label: "Generales" },
  { id: "cuenta", label: "Cuentas" },
  { id: "hora", label: "Horas" },
  { id: "casa", label: "Casa" },
  { id: "bloque", label: "Bloques" },
];

const MARKETING_CATEGORIES: Array<{
  id: "all" | AdCategory;
  label: string;
  short: string;
}> = [
  { id: "all", label: "Todas las piezas", short: "Todas" },
  { id: "horas", label: "Horas en vivo", short: "Horas" },
  { id: "suenos", label: "Sueños de los Calvitos", short: "Sueños" },
  { id: "bloques", label: "Bloques y agenda", short: "Bloques" },
  { id: "donar", label: "Donar y causa", short: "Donar" },
  { id: "carruseles", label: "Carruseles", short: "Carruseles" },
  { id: "overlays", label: "Capas PNG transparentes", short: "Capas PNG" },
];

const CATEGORY_NOTES: Partial<Record<AdCategory, string>> = {
  horas: "Piezas para anunciar cuántas horas lleva la maratón al aire.",
  suenos: "Sueños de los Calvitos: globos, escenas 3D y retratos de la causa.",
  bloques: "Entradas y afiches de cada bloque de la programación.",
  donar: "Piezas de conversión: cómo donar, avance de la casa y QR.",
  carruseles:
    "Cada carrusel tiene 5 slides. Se editan uno por uno y se descargan todas en un ZIP.",
  overlays:
    "PNG con fondo transparente para poner encima de una historia de Instagram, un Reel o un video. El centro queda vacío a propósito.",
};

const COPY_FIELDS: Array<{
  key: keyof StreamingCopy;
  label: string;
  placeholder: string;
  hint?: string;
}> = [
  {
    key: "donateUrl",
    label: "URL para donar",
    placeholder: "https://supercasa.svgvisual.com/donar",
    hint: "El QR también apunta aquí. Debe ser un enlace de svgvisual.com.",
  },
  {
    key: "liveUrl",
    label: "URL del en vivo",
    placeholder: "https://supercasa.svgvisual.com/envivo",
    hint: "Se usa cuando el QR apunta a la transmisión. Debe ser de svgvisual.com.",
  },
  {
    key: "breB",
    label: "Llave Bre-B",
    placeholder: "Bre-B @lasupercasa",
  },
  {
    key: "bank",
    label: "Cuenta bancaria",
    placeholder: "Bancolombia 186-000090-54",
  },
  {
    key: "hashtag",
    label: "Hashtag",
    placeholder: "#PonteLaCapa",
  },
  {
    key: "igFsv",
    label: "Instagram de la Fundación",
    placeholder: "@segundosdevidafundacion",
  },
  {
    key: "igKav",
    label: "Instagram de Kavanah",
    placeholder: "@kavanahpl35",
  },
];

function sceneShowsProgress(scene: SceneDef): boolean {
  return scene.visual === "house" || ["meta", "fondo-live", "marco-live"].includes(scene.id);
}

function sceneShowsStyle(scene: SceneDef): boolean {
  return scene.kind === "full" && scene.visual !== "liveframe";
}

function sceneProgressLabel(scene: SceneDef): string {
  if (scene.visual === "house") return "Avance de la obra";
  if (scene.id === "meta") return "Barra de la meta";
  return "Avance del recaudo";
}

type SceneFieldVisibility = {
  badge?: boolean;
  eyebrow?: boolean;
  title?: boolean;
  subtitle?: boolean;
  note?: boolean;
  cta?: boolean;
  count?: boolean;
  guest?: boolean;
  returnAt?: boolean;
  progress?: boolean;
  style?: boolean;
  qr?: boolean;
};

function sceneFields(scene: SceneDef): SceneFieldVisibility {
  const isCount = Boolean(scene.countValue);
  if (scene.kind === "full") {
    if (scene.visual === "liveframe") {
      return {
        eyebrow: true,
        title: true,
        subtitle: true,
        note: true,
        cta: true,
        progress: true,
        qr: true,
      };
    }
    return {
      badge: true,
      eyebrow: true,
      title: !isCount && scene.id !== "invitado",
      subtitle: true,
      note: true,
      cta: true,
      count: isCount,
      guest: scene.id === "invitado",
      returnAt: scene.id === "ya-volvemos",
      progress: sceneShowsProgress(scene),
      style: sceneShowsStyle(scene),
      qr: true,
    };
  }

  if (scene.id === "lower-third") return { eyebrow: true, guest: true };
  if (scene.id === "meta") {
    return { eyebrow: true, cta: true, progress: true, qr: true };
  }
  if (scene.id === "reloj") return { eyebrow: true, cta: true, qr: true };
  if (scene.id === "en-vivo") return { title: true };
  if (scene.id === "donacion") {
    return { eyebrow: true, title: true, subtitle: true, note: true, qr: true };
  }
  if (scene.id === "en-vivo-qr") return { eyebrow: true, cta: true, qr: true };
  if (scene.id === "mosca") return { cta: true };
  if (scene.visual === "liveframe") {
    return {
      eyebrow: true,
      title: true,
      subtitle: true,
      note: true,
      cta: true,
      progress: true,
      qr: true,
    };
  }
  return { qr: true };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          const done = () => resolve();
          image.addEventListener("load", done, { once: true });
          image.addEventListener("error", done, { once: true });
        }),
    ),
  );
}

function sceneType(scene: SceneDef): SceneType {
  if (scene.group === "bloque") return "bloque";
  if (scene.id.startsWith("empezamos-")) return "cuenta";
  if (scene.group === "hora") return "hora";
  if (scene.visual === "house") return "casa";
  return "general";
}

function formatLabel(format: AdFormat): string {
  if (format === "story") return "Historia";
  if (format === "post") return "Post";
  return "Carrusel";
}

function categoryLabel(category: AdCategory): string {
  return MARKETING_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15";

function EditorShell({
  title,
  subtitle,
  onClose,
  preview,
  form,
  footer,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  preview: React.ReactNode;
  form: React.ReactNode;
  footer: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex bg-slate-950/60 sm:p-6">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-3xl">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E6009E]">
              {subtitle}
            </p>
            <h2 className="truncate text-base font-extrabold text-[#0F2354]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar editor"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </header>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)] lg:overflow-hidden">
          <div className="min-w-0 bg-slate-100 p-4 lg:overflow-auto">{preview}</div>
          <div className="min-w-0 space-y-4 p-4 lg:overflow-auto">{form}</div>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      </div>
    </div>
  );
}

function ScenePreview({
  scene,
  copy,
  captureRef,
}: {
  scene: SceneDef;
  copy?: StreamingCopy;
  captureRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const update = () => setScale(node.clientWidth / 1920);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const overlay = scene.kind === "overlay";

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-300 ${
        overlay ? "scene-preview--overlay" : "bg-[#0B1A3D]"
      }`}
    >
      <div
        ref={captureRef}
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <SceneView scene={scene} render copy={copy} />
      </div>
    </div>
  );
}

function MarketingCard({
  creative,
  edit,
  onOpen,
}: {
  creative: AdCreative;
  edit?: CreativeEdit;
  onOpen: () => void;
}) {
  const first = creative.slides[0];
  const merged: CreativeSlide = edit?.slides[first.id]
    ? { ...first, ...edit.slides[first.id] }
    : first;
  const isOverlay = creative.category === "overlays";
  const theme = edit?.theme ?? creative.defaultTheme;
  const aspect = edit?.aspect ?? creative.defaultAspect;
  const size = aspect === "9:16" ? { w: 360, h: 640 } : aspect === "1:1" ? { w: 360, h: 360 } : { w: 360, h: 450 };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E6009E]/40 hover:shadow-md">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div
          className={`relative aspect-[4/5] overflow-hidden ${
            isOverlay ? "scene-preview--overlay" : "bg-[#071127]"
          }`}
        >
          <LiveThumb designWidth={size.w} designHeight={size.h} className="absolute inset-0">
            <AdCanvasPreview
              creative={creative}
              slide={merged}
              theme={theme}
              aspect={aspect}
              hoursValue={edit?.hoursValue}
              kickHandle={edit?.kickHandle}
              showQrOverride={edit?.showQr}
              qrTargetOverride={edit?.qrTarget}
              thumbnail
            />
          </LiveThumb>
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#0F2354]">
            {formatLabel(creative.format)}
          </span>
          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#0F2354]/85 text-white opacity-0 transition group-hover:opacity-100">
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          {isOverlay ? (
            <span className="absolute bottom-2 left-2 rounded-full bg-[#0F2354]/90 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
              PNG transparente
            </span>
          ) : null}
          {creative.slides.length > 1 ? (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 text-[9px] font-extrabold text-white">
              {creative.slides.length} slides
            </span>
          ) : null}
        </div>
        <div className="p-3 pb-2">
          <p className="line-clamp-2 text-xs font-extrabold leading-tight text-[#0F2354]">
            {creative.title}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-slate-400">
            {edit ? "Editado · toca para abrir" : "Toca para editar"}
          </p>
        </div>
      </button>
      <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#E6009E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#B8007E]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Editar
        </button>
        <ObsCopyButton path={creativePath(creative.id, first.slideNumber ?? 1)} />
      </div>
    </article>
  );
}

function SceneCard({
  scene,
  edit,
  copy,
  onOpen,
}: {
  scene: SceneDef;
  edit?: SceneOverride;
  copy?: StreamingCopy;
  onOpen: () => void;
}) {
  const overlay = scene.kind === "overlay";
  const merged = mergeScene(scene, edit);
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E6009E]/40 hover:shadow-md">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div
          className={`relative aspect-video overflow-hidden ${
            overlay ? "scene-preview--overlay" : "bg-[#0B1A3D]"
          }`}
        >
          <LiveThumb designWidth={1920} designHeight={1080} className="absolute inset-0">
            <SceneView scene={merged} render copy={copy} frozen />
          </LiveThumb>
          <span className="absolute left-2 top-2 rounded-full bg-[#FFD400] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#0B1A3D]">
            {overlay
              ? "Overlay"
              : scene.group === "bloque"
                ? `Bloque ${scene.number}`
                : isBasicScene(scene)
                  ? "Básica"
                  : "Cortina"}
          </span>
          {edit ? (
            <span className="absolute bottom-2 left-2 rounded-full bg-[#E6009E] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
              Editada
            </span>
          ) : null}
          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#0F2354]/85 text-white opacity-0 transition group-hover:opacity-100">
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
        <div className="p-3 pb-2">
          <p className="line-clamp-2 text-xs font-extrabold leading-tight text-[#0F2354]">
            {scene.label}
          </p>
          <p className="mt-1 line-clamp-2 text-[10px] font-semibold text-slate-400">{scene.when}</p>
        </div>
      </button>
      <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#E6009E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#B8007E]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Editar
        </button>
        <ObsCopyButton path={scenePath(scene, edit)} />
      </div>
    </article>
  );
}

export default function ContentStudio({
  role,
  user,
  marketing,
  content,
  initialTab,
  initialScene,
  embedded = false,
  onClose,
  onSaved,
}: {
  role: string;
  user: string;
  marketing: MarketingState;
  content: StreamingContent;
  initialTab?: Tab;
  initialScene?: string;
  embedded?: boolean;
  onClose?: () => void;
  onSaved?: (content: StreamingContent) => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "marketing");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"all" | AdFormat>("all");
  const [category, setCategory] = useState<"all" | AdCategory>("all");
  const [sceneFilter, setSceneFilter] = useState<"all" | SceneType>("all");
  const [marketingState, setMarketingState] = useState(marketing);
  const [contentState, setContentState] = useState(content);
  const [copyDraft, setCopyDraft] = useState<StreamingCopy>(content.copy ?? {});
  const [showCampaign, setShowCampaign] = useState(false);
  const [selectedCreative, setSelectedCreative] = useState<AdCreative | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [draft, setDraft] = useState<CreativeEdit>({ slides: {} });
  const [selectedScene, setSelectedScene] = useState<SceneDef | null>(() =>
    initialScene ? SCENES.find((scene) => scene.id === initialScene) ?? null : null,
  );
  const [sceneDraft, setSceneDraft] = useState<SceneOverride>(() => {
    if (!initialScene) return {};
    return clone(content.scenes[initialScene] ?? {});
  });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const filteredCreatives = useMemo(() => {
    const term = query.trim().toLowerCase();
    return AD_CREATIVES.filter((creative) => {
      if (format !== "all" && creative.format !== format) return false;
      if (category !== "all" && creative.category !== category) return false;
      if (!term) return true;
      return `${creative.title} ${creative.subtitle} ${creative.slides
        .map((slide) => `${slide.headline} ${slide.body}`)
        .join(" ")}`
        .toLowerCase()
        .includes(term);
    });
  }, [query, format, category]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: AD_CREATIVES.length };
    for (const creative of AD_CREATIVES) {
      counts[creative.category] = (counts[creative.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const mergedSlides = useMemo<CreativeSlide[]>(() => {
    if (!selectedCreative) return [];
    return selectedCreative.slides.map((item) => ({
      ...item,
      ...(draft.slides[item.id] ?? {}),
    }));
  }, [selectedCreative, draft]);

  const filteredScenes = useMemo(() => {
    const term = query.trim().toLowerCase();
    return SCENES.filter((scene) => {
      if (tab === "overlays" && scene.kind !== "overlay") return false;
      if (tab === "cortinas" && scene.kind !== "full") return false;
      if (sceneFilter === "basicas") {
        if (!isBasicScene(scene)) return false;
      } else if (sceneFilter !== "all" && sceneType(scene) !== sceneFilter) {
        return false;
      }
      if (!term) return true;
      return `${scene.label} ${scene.title} ${scene.subtitle}`
        .toLowerCase()
        .includes(term);
    });
  }, [tab, query, sceneFilter]);

  const openCreative = (creative: AdCreative) => {
    setSelectedScene(null);
    setSelectedCreative(creative);
    setSlideIndex(0);
    setDraft(clone(marketingState.edits[creative.id] ?? { slides: {} }));
    setStatus("");
    setError("");
  };

  const openScene = (scene: SceneDef) => {
    setSelectedCreative(null);
    setSelectedScene(scene);
    setSceneDraft(clone(contentState.scenes[scene.id] ?? {}));
    setStatus("");
    setError("");
  };

  const closeEditor = () => {
    setSelectedCreative(null);
    setSelectedScene(null);
    setStatus("");
    setError("");
    if (embedded) onClose?.();
  };

  const updateSlide = (patch: Partial<SlideEdit>) => {
    if (!selectedCreative) return;
    const slide = selectedCreative.slides[slideIndex];
    setDraft((current) => ({
      ...current,
      slides: {
        ...current.slides,
        [slide.id]: { ...current.slides[slide.id], ...patch },
      },
    }));
  };

  const updateCreative = (patch: Partial<CreativeEdit>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const saveMarketing = async () => {
    if (!selectedCreative) return;
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const edits = { ...marketingState.edits, [selectedCreative.id]: draft };
      const response = await fetch("/api/admin/marketing/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits }),
      });
      const body = (await response.json()) as MarketingState & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo guardar.");
        return;
      }
      setMarketingState(body);
      setStatus("Guardado. La próxima vez que abras este creative vas a ver tus textos.");
    } catch {
      setError("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const resetMarketing = async () => {
    if (!selectedCreative) return;
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const edits = { ...marketingState.edits };
      delete edits[selectedCreative.id];
      const response = await fetch("/api/admin/marketing/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edits }),
      });
      const body = (await response.json()) as MarketingState & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo restablecer.");
        return;
      }
      setMarketingState(body);
      setDraft({ slides: {} });
      setStatus("Volvió al texto original.");
    } catch {
      setError("Error de conexión al restablecer.");
    } finally {
      setSaving(false);
    }
  };

  const saveScene = async () => {
    if (!selectedScene) return;
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const scenes = { ...contentState.scenes, [selectedScene.id]: sceneDraft };
      const response = await fetch("/api/admin/streaming/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes, copy: copyDraft }),
      });
      const body = (await response.json()) as StreamingContent & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo guardar.");
        return;
      }
      setContentState(body);
      setCopyDraft(body.copy ?? {});
      onSaved?.(body);
      setStatus(
        "Guardado. La fuente de OBS toma estos textos en el próximo refresco. Si la escena está al aire, coordina con David.",
      );
    } catch {
      setError("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const resetScene = async () => {
    if (!selectedScene) return;
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const scenes = { ...contentState.scenes };
      delete scenes[selectedScene.id];
      const response = await fetch("/api/admin/streaming/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes, copy: copyDraft }),
      });
      const body = (await response.json()) as StreamingContent & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo restablecer.");
        return;
      }
      setContentState(body);
      setCopyDraft(body.copy ?? {});
      onSaved?.(body);
      setSceneDraft({});
      setStatus("Volvió al diseño original.");
    } catch {
      setError("Error de conexión al restablecer.");
    } finally {
      setSaving(false);
    }
  };

  const saveCopy = async () => {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes: contentState.scenes, copy: copyDraft }),
      });
      const body = (await response.json()) as StreamingContent & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudieron guardar los datos.");
        return;
      }
      setContentState(body);
      setCopyDraft(body.copy ?? {});
      setStatus("Datos de campaña guardados. Se aplican a todas las cortinas y overlays.");
    } catch {
      setError("Error de conexión al guardar los datos.");
    } finally {
      setSaving(false);
    }
  };

  const resetCopy = () => {
    setCopyDraft({});
    setStatus("Datos en blanco. Guarda para volver a los valores originales.");
  };

  const downloadMarketing = async () => {
    if (!selectedCreative) return;
    const slide = selectedCreative.slides[slideIndex];
    const mergedSlide: CreativeSlide = {
      ...slide,
      ...(draft.slides[slide.id] ?? {}),
    };
    setExporting(true);
    setError("");
    try {
      await downloadAdPng(
        {
          creative: selectedCreative,
          slide: mergedSlide,
          theme: draft.theme ?? selectedCreative.defaultTheme,
          aspect: draft.aspect ?? selectedCreative.defaultAspect,
          hoursValue: draft.hoursValue,
          kickHandle: draft.kickHandle,
          showQrOverride: draft.showQr,
          qrTargetOverride: draft.qrTarget,
        },
        `supercasa-${selectedCreative.id}-${slide.slideNumber}.png`,
      );
    } catch {
      setError("No se pudo generar el PNG. Intenta de nuevo.");
    } finally {
      setExporting(false);
    }
  };

  const downloadCarousel = async () => {
    if (!selectedCreative || selectedCreative.slides.length < 2) return;
    const total = selectedCreative.slides.length;
    setExporting(true);
    setError("");
    setStatus("");
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const folder = `supercasa-${selectedCreative.id}`;
      for (let index = 0; index < mergedSlides.length; index += 1) {
        setStatus(`Generando slide ${index + 1} de ${total}...`);
        const dataUrl = await renderAdToDataUrl({
          creative: selectedCreative,
          slide: mergedSlides[index],
          theme: draft.theme ?? selectedCreative.defaultTheme,
          aspect: draft.aspect ?? selectedCreative.defaultAspect,
          hoursValue: draft.hoursValue,
          kickHandle: draft.kickHandle,
          showQrOverride: draft.showQr,
          qrTargetOverride: draft.qrTarget,
        });
        const base64 = dataUrl.split(",")[1] ?? "";
        zip.file(`${folder}/slide-${String(index + 1).padStart(2, "0")}.png`, base64, {
          base64: true,
        });
      }
      const caption = (draft.caption ?? selectedCreative.caption ?? "").trim();
      if (caption) zip.file(`${folder}/caption.txt`, caption);
      setStatus("Comprimiendo el ZIP...");
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${folder}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus(`${total} imágenes y el caption descargados en un ZIP.`);
    } catch {
      setError("No se pudo generar el carrusel completo. Intenta slide por slide.");
    } finally {
      setExporting(false);
    }
  };

  const downloadScene = async () => {
    if (!selectedScene || !captureRef.current) return;
    setExporting(true);
    setError("");
    const node = captureRef.current;
    const previous = node.style.transform;
    node.style.transform = "none";
    try {
      await waitForImages(node);
      const merged = mergeScene(selectedScene, sceneDraft);
      const dataUrl = await toPng(node, {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor:
          merged.kind === "overlay" ? "transparent" : "#0b1a3d",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `supercasa-${selectedScene.id}-editado.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setError("No se pudo generar el PNG. Prueba desde la fuente de OBS.");
    } finally {
      node.style.transform = previous;
      setExporting(false);
    }
  };

  const copyCaption = async () => {
    if (!selectedCreative) return;
    try {
      await navigator.clipboard.writeText(
        draft.caption ?? selectedCreative.caption,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const slide = selectedCreative?.slides[slideIndex];
  const slideEdit = slide && selectedCreative ? draft.slides[slide.id] ?? {} : {};
  const mergedSlide: CreativeSlide | null = slide
    ? { ...slide, ...slideEdit }
    : null;
  const theme = selectedCreative
    ? draft.theme ?? selectedCreative.defaultTheme
    : "cortina";
  const aspect = selectedCreative
    ? draft.aspect ?? selectedCreative.defaultAspect
    : "9:16";
  const defaultQrTarget = selectedCreative
    ? creativeQrFallback(selectedCreative)
    : "live";
  const effectiveQrTarget =
    slide && selectedCreative
      ? resolveQrTarget(slide, draft.qrTarget, defaultQrTarget)
      : defaultQrTarget;
  const qrMode = draft.showQr === false ? "none" : effectiveQrTarget;
  const progressOn = slideEdit.showProgressBar ?? Boolean(slide?.showProgressBar);
  const progressValue = slideEdit.progressPercent ?? slide?.progressPercent ?? 60;
  const scheduleRows = slideEdit.scheduleRows ?? slide?.scheduleRows ?? [];
  const tierRows = slideEdit.tierRows ?? slide?.tierRows ?? [];
  const copyResolved = resolveStreamingCopy(copyDraft);

  const setScheduleRows = (
    rows: Array<{ time: string; title: string; host: string }>,
  ) => updateSlide({ scheduleRows: rows });

  const updateScheduleRow = (
    index: number,
    patch: Partial<{ time: string; title: string; host: string }>,
  ) => {
    setScheduleRows(
      scheduleRows.map((row, position) =>
        position === index ? { ...row, ...patch } : row,
      ),
    );
  };

  const setTierRows = (
    rows: Array<{ label: string; amount: string; note: string }>,
  ) => updateSlide({ tierRows: rows });

  const updateTierRow = (
    index: number,
    patch: Partial<{ label: string; amount: string; note: string }>,
  ) => {
    setTierRows(
      tierRows.map((row, position) =>
        position === index ? { ...row, ...patch } : row,
      ),
    );
  };

  const setQrMode = (mode: "default" | "live" | "donate" | "none") => {
    if (mode === "default") {
      updateCreative({ showQr: undefined, qrTarget: undefined });
    } else if (mode === "none") {
      updateCreative({ showQr: false, qrTarget: undefined });
    } else if (mode === "live") {
      updateCreative({ showQr: true, qrTarget: "live" });
    } else {
      updateCreative({ showQr: true, qrTarget: "donate" });
    }
  };

  const mergedScene = selectedScene
    ? mergeScene(selectedScene, sceneDraft)
    : null;
  const sceneForm = selectedScene ? sceneFields(selectedScene) : null;
  const sceneQrTarget = sceneDraft.qrTarget ?? selectedScene?.qrTarget ?? "donate";
  const sceneProgressLive =
    sceneDraft.progressLive ??
    selectedScene?.progressLive ??
    Boolean(selectedScene?.houseLive);
  const sceneProgressPercent =
    sceneDraft.progressPercent ??
    selectedScene?.progressPercent ??
    selectedScene?.houseFrame ??
    60;

  const editedCount = Object.keys(marketingState.edits).length;
  const editedScenes = Object.keys(contentState.scenes).length;

  return (
    <div className="space-y-5">
      {!embedded ? (
        <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Estudio de contenido
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#0F2354]">
              Toca una pieza, edita los textos y descarga
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
              Marketing (historias, posts, carruseles y capas PNG transparentes), cortinas y
              overlays de OBS en un solo lugar. Guarda los cambios para que la fuente de OBS los
              tome, o descarga el PNG con lo que editaste sin guardar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="rounded-full bg-[#B5F43D]/25 px-3 py-1.5 text-[#4d7a00]">
              {editedCount} creatives editados
            </span>
            <span className="rounded-full bg-[#00A8E8]/12 px-3 py-1.5 text-[#0077a8]">
              {editedScenes} escenas editadas
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-500">
              {role === "marketing" ? "Marketing" : "Admin"} · {user}
            </span>
            <a
              href="/admin/streaming?tab=presets"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#E6009E]/10 px-3 py-1.5 text-[#B8007E] transition hover:bg-[#E6009E]/15"
            >
              <Layers className="h-3 w-3" strokeWidth={2} />
              Moscas y agenda
            </a>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setQuery("");
                  setSceneFilter("all");
                }}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-[#0F2354] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F2354]"
                }`}
                aria-pressed={active}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {tab === "marketing"
            ? `${filteredCreatives.length} de ${AD_CREATIVES.length} creatives`
            : `${filteredScenes.length} piezas`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              tab === "marketing" ? "Buscar creative o texto" : "Buscar cortina u overlay"
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
          />
        </div>

        {tab === "marketing" ? (
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as "all" | AdFormat)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#0F2354] outline-none"
          >
            <option value="all">Todos los formatos</option>
            <option value="story">Historias</option>
            <option value="post">Posts</option>
            <option value="carousel">Carruseles</option>
          </select>
        ) : (
          <div className="flex flex-wrap gap-1">
            {SCENE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSceneFilter(type.id)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition ${
                  sceneFilter === type.id
                    ? "bg-[#0F2354] text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-[#0F2354]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "marketing" ? (
        <div className="space-y-2">
          <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
            {MARKETING_CATEGORIES.map((item) => {
              const active = category === item.id;
              const count = categoryCounts[item.id] ?? 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  aria-pressed={active}
                  title={item.label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider transition ${
                    active
                      ? "bg-[#0F2354] text-white"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-[#0F2354]"
                  }`}
                >
                  {item.short}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                      active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {category !== "all" ? (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
              {CATEGORY_NOTES[category]}
            </p>
          ) : null}
        </div>
      ) : null}

      {tab !== "marketing" ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setShowCampaign((current) => !current)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
            aria-expanded={showCampaign}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E6009E]">
                Datos de campaña
              </p>
              <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-500">
                URLs, Bre-B, banco, hashtag e Instagram. Se aplican a todas las cortinas y
                overlays.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              {showCampaign ? "Ocultar" : "Editar"}
            </span>
          </button>
          {showCampaign ? (
            <div className="space-y-3 border-t border-slate-100 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {COPY_FIELDS.map((field) => (
                  <Field key={field.key} label={field.label}>
                    <input
                      value={copyDraft[field.key] ?? ""}
                      onChange={(event) =>
                        setCopyDraft((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder={field.placeholder}
                    />
                    {field.hint ? (
                      <span className="mt-1 block text-[10px] leading-snug text-slate-400">
                        {field.hint}
                      </span>
                    ) : null}
                  </Field>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={saveCopy}
                  disabled={saving}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F2354] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#183478] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Save className="h-4 w-4" strokeWidth={2} />
                  )}
                  Guardar datos
                </button>
                <button
                  type="button"
                  onClick={resetCopy}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                  Volver a los originales
                </button>
                <span className="text-[11px] font-semibold text-slate-500">{status}</span>
                {error ? (
                  <span className="text-[11px] font-semibold text-red-700">{error}</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "marketing" ? (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredCreatives.map((creative) => (
            <MarketingCard
              key={creative.id}
              creative={creative}
              edit={marketingState.edits[creative.id]}
              onOpen={() => openCreative(creative)}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              edit={contentState.scenes[scene.id]}
              copy={copyDraft}
              onOpen={() => openScene(scene)}
            />
          ))}
        </div>
      )}

      {selectedCreative && slide && mergedSlide ? (
        <EditorShell
          title={selectedCreative.title}
          subtitle={`${formatLabel(selectedCreative.format)} · ${categoryLabel(
            selectedCreative.category,
          )}`}
          onClose={closeEditor}
          preview={
            <div className="mx-auto w-full max-w-[240px] sm:max-w-[360px] lg:max-w-[460px]">
              <AdCanvasPreview
                creative={selectedCreative}
                slide={mergedSlide}
                theme={theme}
                aspect={aspect}
                hoursValue={draft.hoursValue}
                kickHandle={draft.kickHandle}
                showQrOverride={draft.showQr}
                qrTargetOverride={draft.qrTarget}
              />
              {selectedCreative.slides.length > 1 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {selectedCreative.slides.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSlideIndex(index)}
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        index === slideIndex
                          ? "bg-[#0F2354] text-white"
                          : "bg-white text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      Slide {index + 1}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          }
          form={
            <>
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
                Editas este slide. Los demás slides del carrusel se editan cambiando de slide
                arriba del preview.
              </div>
              <Field label="Kicker">
                <input
                  value={slideEdit.kicker ?? slide.kicker}
                  onChange={(event) => updateSlide({ kicker: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Titular">
                <textarea
                  rows={2}
                  value={slideEdit.headline ?? slide.headline}
                  onChange={(event) => updateSlide({ headline: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Globo de diálogo">
                <textarea
                  rows={2}
                  value={slideEdit.speechBubble ?? slide.speechBubble ?? ""}
                  onChange={(event) => updateSlide({ speechBubble: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Texto de apoyo">
                <textarea
                  rows={3}
                  value={slideEdit.body ?? slide.body}
                  onChange={(event) => updateSlide({ body: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Etiqueta del enlace">
                  <input
                    value={slideEdit.urlLabel ?? slide.urlLabel}
                    onChange={(event) => updateSlide({ urlLabel: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Enlace o texto">
                  <input
                    value={slideEdit.urlText ?? slide.urlText}
                    onChange={(event) => updateSlide({ urlText: event.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Color de acento">
                  <select
                    value={slideEdit.accentColor ?? slide.accentColor ?? "magenta"}
                    onChange={(event) =>
                      updateSlide({ accentColor: event.target.value as AccentColor })
                    }
                    className={inputClass}
                  >
                    {ACCENTS.map((accent) => (
                      <option key={accent.id} value={accent.id}>
                        {accent.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Número grande">
                  <input
                    value={slideEdit.giantNumber ?? slide.giantNumber ?? ""}
                    onChange={(event) => updateSlide({ giantNumber: event.target.value })}
                    className={inputClass}
                    placeholder="Ej. 24"
                  />
                </Field>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#0F2354]">Avance de la obra</p>
                    <p className="text-[10px] leading-snug text-slate-500">
                      Barra y etiquetas de porcentaje de esta pieza.
                    </p>
                  </div>
                  <label className="flex min-h-[36px] shrink-0 items-center gap-2 text-[11px] font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={progressOn}
                      onChange={(event) =>
                        updateSlide({ showProgressBar: event.target.checked })
                      }
                      className="h-4 w-4 accent-[#E6009E]"
                    />
                    Mostrar
                  </label>
                </div>
                {progressOn ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={progressValue}
                        onChange={(event) =>
                          updateSlide({ progressPercent: Number(event.target.value) })
                        }
                        className="flex-1 accent-[#E6009E]"
                        aria-label="Porcentaje de avance"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={5}
                          value={progressValue}
                          onChange={(event) =>
                            updateSlide({
                              progressPercent: Math.max(
                                0,
                                Math.min(100, Number(event.target.value) || 0),
                              ),
                            })
                          }
                          className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-[#E6009E]"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[25, 50, 60, 75, 100].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateSlide({ progressPercent: value })}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            progressValue === value
                              ? "bg-[#0F2354] text-white"
                              : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                          }`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] leading-snug text-slate-500">
                      Cambia la barra y las etiquetas HOY y OBRA REAL del preview y del PNG.
                    </p>
                  </div>
                ) : null}
              </div>

              {selectedCreative.supportsHourCounter ||
              selectedCreative.supportsKickHandle ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedCreative.supportsHourCounter ? (
                    <Field label="Horas en vivo">
                      <input
                        value={draft.hoursValue ?? selectedCreative.defaultHourValue ?? "12"}
                        onChange={(event) => updateCreative({ hoursValue: event.target.value })}
                        className={inputClass}
                        placeholder="Ej. 12"
                      />
                    </Field>
                  ) : null}
                  {selectedCreative.supportsKickHandle ? (
                    <Field label="Usuario de Kick">
                      <input
                        value={draft.kickHandle ?? selectedCreative.defaultKickHandle ?? "deivid"}
                        onChange={(event) => updateCreative({ kickHandle: event.target.value })}
                        className={inputClass}
                        placeholder="Ej. deivid"
                      />
                    </Field>
                  ) : null}
                </div>
              ) : null}

              {scheduleRows.length > 0 ? (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold text-[#0F2354]">Agenda del carrusel</p>
                  {scheduleRows.map((row, index) => (
                    <div
                      key={index}
                      className="grid gap-2 sm:grid-cols-[92px_1fr_1fr_auto]"
                    >
                      <input
                        value={row.time}
                        onChange={(event) =>
                          updateScheduleRow(index, { time: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Hora"
                      />
                      <input
                        value={row.title}
                        onChange={(event) =>
                          updateScheduleRow(index, { title: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Bloque"
                      />
                      <input
                        value={row.host}
                        onChange={(event) =>
                          updateScheduleRow(index, { host: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Invitado"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setScheduleRows(
                            scheduleRows.filter((_, position) => position !== index),
                          )
                        }
                        aria-label="Quitar fila de agenda"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setScheduleRows([...scheduleRows, { time: "", title: "", host: "" }])
                    }
                    className="text-[11px] font-bold text-[#E6009E]"
                  >
                    Agregar fila
                  </button>
                </div>
              ) : null}

              {tierRows.length > 0 ? (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold text-[#0F2354]">Niveles de donación</p>
                  {tierRows.map((row, index) => (
                    <div
                      key={index}
                      className="grid gap-2 sm:grid-cols-[1fr_110px_1.4fr_auto]"
                    >
                      <input
                        value={row.label}
                        onChange={(event) =>
                          updateTierRow(index, { label: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Nombre"
                      />
                      <input
                        value={row.amount}
                        onChange={(event) =>
                          updateTierRow(index, { amount: event.target.value })
                        }
                        className={inputClass}
                        placeholder="$20.000"
                      />
                      <input
                        value={row.note}
                        onChange={(event) =>
                          updateTierRow(index, { note: event.target.value })
                        }
                        className={inputClass}
                        placeholder="Qué incluye"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setTierRows(
                            tierRows.filter((_, position) => position !== index),
                          )
                        }
                        aria-label="Quitar nivel de donación"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setTierRows([...tierRows, { label: "", amount: "", note: "" }])
                    }
                    className="text-[11px] font-bold text-[#E6009E]"
                  >
                    Agregar nivel
                  </button>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Tema">
                  <select
                    value={theme}
                    onChange={(event) =>
                      updateCreative({ theme: event.target.value as CreativeEdit["theme"] })
                    }
                    className={inputClass}
                  >
                    <option value="cortina">Cortina</option>
                    <option value="calvito">Calvito</option>
                  </select>
                </Field>
                <Field label="Formato">
                  <select
                    value={aspect}
                    onChange={(event) =>
                      updateCreative({ aspect: event.target.value as AdAspect })
                    }
                    className={inputClass}
                  >
                    <option value="9:16">9:16 Historia</option>
                    <option value="4:5">4:5 Post</option>
                    <option value="1:1">1:1 Cuadrado</option>
                  </select>
                </Field>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold text-[#0F2354]">
                  Código QR y enlace
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {(
                    [
                      { id: "donate", label: "Donaciones" },
                      { id: "live", label: "Transmisión" },
                    ] as const
                  ).map((option) => {
                    const active = qrMode !== "none" && effectiveQrTarget === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setQrMode(option.id)}
                        aria-pressed={active}
                        className={`min-h-[40px] rounded-lg px-2 py-1.5 text-[10px] font-extrabold transition ${
                          active
                            ? "bg-[#0F2354] text-white"
                            : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <label className="mt-2 flex items-center gap-2 text-[11px] font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={qrMode !== "none"}
                    onChange={(event) => {
                      if (event.target.checked) setQrMode(effectiveQrTarget);
                      else setQrMode("none");
                    }}
                    className="h-4 w-4 accent-[#E6009E]"
                  />
                  Mostrar QR en la pieza
                </label>
                <p className="mt-1 text-[10px] leading-snug text-slate-500">
                  {qrMode === "none"
                    ? "La pieza sale sin QR."
                    : `Apunta a ${displayUrl(
                        effectiveQrTarget === "live"
                          ? copyResolved.liveUrl
                          : copyResolved.donateUrl,
                      )}`}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-slate-400">
                  Por defecto, las piezas de redes apuntan al vivo. La categoría Donar apunta a
                  donaciones.
                </p>
              </div>
              <Field label="Caption para redes">
                <textarea
                  rows={5}
                  value={draft.caption ?? selectedCreative.caption}
                  onChange={(event) => updateCreative({ caption: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <button
                type="button"
                onClick={copyCaption}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                )}
                {copied ? "Caption copiado" : "Copiar caption"}
              </button>
              <p className="text-[10px] leading-snug text-slate-500">
                El botón OBS copia el link del slide. Guarda antes para que OBS tome los últimos
                cambios.
              </p>
            </>
          }
          footer={
            <>
              <button
                type="button"
                onClick={saveMarketing}
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F2354] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#183478] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Save className="h-4 w-4" strokeWidth={2} />
                )}
                Guardar
              </button>
              <button
                type="button"
                onClick={resetMarketing}
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                Restablecer
              </button>
              <ObsCopyButton
                path={creativePath(
                  selectedCreative.id,
                  slide.slideNumber ?? slideIndex + 1,
                )}
                className="min-h-[44px] rounded-lg px-4"
              />
              <button
                type="button"
                onClick={downloadMarketing}
                disabled={exporting}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#E6009E] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-60"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Download className="h-4 w-4" strokeWidth={2} />
                )}
                {selectedCreative.slides.length > 1 ? "Descargar slide" : "Descargar PNG"}
              </button>
              {selectedCreative.slides.length > 1 ? (
                <button
                  type="button"
                  onClick={downloadCarousel}
                  disabled={exporting}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E6009E] bg-white px-4 py-2 text-xs font-extrabold text-[#E6009E] transition hover:bg-[#E6009E]/5 disabled:opacity-60"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Layers className="h-4 w-4" strokeWidth={2} />
                  )}
                  Descargar carrusel (ZIP)
                </button>
              ) : null}
              <span className="text-[11px] font-semibold text-slate-500">{status}</span>
              {error ? (
                <span className="text-[11px] font-semibold text-red-700">{error}</span>
              ) : null}
            </>
          }
        />
      ) : null}
        </>
      ) : null}

      {selectedScene && mergedScene ? (
        <EditorShell
          title={selectedScene.label}
          subtitle={selectedScene.kind === "overlay" ? "Overlay" : "Cortina 1920x1080"}
          onClose={closeEditor}
          preview={
            <ScenePreview scene={mergedScene} copy={copyDraft} captureRef={captureRef} />
          }
          form={
            <>
              <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                Los cambios se ven en el preview y en el PNG aunque no guardes. Para que la fuente de
                OBS los tome, guarda. Si esta escena está al aire, coordina con David antes de
                publicar.
              </div>

              {sceneForm?.badge ? (
                <Field label="Etiqueta superior">
                  <input
                    value={
                      sceneDraft.badge ??
                      selectedScene.badge ??
                      (selectedScene.id === "gracias"
                        ? "GRACIAS"
                        : selectedScene.group === "bloque"
                          ? "BLOQUE EN VIVO"
                          : "48 HORAS")
                    }
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, badge: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.eyebrow ? (
                <Field
                  label={
                    selectedScene.id === "meta"
                      ? "Etiqueta de la barra"
                      : selectedScene.id === "reloj"
                        ? "Etiqueta del contador"
                        : selectedScene.id === "en-vivo-qr"
                          ? "Texto de la insignia"
                          : "Antetítulo"
                  }
                >
                  <input
                    value={sceneDraft.eyebrow ?? selectedScene.eyebrow}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, eyebrow: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.title ? (
                <Field label={selectedScene.id === "en-vivo" ? "Texto de la insignia" : "Título"}>
                  <textarea
                    rows={2}
                    value={sceneDraft.title ?? selectedScene.title}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.subtitle ? (
                <Field
                  label={
                    selectedScene.visual === "liveframe"
                      ? "Ticker inferior"
                      : selectedScene.id === "donacion"
                        ? "Texto de apoyo (respaldo)"
                        : "Subtítulo"
                  }
                >
                  <textarea
                    rows={3}
                    value={sceneDraft.subtitle ?? selectedScene.subtitle}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, subtitle: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.note ? (
                <Field
                  label={
                    selectedScene.visual === "liveframe" || selectedScene.id === "donacion"
                      ? "Texto de apoyo"
                      : "Línea corta"
                  }
                >
                  <input
                    value={sceneDraft.note ?? selectedScene.note ?? ""}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, note: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.cta ? (
                <Field
                  label={
                    selectedScene.id === "meta" || selectedScene.id === "reloj"
                      ? "Llamado de la barra"
                      : selectedScene.id === "mosca"
                        ? "Línea de donación"
                        : selectedScene.visual === "liveframe"
                          ? "Etiqueta del panel"
                          : "Llamado a donar"
                  }
                >
                  <input
                    value={sceneDraft.cta ?? selectedScene.cta ?? ""}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, cta: event.target.value }))
                    }
                    className={inputClass}
                  />
                </Field>
              ) : null}

              {sceneForm?.count ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Número">
                    <input
                      value={sceneDraft.countValue ?? selectedScene.countValue ?? ""}
                      onChange={(event) =>
                        setSceneDraft((current) => ({
                          ...current,
                          countValue: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Unidad del número">
                    <input
                      value={sceneDraft.countUnit ?? selectedScene.countUnit ?? ""}
                      onChange={(event) =>
                        setSceneDraft((current) => ({
                          ...current,
                          countUnit: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              ) : null}

              {sceneForm?.guest ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre del invitado">
                    <input
                      value={sceneDraft.guest ?? selectedScene.guest ?? ""}
                      onChange={(event) =>
                        setSceneDraft((current) => ({ ...current, guest: event.target.value }))
                      }
                      className={inputClass}
                      placeholder="Nombre del invitado"
                    />
                  </Field>
                  <Field label="Cargo o rol">
                    <input
                      value={sceneDraft.guestRole ?? selectedScene.guestRole ?? ""}
                      onChange={(event) =>
                        setSceneDraft((current) => ({
                          ...current,
                          guestRole: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Cargo o rol"
                    />
                  </Field>
                </div>
              ) : null}

              {sceneForm?.returnAt ? (
                <Field label="Hora de regreso">
                  <input
                    value={sceneDraft.returnAt ?? selectedScene.returnAt ?? ""}
                    onChange={(event) =>
                      setSceneDraft((current) => ({ ...current, returnAt: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="Ej. 8:30 p. m."
                  />
                </Field>
              ) : null}

              {sceneForm?.progress ? (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#0F2354]">
                      {sceneProgressLabel(selectedScene)}
                    </p>
                    <p className="text-[10px] leading-snug text-slate-500">
                      Elige si toma el recaudo real del sitio o un porcentaje fijo.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSceneDraft((current) => ({ ...current, progressLive: true }))
                      }
                      aria-pressed={sceneProgressLive}
                      className={`min-h-[40px] rounded-lg px-2 py-1.5 text-[10px] font-extrabold transition ${
                        sceneProgressLive
                          ? "bg-[#0F2354] text-white"
                          : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                      }`}
                    >
                      Recaudo real
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSceneDraft((current) => ({ ...current, progressLive: false }))
                      }
                      aria-pressed={!sceneProgressLive}
                      className={`min-h-[40px] rounded-lg px-2 py-1.5 text-[10px] font-extrabold transition ${
                        !sceneProgressLive
                          ? "bg-[#0F2354] text-white"
                          : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                      }`}
                    >
                      Porcentaje fijo
                    </button>
                  </div>
                  {sceneProgressLive ? (
                    <p className="rounded-lg bg-lime-50 px-2 py-1.5 text-[10px] leading-snug text-lime-900">
                      En OBS y en la página toma el total de donaciones. Si todavía no hay datos,
                      usa {sceneProgressPercent}% como respaldo. Cambia a "Porcentaje fijo" para
                      elegir otro valor.
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={sceneProgressPercent}
                          onChange={(event) =>
                            setSceneDraft((current) => ({
                              ...current,
                              progressPercent: Number(event.target.value),
                            }))
                          }
                          className="flex-1 accent-[#E6009E]"
                          aria-label="Porcentaje de avance"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={5}
                            value={sceneProgressPercent}
                            onChange={(event) =>
                              setSceneDraft((current) => ({
                                ...current,
                                progressPercent: Math.max(
                                  0,
                                  Math.min(100, Number(event.target.value) || 0),
                                ),
                              }))
                            }
                            className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm font-bold text-slate-800 outline-none focus:border-[#E6009E]"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[25, 50, 60, 75, 100].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setSceneDraft((current) => ({
                                ...current,
                                progressPercent: value,
                              }))
                            }
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                              sceneProgressPercent === value
                                ? "bg-[#0F2354] text-white"
                                : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {selectedScene.visual === "house" ? (
                    <Field label="Texto debajo de la casa">
                      <input
                        value={sceneDraft.progressCaption ?? selectedScene.progressCaption ?? ""}
                        onChange={(event) =>
                          setSceneDraft((current) => ({
                            ...current,
                            progressCaption: event.target.value,
                          }))
                        }
                        className={inputClass}
                        placeholder={
                          sceneProgressLive
                            ? "La casa avanza con cada donación"
                            : "Paso a paso, entre todos"
                        }
                      />
                    </Field>
                  ) : null}
                </div>
              ) : null}

              {sceneForm?.qr ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-bold text-[#0F2354]">
                    Destino del QR y del enlace
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSceneDraft((current) => ({ ...current, qrTarget: "donate" }))
                      }
                      aria-pressed={sceneQrTarget === "donate"}
                      className={`min-h-[40px] rounded-lg px-2 py-1.5 text-[10px] font-extrabold transition ${
                        sceneQrTarget === "donate"
                          ? "bg-[#0F2354] text-white"
                          : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                      }`}
                    >
                      Donaciones
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSceneDraft((current) => ({ ...current, qrTarget: "live" }))
                      }
                      aria-pressed={sceneQrTarget === "live"}
                      className={`min-h-[40px] rounded-lg px-2 py-1.5 text-[10px] font-extrabold transition ${
                        sceneQrTarget === "live"
                          ? "bg-[#0F2354] text-white"
                          : "bg-slate-100 text-slate-500 hover:text-[#0F2354]"
                      }`}
                    >
                      Transmisión
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] leading-snug text-slate-500">
                    Apunta a{" "}
                    {displayUrl(
                      sceneQrTarget === "live"
                        ? copyResolved.liveUrl
                        : copyResolved.donateUrl,
                    )}
                  </p>
                </div>
              ) : null}

              {sceneForm?.style ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Color">
                    <select
                      value={sceneDraft.accent ?? selectedScene.accent}
                      onChange={(event) =>
                        setSceneDraft((current) => ({
                          ...current,
                          accent: event.target.value as SceneAccent,
                        }))
                      }
                      className={inputClass}
                    >
                      {SCENE_ACCENTS.map((accent) => (
                        <option key={accent} value={accent}>
                          {accent}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Calvito">
                    <select
                      value={
                        sceneDraft.illustration === null
                          ? "none"
                          : sceneDraft.illustration ?? ""
                      }
                      onChange={(event) =>
                        setSceneDraft((current) => ({
                          ...current,
                          illustration:
                            event.target.value === "none"
                              ? null
                              : event.target.value === ""
                                ? undefined
                                : (event.target.value as CalvitoKey),
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="">Mantener el actual</option>
                      <option value="none">Sin calvito</option>
                      {CALVITOS.map((calvito) => (
                        <option key={calvito} value={calvito}>
                          {CALVITO_LABELS[calvito]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              ) : null}
            </>
          }
          footer={
            <>
              <button
                type="button"
                onClick={saveScene}
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F2354] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#183478] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Save className="h-4 w-4" strokeWidth={2} />
                )}
                Guardar
              </button>
              <button
                type="button"
                onClick={resetScene}
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                Restablecer
              </button>
              <ObsCopyButton
                path={scenePath(selectedScene, sceneDraft, {
                  all: Object.keys(sceneDraft).length > 0,
                })}
                className="min-h-[44px] rounded-lg px-4"
              />
              <button
                type="button"
                onClick={downloadScene}
                disabled={exporting}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#E6009E] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-60"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Download className="h-4 w-4" strokeWidth={2} />
                )}
                Descargar PNG
              </button>
              <span className="text-[11px] font-semibold text-slate-500">{status}</span>
              {error ? (
                <span className="text-[11px] font-semibold text-red-700">{error}</span>
              ) : null}
            </>
          }
        />
      ) : null}

    </div>
  );
}
