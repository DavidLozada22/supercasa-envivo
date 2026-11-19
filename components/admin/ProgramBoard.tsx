"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ClipboardCopy,
  Clock,
  Filter,
  Radio,
  Search,
  Send,
} from "lucide-react";
import type { ProgramBlock, ProgramSegment } from "@/lib/program/types";

type Props = {
  blocks: ProgramBlock[];
  segments: ProgramSegment[];
  serverNow: string;
};

const CLOCK = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Bogota",
});

const DATE = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "America/Bogota",
});

function clock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

function dayLabel(iso: string): string {
  return DATE.format(new Date(iso));
}

export default function ProgramBoard({ blocks, segments, serverNow }: Props) {
  const [now, setNow] = useState(() => Date.parse(serverNow));
  const [selected, setSelected] = useState<string>(blocks[0]?.number ?? "01");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentBlock = useMemo(
    () =>
      blocks.find(
        (block) => now >= Date.parse(block.startsAt) && now < Date.parse(block.endsAt),
      ) ?? null,
    [blocks, now],
  );

  const currentSegment = useMemo(
    () =>
      segments.find(
        (segment) => now >= Date.parse(segment.startsAt) && now < Date.parse(segment.endsAt),
      ) ?? null,
    [segments, now],
  );

  const upcoming = useMemo(
    () =>
      segments
        .filter((segment) => Date.parse(segment.endsAt) > now)
        .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
        .slice(0, 4),
    [segments, now],
  );

  const block = blocks.find((item) => item.number === selected) ?? blocks[0];
  const blockSegments = segments.filter((segment) => segment.block === selected);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return blockSegments;
    return blockSegments.filter((segment) =>
      [segment.name, segment.presenter, segment.type, segment.execution, segment.file]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [blockSegments, query]);

  const overflow = block ? block.minutes - 240 : 0;

  const copyBlock = async () => {
    if (!block) return;
    const lines = [
      `${block.label} · ${block.title}`,
      `${block.day} · ${block.schedule}`,
      `Conducción: ${block.host || "por confirmar"}`,
      "",
      ...blockSegments.map(
        (segment) =>
          `${segment.clock} · ${segment.name}${segment.duration ? ` (${segment.duration} min)` : ""}`,
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Ahora en Bogotá
          </p>
          <p className="mt-1 flex items-center gap-2 text-lg font-extrabold text-[#0F2354]">
            <Clock className="h-4 w-4 text-[#E6009E]" strokeWidth={2} />
            {new Date(now).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "America/Bogota",
            })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Bloque en curso
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#0F2354]">
            {currentBlock ? `${currentBlock.label} · ${currentBlock.title}` : "Fuera de bloque"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Al aire
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#0F2354]">
            {currentSegment ? currentSegment.name : "Sin segmento activo"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#E6009E]" strokeWidth={2} />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Lo que viene
          </h3>
        </div>
        <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {upcoming.map((segment) => (
            <li key={segment.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[11px] font-extrabold text-[#E6009E]">
                {clock(segment.startsAt)} · Bloque {segment.block}
              </p>
              <p className="mt-1 text-xs font-bold leading-snug text-[#0F2354]">{segment.name}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {segment.execution} · {segment.duration} min
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-wrap gap-2">
        {blocks.map((item) => {
          const active = item.number === selected;
          const running = currentBlock?.number === item.number;
          return (
            <button
              key={item.number}
              type="button"
              onClick={() => setSelected(item.number)}
              className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                active
                  ? "border-[#0F2354] bg-[#0F2354] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#E6009E]/40"
              }`}
            >
              <span className="block font-extrabold">
                {item.label}
                {running ? " · en curso" : ""}
              </span>
              <span className={active ? "text-white/70" : "text-slate-400"}>
                {item.schedule} · {item.segmentCount} seg.
              </span>
            </button>
          );
        })}
      </section>

      {block ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                {block.label} · {block.day} · {block.schedule}
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[#0F2354]">{block.title}</h2>
              <p className="mt-1 text-xs text-slate-600">
                {block.host ? `Conduce: ${block.host}. ` : ""}
                {block.challenge}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {dayLabel(block.startsAt)} · {clock(block.startsAt)} a {clock(block.endsAt)} ·
                Pilar: {block.pillar}
              </p>
            </div>
            <button
              type="button"
              onClick={copyBlock}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#0F9D58]" strokeWidth={2} />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {copied ? "Copiado" : "Copiar bloque"}
            </button>
            <a
              href={`/admin/avisos?block=${block.number}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E6009E] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#B8007E]"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Avisar a inscritos
            </a>
          </header>

          {overflow > 0 ? (
            <p className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
              La escaleta suma {block.minutes} minutos para un bloque de 240. Revisa las
              duraciones antes del aire.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar en este bloque"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600">
              <Filter className="h-3.5 w-3.5" strokeWidth={2} />
              {filtered.length} de {blockSegments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-2 pr-3 font-extrabold">Hora</th>
                  <th className="py-2 pr-3 font-extrabold">Min</th>
                  <th className="py-2 pr-3 font-extrabold">Segmento</th>
                  <th className="py-2 pr-3 font-extrabold">Ejecución</th>
                  <th className="py-2 pr-3 font-extrabold">Tipo</th>
                  <th className="py-2 pr-3 font-extrabold">Responsable</th>
                  <th className="py-2 pr-3 font-extrabold">Archivo</th>
                  <th className="py-2 font-extrabold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((segment) => {
                  const running =
                    now >= Date.parse(segment.startsAt) && now < Date.parse(segment.endsAt);
                  return (
                    <tr
                      key={segment.id}
                      className={`border-b border-slate-100 ${
                        running ? "bg-[#E6009E]/5" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap py-2 pr-3 font-bold text-[#0F2354]">
                        {segment.clock}
                      </td>
                      <td className="py-2 pr-3 text-slate-500">{segment.duration}</td>
                      <td className="py-2 pr-3 font-semibold text-[#0F2354]">
                        {segment.name}
                        {running ? (
                          <span className="ml-2 rounded-full bg-[#E6009E] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                            Al aire
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{segment.execution}</td>
                      <td className="py-2 pr-3 text-slate-600">{segment.type}</td>
                      <td className="py-2 pr-3 text-slate-600">{segment.presenter || "—"}</td>
                      <td className="max-w-[220px] truncate py-2 pr-3 text-slate-400">
                        {segment.file || "—"}
                      </td>
                      <td className="py-2 text-slate-600">{segment.status || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        Programa interno, no público. Se actualiza con{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5">
          python3 scripts/import-escaleta.py &quot;ruta.xlsx&quot;
        </code>
        . Los horarios son hora de Bogotá.
      </p>
    </div>
  );
}
