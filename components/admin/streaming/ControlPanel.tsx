"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, Loader2, MonitorPlay, RefreshCw, Save } from "lucide-react";
import {
  DEFAULT_SCENE_ID,
  FIELD_LABELS,
  SCENES,
  getScene,
} from "@/lib/streaming/scenes";
import type { OnAirFields, OnAirState } from "@/lib/streaming/types";

export default function ControlPanel({
  onair,
  onSaved,
}: {
  onair: OnAirState | null;
  onSaved: (state: OnAirState) => void;
}) {
  const [sceneId, setSceneId] = useState(onair?.sceneId ?? DEFAULT_SCENE_ID);
  const [fields, setFields] = useState<OnAirFields>(onair?.fields ?? {});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !onair) return;
    setSceneId(onair.sceneId);
    setFields(onair.fields ?? {});
    initialized.current = true;
  }, [onair]);

  const scene = getScene(sceneId);
  const token = onair?.token ?? "";
  const previewUrl = token ? `/pantalla/onair?k=${encodeURIComponent(token)}` : "";

  const setField = (key: keyof OnAirFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const publish = async () => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId, fields }),
      });
      const body = (await response.json()) as OnAirState & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo publicar.");
        return;
      }
      onSaved(body);
      setMessage("Publicado en OBS. La cortina cambia en un par de segundos.");
    } catch {
      setError("Error de conexión al publicar.");
    } finally {
      setBusy(false);
    }
  };

  const rotate = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/streaming/state", { method: "POST" });
      const body = (await response.json()) as OnAirState & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo rotar el token.");
        return;
      }
      onSaved(body);
      setMessage("Token nuevo. Vuelve a copiar la URL en OBS.");
    } catch {
      setError("Error de conexión al rotar el token.");
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${previewUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
            En pantalla
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-[#0F2354]">
            {onair ? getScene(onair.sceneId)?.label ?? onair.sceneId : "Sin estado"}
          </h3>
          {onair ? (
            <p className="mt-1 text-xs text-slate-500">
              Actualizado {onair.updatedAt && onair.updatedAt !== new Date(0).toISOString()
                ? new Date(onair.updatedAt).toLocaleString("es-CO")
                : "todavía no"}
            </p>
          ) : null}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#0F2354]">Cortina activa</span>
          <select
            value={sceneId}
            onChange={(event) => setSceneId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-[#0F2354] outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
          >
            <optgroup label="Cortinas">
              {SCENES.filter((item) => item.kind === "full" && item.group !== "bloque").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Bloques">
              {SCENES.filter((item) => item.group === "bloque").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Overlays">
              {SCENES.filter((item) => item.kind === "overlay").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        {scene && scene.fields.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {scene.fields.map((field) => (
              <label key={field} className="block">
                <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">
                  {FIELD_LABELS[field]}
                </span>
                <input
                  value={fields[field] ?? ""}
                  onChange={(event) => setField(field, event.target.value)}
                  placeholder={field === "returnAt" ? "8:15 p. m." : ""}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
                />
              </label>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Esta cortina no tiene texto editable.</p>
        )}

        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={publish}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#B8007E] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : <Save className="h-4 w-4" strokeWidth={2} />}
            Publicar en OBS
          </button>
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
          >
            {copied ? <Check className="h-4 w-4 text-[#0F9D58]" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
            {copied ? "Copiada" : "Copiar URL de OBS"}
          </button>
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
              Abrir
            </a>
          ) : null}
          <button
            type="button"
            onClick={rotate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
            Rotar token
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-500">
          En OBS agrega una fuente de navegador de 1920x1080 con la URL del botón. Esa única
          fuente cambia con lo que publiques aquí. Para textos variables, como el nombre de un
          invitado, esta es la vía; el PNG descargable queda con el texto de ejemplo.
        </p>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0B1A3D] shadow-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/60">
            <MonitorPlay className="h-4 w-4" strokeWidth={2} />
            Salida para OBS
          </div>
          <div className="aspect-video">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="Vista previa de la cortina en vivo"
                className="h-full w-full border-0"
              />
            ) : (
              <div className="grid h-full place-items-center text-xs text-white/50">
                Publica una cortina para ver la salida.
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Esta vista usa el mismo HTML que OBS. Si aquí se ve bien, en OBS se ve igual.
        </p>
      </div>
    </div>
  );
}
