"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  ImageOff,
  Loader2,
  Pencil,
} from "lucide-react";
import type { SceneDef } from "@/lib/streaming/scenes";

function SceneKindBadge({ scene }: { scene: SceneDef }) {
  const base =
    "rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider";

  if (scene.group === "bloque" && scene.number) {
    return <span className={`${base} bg-[#FFD400] text-[#0B1A3D]`}>Bloque {scene.number}</span>;
  }
  if (scene.kind === "overlay") {
    return <span className={`${base} bg-[#00A8E8] text-white`}>Overlay</span>;
  }
  if (scene.group === "hora") {
    return <span className={`${base} bg-[#B5F43D] text-[#0B1A3D]`}>Hora</span>;
  }
  if (scene.id.startsWith("empezamos-")) {
    return <span className={`${base} bg-[#E6009E] text-white`}>Cuenta</span>;
  }
  if (scene.visual === "house") {
    return <span className={`${base} bg-[#00A8E8] text-white`}>Casa</span>;
  }
  return <span className={`${base} bg-white/10 text-white/70`}>PNG</span>;
}

function ScenePreview({ scene }: { scene: SceneDef }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const overlay = scene.kind === "overlay";

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-[#0B1A3D] ${
        overlay ? "scene-preview--overlay" : ""
      }`}
    >
      {state !== "ready" ? (
        <div className="absolute inset-0 z-10 grid place-items-center gap-1.5 px-5 text-center">
          {state === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin text-white/40" strokeWidth={2} />
          ) : (
            <ImageOff className="h-5 w-5 text-white/40" strokeWidth={2} />
          )}
          <span className="text-[11px] font-semibold leading-snug text-white/55">
            {scene.label}
          </span>
          {state === "error" ? (
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#FFD400]">
              PNG pendiente
            </span>
          ) : null}
        </div>
      ) : null}

      <img
        src={`/cortinas/${scene.id}.png`}
        alt={`Vista previa de ${scene.label}`}
        loading="lazy"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        className={`relative h-full w-full object-cover transition-opacity duration-200 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
        <SceneKindBadge scene={scene} />
      </div>

      {scene.fields.length > 0 ? (
        <span className="absolute right-3 top-3 z-20 rounded-full bg-black/45 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white/80">
          Editable
        </span>
      ) : null}
    </div>
  );
}

export default function SceneGrid({
  scenes,
  onEdit,
}: {
  scenes: SceneDef[];
  onEdit: (scene: SceneDef) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (scene: SceneDef) => {
    const origin = window.location.origin;
    try {
      await navigator.clipboard.writeText(`${origin}/pantalla/${scene.id}`);
      setCopied(scene.id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {scenes.map((scene) => (
        <article
          key={scene.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <ScenePreview scene={scene} />

          <div className="space-y-3 p-4">
            <div>
              <h3 className="text-sm font-extrabold leading-tight text-[#0F2354]">
                {scene.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{scene.when}</p>
            </div>

            {scene.fields.length > 0 ? (
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#E6009E]">
                Texto editable
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(scene)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E6009E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#B8007E]"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                Editar
              </button>
              <a
                href={`/cortinas/${scene.id}.png`}
                download={`supercasa-${scene.id}.png`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2354] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#183478]"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                PNG
              </a>
              <button
                type="button"
                onClick={() => copy(scene)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
              >
                {copied === scene.id ? (
                  <Check className="h-3.5 w-3.5 text-[#0F9D58]" strokeWidth={2} />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                )}
                {copied === scene.id ? "Copiada" : "OBS"}
              </button>
              <a
                href={`/pantalla/${scene.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                Ver
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
