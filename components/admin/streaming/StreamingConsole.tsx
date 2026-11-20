"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Building2,
  CalendarDays,
  Clapperboard,
  Clock,
  Download,
  Layers,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import { SCENES, getScene, type SceneDef } from "@/lib/streaming/scenes";
import type { OnAirState } from "@/lib/streaming/types";
import ConnectionPanel from "./ConnectionPanel";
import ControlPanel from "./ControlPanel";
import ProgramPresets from "./ProgramPresets";
import ProgramStrip from "./ProgramStrip";
import SceneGrid from "./SceneGrid";
import StreamingGuide from "./StreamingGuide";
import type { Health } from "./types";

type TabId =
  | "cortinas"
  | "cuentas"
  | "horas"
  | "casa"
  | "bloques"
  | "overlays"
  | "presets"
  | "control"
  | "conexiones";

const TABS: Array<{ id: TabId; label: string; icon: typeof Layers }> = [
  { id: "cortinas", label: "Cortinas", icon: Clapperboard },
  { id: "cuentas", label: "Cuentas regresivas", icon: Timer },
  { id: "horas", label: "Horas del live", icon: Clock },
  { id: "casa", label: "La casa", icon: Building2 },
  { id: "bloques", label: "Bloques", icon: Layers },
  { id: "overlays", label: "Pantallas y overlays", icon: SlidersHorizontal },
  { id: "presets", label: "Moscas y agenda", icon: CalendarDays },
  { id: "control", label: "En control", icon: Activity },
  { id: "conexiones", label: "Conexiones", icon: RefreshCw },
];

const isCountdown = (scene: SceneDef) => scene.id.startsWith("empezamos-");

const generic = SCENES.filter(
  (scene) =>
    scene.kind === "full" &&
    scene.group !== "bloque" &&
    scene.group !== "hora" &&
    !isCountdown(scene) &&
    scene.visual !== "house" &&
    scene.id !== "fondo-live",
);
const countdowns = SCENES.filter(isCountdown);
const hours = SCENES.filter((scene) => scene.group === "hora");
const houses = SCENES.filter((scene) => scene.visual === "house");
const blocks = SCENES.filter((scene) => scene.group === "bloque");
const overlays = SCENES.filter(
  (scene) => scene.kind === "overlay" || scene.id === "fondo-live",
);

export default function StreamingConsole() {
  const [tab, setTab] = useState<TabId>("cortinas");
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("tab");
    if (value && TABS.some((item) => item.id === value)) {
      setTab(value as TabId);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/streaming/health", { cache: "no-store" });
      if (!response.ok) return;
      setHealth((await response.json()) as Health);
    } catch {
      // Se conserva la ultima lectura.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 15_000);
    return () => clearInterval(id);
  }, [load]);

  const onSaved = (state: OnAirState) => {
    setHealth((current) => (current ? { ...current, onair: state } : current));
  };

  const onairScene: SceneDef | undefined = health
    ? getScene(health.onair.sceneId) ?? undefined
    : undefined;

  return (
    <div className="space-y-5">
      <StreamingGuide onTab={(next) => setTab(next)} />

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            En pantalla
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#0F2354]">
            {onairScene?.label ?? "Sin publicar"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            YouTube
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#0F2354]">
            {health
              ? health.youtube.keyPresent
                ? health.youtube.live
                  ? "Directo detectado"
                  : "Sin directo activo"
                : "Falta la clave"
              : "Consultando"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Resend
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#0F2354]">
            {health ? health.resend.status.replace("_", " ") : "Consultando"}
          </p>
        </div>
      </section>

      <ProgramStrip />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
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
        <a
          href="/cortinas/cortinas-supercasa.zip"
          download
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#B5F43D] px-3 py-2 text-xs font-extrabold text-[#0F2354] shadow-sm transition hover:brightness-105"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Descargar todas
        </a>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#0F2354] shadow-sm transition hover:border-[#E6009E]/40 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          )}
          Actualizar
        </button>
      </div>

      {tab === "cortinas" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            Descarga el PNG y arrástralo a OBS, o copia la URL y úsala como fuente de navegador
            de 1920x1080. Los PNG son la versión genérica. Para cambiar el nombre o el texto, usa{" "}
            <strong className="font-bold text-[#0F2354]">En control</strong> y la fuente de OBS.
          </p>
          <SceneGrid scenes={generic} />
        </div>
      ) : null}

      {tab === "cuentas" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            Seis cuentas regresivas, de 1 minuto a 1 hora. Cada una tiene un calvito distinto y
            el número gigante para que se lea desde el celular.
          </p>
          <SceneGrid scenes={countdowns} />
        </div>
      ) : null}

      {tab === "horas" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            Las horas que van de la maratón, más el cierre y el agradecimiento. Úsalas para
            celebrar cada tramo y empujar la donación. La mosca y el contador de la página
            muestran la hora en tiempo real.
          </p>
          <SceneGrid scenes={hours} />
        </div>
      ) : null}

      {tab === "casa" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            La casa paso a paso. Usa las cinco fases para contar el avance o deja{" "}
            <strong className="font-bold text-[#0F2354]">La casa en vivo</strong> como fuente de
            OBS: toma el recaudo real y avanza sola.
          </p>
          <SceneGrid scenes={houses} />
        </div>
      ) : null}

      {tab === "bloques" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            Una cortina por bloque de la escaleta. Úsala 30 a 60 segundos antes de entrar al
            bloque, o durante el cambio de set. El número del bloque va en grande.
          </p>
          <SceneGrid scenes={blocks} />
        </div>
      ) : null}

      {tab === "overlays" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-600">
            Overlays con fondo transparente para poner encima del video. Todos llevan logos y
            llamado a donar. El fondo y el marco para live pequeño piden el video en 1280x720,
            en la posición 80 x 180. Para el nombre y el cargo de cada invitado, usa{" "}
            <strong className="font-bold text-[#0F2354]">Moscas y agenda</strong>: los links ya
            salen llenos.
          </p>
          <SceneGrid scenes={overlays} />
        </div>
      ) : null}

      {tab === "presets" ? <ProgramPresets /> : null}

      {tab === "control" ? (
        <ControlPanel onair={health?.onair ?? null} onSaved={onSaved} />
      ) : null}

      {tab === "conexiones" ? (
        <ConnectionPanel health={health} onRefresh={() => void load()} />
      ) : null}
    </div>
  );
}
