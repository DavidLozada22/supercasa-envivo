"use client";

import { useState } from "react";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import type { SceneDef } from "@/lib/streaming/scenes";

export default function SceneGrid({ scenes }: { scenes: SceneDef[] }) {
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
          <div className="relative aspect-video overflow-hidden bg-[#0B1A3D]">
            <span className="absolute inset-0 grid place-items-center px-6 text-center text-xs font-semibold text-white/30">
              {scene.label}
            </span>
            <img
              src={`/cortinas/${scene.id}.png`}
              alt={`Vista previa de ${scene.label}`}
              loading="lazy"
              className="relative h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />
            {scene.number ? (
              <span className="absolute left-3 top-3 rounded-full bg-[#FFD400] px-2.5 py-1 text-[11px] font-extrabold text-[#0B1A3D]">
                Bloque {scene.number}
              </span>
            ) : null}
          </div>

          <div className="space-y-3 p-4">
            <div>
              <h3 className="text-sm font-extrabold leading-tight text-[#0F2354]">{scene.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{scene.when}</p>
            </div>

            {scene.fields.length > 0 ? (
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#E6009E]">
                Texto editable
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
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
