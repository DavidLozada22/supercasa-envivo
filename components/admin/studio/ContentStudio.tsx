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
import SceneView from "@/components/streaming/SceneView";
import { downloadAdPng, renderAdToDataUrl } from "@/lib/marketing/ad-exporter";
import {
  AD_CREATIVES,
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
  mergeScene,
  type SceneOverride,
  type StreamingContent,
} from "@/lib/streaming/merge";
import {
  CALVITOS,
  SCENES,
  type CalvitoKey,
  type SceneAccent,
  type SceneDef,
} from "@/lib/streaming/scenes";

type Tab = "marketing" | "cortinas" | "overlays";
type SceneType = "general" | "cuenta" | "hora" | "casa" | "bloque";

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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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
          <div className="bg-slate-100 p-4 lg:overflow-auto">{preview}</div>
          <div className="space-y-4 p-4 lg:overflow-auto">{form}</div>
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
  captureRef,
}: {
  scene: SceneDef;
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
        <SceneView scene={scene} render />
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
  const image = merged.fullSceneImage ?? merged.characterImage;
  const headline = merged.headline;
  const isOverlay = creative.category === "overlays";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E6009E]/40 hover:shadow-md"
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden ${
          isOverlay
            ? "bg-[#2B394F]"
            : "bg-gradient-to-br from-[#0D1E47] to-[#071127]"
        }`}
        style={
          isOverlay
            ? {
                backgroundImage:
                  "linear-gradient(45deg, #33445e 25%, transparent 25%), linear-gradient(-45deg, #33445e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #33445e 75%), linear-gradient(-45deg, transparent 75%, #33445e 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }
            : undefined
        }
      >
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full flex-col justify-end bg-gradient-to-br from-[#0F2354] via-[#1a3370] to-[#E6009E] p-3">
            <p className="line-clamp-4 font-display text-sm font-extrabold leading-tight text-white">
              {headline}
            </p>
          </div>
        )}
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
      <div className="p-3">
        <p className="line-clamp-2 text-xs font-extrabold leading-tight text-[#0F2354]">
          {creative.title}
        </p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">
          {edit ? "Editado · toca para abrir" : "Toca para editar"}
        </p>
      </div>
    </button>
  );
}

function SceneCard({
  scene,
  edited,
  onOpen,
}: {
  scene: SceneDef;
  edited: boolean;
  onOpen: () => void;
}) {
  const overlay = scene.kind === "overlay";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#E6009E]/40 hover:shadow-md"
    >
      <div
        className={`relative aspect-video overflow-hidden ${
          overlay ? "scene-preview--overlay" : "bg-[#0B1A3D]"
        }`}
      >
        <img
          src={`/cortinas/${scene.id}.png`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#FFD400] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#0B1A3D]">
          {overlay ? "Overlay" : scene.group === "bloque" ? `Bloque ${scene.number}` : "Cortina"}
        </span>
        {edited ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-[#E6009E] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
            Editada
          </span>
        ) : null}
        <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#0F2354]/85 text-white opacity-0 transition group-hover:opacity-100">
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-xs font-extrabold leading-tight text-[#0F2354]">
          {scene.label}
        </p>
        <p className="mt-1 line-clamp-2 text-[10px] font-semibold text-slate-400">{scene.when}</p>
      </div>
    </button>
  );
}

export default function ContentStudio({
  role,
  user,
  marketing,
  content,
  initialTab,
  initialScene,
}: {
  role: string;
  user: string;
  marketing: MarketingState;
  content: StreamingContent;
  initialTab?: Tab;
  initialScene?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "marketing");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"all" | AdFormat>("all");
  const [category, setCategory] = useState<"all" | AdCategory>("all");
  const [sceneFilter, setSceneFilter] = useState<"all" | SceneType>("all");
  const [marketingState, setMarketingState] = useState(marketing);
  const [contentState, setContentState] = useState(content);
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
      if (sceneFilter !== "all" && sceneType(scene) !== sceneFilter) return false;
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
        body: JSON.stringify({ scenes }),
      });
      const body = (await response.json()) as StreamingContent & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo guardar.");
        return;
      }
      setContentState(body);
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
        body: JSON.stringify({ scenes }),
      });
      const body = (await response.json()) as StreamingContent & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo restablecer.");
        return;
      }
      setContentState(body);
      setSceneDraft({});
      setStatus("Volvió al diseño original.");
    } catch {
      setError("Error de conexión al restablecer.");
    } finally {
      setSaving(false);
    }
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
  const qrMode =
    draft.showQr === false
      ? "none"
      : draft.qrTarget === "live"
        ? "live"
        : draft.qrTarget === "donate"
          ? "donate"
          : "default";

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

  const editedCount = Object.keys(marketingState.edits).length;
  const editedScenes = Object.keys(contentState.scenes).length;

  return (
    <div className="space-y-5">
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
              edited={Boolean(contentState.scenes[scene.id])}
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
              <Field label="Código QR">
                <select
                  value={qrMode}
                  onChange={(event) =>
                    setQrMode(event.target.value as "default" | "live" | "donate" | "none")
                  }
                  className={inputClass}
                >
                  <option value="default">Como viene la pieza</option>
                  <option value="live">QR al live</option>
                  <option value="donate">QR a donar</option>
                  <option value="none">Sin QR</option>
                </select>
              </Field>
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

      {selectedScene && mergedScene ? (
        <EditorShell
          title={selectedScene.label}
          subtitle={selectedScene.kind === "overlay" ? "Overlay" : "Cortina 1920x1080"}
          onClose={closeEditor}
          preview={<ScenePreview scene={mergedScene} captureRef={captureRef} />}
          form={
            <>
              <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                Los cambios se ven en la fuente de OBS al guardar. Si esta escena está al aire,
                coordina con David antes de publicar.
              </div>
              <Field label="Eyebrow">
                <input
                  value={sceneDraft.eyebrow ?? selectedScene.eyebrow}
                  onChange={(event) => setSceneDraft((current) => ({ ...current, eyebrow: event.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Título">
                <textarea
                  rows={2}
                  value={sceneDraft.title ?? selectedScene.title}
                  onChange={(event) => setSceneDraft((current) => ({ ...current, title: event.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Subtítulo">
                <textarea
                  rows={3}
                  value={sceneDraft.subtitle ?? selectedScene.subtitle}
                  onChange={(event) => setSceneDraft((current) => ({ ...current, subtitle: event.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Línea corta">
                <input
                  value={sceneDraft.note ?? selectedScene.note ?? ""}
                  onChange={(event) => setSceneDraft((current) => ({ ...current, note: event.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Llamado a donar">
                <input
                  value={sceneDraft.cta ?? selectedScene.cta ?? ""}
                  onChange={(event) => setSceneDraft((current) => ({ ...current, cta: event.target.value }))}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Número">
                  <input
                    value={sceneDraft.countValue ?? selectedScene.countValue ?? ""}
                    onChange={(event) => setSceneDraft((current) => ({ ...current, countValue: event.target.value }))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Unidad del número">
                  <input
                    value={sceneDraft.countUnit ?? selectedScene.countUnit ?? ""}
                    onChange={(event) => setSceneDraft((current) => ({ ...current, countUnit: event.target.value }))}
                    className={inputClass}
                  />
                </Field>
              </div>
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
