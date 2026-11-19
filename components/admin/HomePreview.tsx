"use client";

import { useState } from "react";
import { ExternalLink, Monitor, Smartphone } from "lucide-react";

export default function HomePreview() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const src = "/?preview=live";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F2354]">Home durante el evento</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
              Así verá la gente la página principal cuando la maratón esté al aire: header con la
              píldora EN VIVO, topbar con el aviso y el visor ocupando el lugar de la casa en obra.
              Esta vista no cambia el estado del sitio.
            </p>
          </div>
          <a
            href="/?preview=live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0F2354] hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            Abrir en pestaña
          </a>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            aria-pressed={device === "desktop"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
              device === "desktop"
                ? "bg-[#0F2354] text-white"
                : "border border-slate-200 bg-white text-[#0F2354] hover:bg-slate-50"
            }`}
          >
            <Monitor className="h-4 w-4" strokeWidth={1.75} />
            Escritorio
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            aria-pressed={device === "mobile"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
              device === "mobile"
                ? "bg-[#0F2354] text-white"
                : "border border-slate-200 bg-white text-[#0F2354] hover:bg-slate-50"
            }`}
          >
            <Smartphone className="h-4 w-4" strokeWidth={1.75} />
            Celular
          </button>
          <span className="ml-auto text-xs text-slate-500">Vista solo para administradores</span>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-2 truncate text-xs text-slate-500">
            https://supercasa.svgvisual.com · en vivo
          </span>
        </div>
        <div className="flex justify-center bg-slate-200/70 p-3 md:p-5">
          <iframe
            src={src}
            title="Vista previa del home durante la transmisión"
            className={`h-[720px] rounded-xl border border-slate-300 bg-white shadow-lg ${
              device === "mobile" ? "w-[390px] max-w-full" : "w-full"
            }`}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
