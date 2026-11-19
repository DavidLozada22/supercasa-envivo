"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  MonitorPlay,
  SlidersHorizontal,
  Youtube,
} from "lucide-react";

type Tab = "cortinas" | "bloques" | "overlays" | "control" | "conexiones";

export default function StreamingGuide({ onTab }: { onTab: (tab: Tab) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#0F2354]/15 bg-[#0F2354] text-white shadow-sm">
      <div className="p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#B5F43D]">
          Empieza aquí
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight">
          Cortinas listas para OBS
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/70">
          Descarga un PNG o conecta una fuente de navegador. Las dos vías funcionan.
        </p>

        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#B5F43D] text-sm font-extrabold text-[#0F2354]">
              1
            </span>
            <p className="mt-3 flex items-center gap-2 text-sm font-extrabold">
              <Download className="h-4 w-4 text-[#B5F43D]" strokeWidth={2} />
              Descarga el PNG
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              Pulsa PNG en cualquier tarjeta. Arrastra el archivo a OBS.
            </p>
          </li>

          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD400] text-sm font-extrabold text-[#0F2354]">
              2
            </span>
            <p className="mt-3 flex items-center gap-2 text-sm font-extrabold">
              <MonitorPlay className="h-4 w-4 text-[#FFD400]" strokeWidth={2} />
              O copia la URL
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              Pulsa OBS y pega la URL en una fuente de navegador de 1920x1080.
            </p>
          </li>

          <li className="rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6009E] text-sm font-extrabold text-white">
              3
            </span>
            <p className="mt-3 flex items-center gap-2 text-sm font-extrabold">
              <SlidersHorizontal className="h-4 w-4 text-[#E6009E]" strokeWidth={2} />
              Cambia el texto
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/65">
              En En control eliges la cortina, escribes y publicas.
            </p>
          </li>
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onTab("cortinas")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#B5F43D] px-4 py-2.5 text-xs font-extrabold text-[#0F2354] transition hover:brightness-105"
          >
            Ver cortinas
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onTab("control")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
          >
            Abrir En control
          </button>
          <button
            type="button"
            onClick={() => onTab("conexiones")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
          >
            <Youtube className="h-4 w-4" strokeWidth={2} />
            Ver estado del directo
          </button>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs leading-relaxed text-white/70">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B5F43D]" strokeWidth={2} />
          No necesitas conectar tu cuenta de YouTube. La página detecta el directo sola.
        </p>

        <details className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <summary className="cursor-pointer text-xs font-extrabold text-white">
            Ver la guía paso a paso en OBS
          </summary>
          <ol className="mt-3 space-y-2 text-xs leading-relaxed text-white/70">
            <li>
              <strong className="text-white">1.</strong> En OBS crea una escena llamada
              Cortinas.
            </li>
            <li>
              <strong className="text-white">2.</strong> Agrega una fuente de navegador
              llamada Cortina en vivo.
            </li>
            <li>
              <strong className="text-white">3.</strong> Pon ancho 1920 y alto 1080.
            </li>
            <li>
              <strong className="text-white">4.</strong> Pega la URL que copias en En control.
            </li>
            <li>
              <strong className="text-white">5.</strong> Activa "Actualizar cuando la escena
              se active" y desactiva "Apagar cuando no sea visible".
            </li>
            <li>
              <strong className="text-white">6.</strong> Si prefieres PNG, descárgalo y
              arrástralo a la escena como fuente de imagen.
            </li>
            <li>
              <strong className="text-white">7.</strong> No cambies la URL del sitio. Cuando
              YouTube corta, el video se actualiza solo.
            </li>
          </ol>
        </details>
      </div>
    </section>
  );
}
