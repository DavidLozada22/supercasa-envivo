"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, Search } from "lucide-react";
import {
  PRESET_KINDS,
  PROGRAM_BLOCKS,
  PROGRAM_PRESETS,
  type PresetKind,
} from "@/lib/program/presets";
import ObsCopyButton from "./ObsCopyButton";

const KIND_STYLES: Record<PresetKind, string> = {
  mosca: "bg-[#E6009E] text-white",
  next: "bg-[#00A8E8] text-white",
  current: "bg-[#B5F43D] text-[#0B1A3D]",
  block: "bg-[#FFD400] text-[#0B1A3D]",
};

const KIND_LABELS: Record<PresetKind, string> = {
  mosca: "Mosca",
  next: "Ya viene",
  current: "Estamos en",
  block: "Bloque",
};

export default function ProgramPresets() {
  const [kind, setKind] = useState<"all" | PresetKind>("all");
  const [block, setBlock] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return PROGRAM_PRESETS.filter((preset) => {
      if (kind !== "all" && preset.kind !== kind) return false;
      if (block !== "all" && preset.block !== block) return false;
      if (!term) return true;
      return `${preset.title} ${preset.detail} ${preset.label} ${preset.guest ?? ""} ${
        preset.guestRole ?? ""
      }`
        .toLowerCase()
        .includes(term);
    });
  }, [kind, block, query]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Moscas y agenda
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-[#0F2354]">
              Links listos para OBS, generados del minuto a minuto
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
              Cada mosca lleva el nombre y el cargo. Cada "Ya viene" lleva el siguiente
              segmento. Copia el link con el botón OBS y pégalo como fuente de navegador de
              1920x1080.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {filtered.length} de {PROGRAM_PRESETS.length}
          </span>
        </div>
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          Si cambia el minuto a minuto, se vuelve a importar la escaleta y esta lista se
          regenera. Los textos se pueden ajustar en el Estudio, pero aquí ya salen completos.
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {PRESET_KINDS.map((item) => {
            const active = kind === item.id;
            const count =
              item.id === "all"
                ? PROGRAM_PRESETS.length
                : PROGRAM_PRESETS.filter((preset) => preset.kind === item.id).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                  active
                    ? "bg-[#0F2354] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F2354]"
                }`}
              >
                {item.label}
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

        <select
          value={block}
          onChange={(event) => setBlock(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#0F2354] outline-none"
        >
          <option value="all">Todos los bloques</option>
          {PROGRAM_BLOCKS.map((item) => (
            <option key={item.number} value={item.number}>
              {item.label} · {item.schedule}
            </option>
          ))}
        </select>

        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nombre, cargo o segmento"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-400">
            No hay piezas con ese filtro. Prueba otro bloque o borra la búsqueda.
          </div>
        ) : null}

        {filtered.map((preset) => (
          <article
            key={preset.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-nowrap"
          >
            <div className="flex w-full shrink-0 items-center gap-2 sm:w-[168px]">
              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${KIND_STYLES[preset.kind]}`}
              >
                {KIND_LABELS[preset.kind]}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <CalendarDays className="h-3 w-3" strokeWidth={2} />
                {preset.clock}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                B{preset.block}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold leading-tight text-[#0F2354]">
                {preset.title}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
                {preset.detail}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <ObsCopyButton path={preset.path} />
              <a
                href={preset.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                Ver
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
