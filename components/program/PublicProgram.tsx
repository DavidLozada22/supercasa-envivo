"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Download,
  Radio,
  Search,
  Share2,
  UserRound,
} from "lucide-react";
import { PROGRAM_DAYS } from "@/lib/program/data";
import type { ProgramBlock, PublicProgramSegment } from "@/lib/program/types";
import type { ProgramNow } from "@/lib/program/now";

const BOGOTA = "America/Bogota";

type PublicSegment = PublicProgramSegment;

function clock(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: BOGOTA,
  }).format(new Date(iso));
}

function shortTitle(title: string): string {
  return title.split(/[:·]/)[0]?.trim() || title;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findCurrent(segments: PublicSegment[], now: number): PublicSegment | null {
  return (
    segments.find(
      (segment) => now >= Date.parse(segment.startsAt) && now < Date.parse(segment.endsAt),
    ) ?? null
  );
}

function BlockDetails({
  block,
  segments,
  currentId,
  initialOpen,
}: {
  block: ProgramBlock;
  segments: PublicSegment[];
  currentId?: string;
  initialOpen: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E6009E] text-xs font-extrabold text-white">
          {block.number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-extrabold leading-tight text-[#0F2354]">
            {shortTitle(block.title)}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={2} />
              {block.schedule}
            </span>
            {block.host ? (
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3 w-3" strokeWidth={2} />
                {block.host}
              </span>
            ) : null}
            <span>{segments.length} segmentos</span>
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100">
        {segments.map((segment) => (
          <article
            key={segment.id}
            id={`seg-${segment.id}`}
            className={`scroll-mt-[172px] border-b border-slate-100 px-4 py-3 last:border-b-0 ${
              segment.id === currentId ? "bg-[#E6009E]/5 ring-1 ring-inset ring-[#E6009E]/30" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-[74px] shrink-0 pt-0.5 text-[11px] font-extrabold leading-tight text-[#0F2354]">
                {segment.startClock}
                <span className="block text-[10px] font-semibold text-slate-400">
                  a {segment.endClock}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="text-[13px] font-extrabold leading-snug text-[#0F2354]">
                    {segment.name || segment.code}
                  </h4>
                  {segment.live ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E6009E]/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#B8007E]">
                      <Radio className="h-2.5 w-2.5" strokeWidth={2.5} />
                      En vivo
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                      Pregrabado
                    </span>
                  )}
                  {segment.id === currentId ? (
                    <span className="rounded-full bg-[#0F2354] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                      Ahora
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500">
                  {segment.presenter ? (
                    <span className="inline-flex items-center gap-1">
                      <UserRound className="h-3 w-3" strokeWidth={2} />
                      {segment.presenter}
                    </span>
                  ) : null}
                  {segment.type ? <span>{segment.type}</span> : null}
                  <span>{segment.duration} min</span>
                  {segment.status ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                      {segment.status}
                    </span>
                  ) : null}
                </p>
                {segment.notes ? (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{segment.notes}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </details>
  );
}

export default function PublicProgram({
  blocks,
  segments,
  initialMarker,
  serverNow,
}: {
  blocks: ProgramBlock[];
  segments: PublicSegment[];
  initialMarker: ProgramNow;
  serverNow: string;
}) {
  const initialNow = Date.parse(serverNow);
  const initialManual = initialMarker.segmentId
    ? segments.find((segment) => segment.id === initialMarker.segmentId) ?? null
    : null;
  const initialManualFresh =
    initialManual &&
    Date.parse(initialMarker.updatedAt) > 0 &&
    initialNow - Date.parse(initialMarker.updatedAt) < 8 * 3_600_000;
  const initialCurrent = initialManualFresh
    ? initialManual
    : findCurrent(segments, initialNow);
  const initialBlock = initialCurrent
    ? blocks.find((block) => block.number === initialCurrent.block) ?? null
    : null;

  const [now, setNow] = useState(initialNow);
  const [marker, setMarker] = useState<ProgramNow>(initialMarker);
  const [day, setDay] = useState(initialBlock?.dayNumber ?? 1);
  const [query, setQuery] = useState("");
  const [shared, setShared] = useState(false);
  const scrolled = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/program/now", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as ProgramNow;
        if (alive) setMarker(body);
      } catch {
        // Se conserva el último marcador.
      }
    };
    const timer = window.setInterval(load, 30_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const manualSegment = marker.segmentId
    ? segments.find((segment) => segment.id === marker.segmentId) ?? null
    : null;
  const manualFresh =
    manualSegment &&
    Date.parse(marker.updatedAt) > 0 &&
    now - Date.parse(marker.updatedAt) < 8 * 3_600_000;
  const autoCurrent = findCurrent(segments, now);
  const current = manualFresh ? manualSegment : autoCurrent;
  const mode = manualFresh ? "manual" : "auto";
  const currentIndex = current
    ? segments.findIndex((segment) => segment.id === current.id)
    : -1;
  const next =
    currentIndex >= 0
      ? segments[currentIndex + 1] ?? null
      : segments.find((segment) => Date.parse(segment.startsAt) > now) ?? null;
  const currentBlock = current
    ? blocks.find((block) => block.number === current.block) ?? null
    : null;

  useEffect(() => {
    if (scrolled.current) return;
    scrolled.current = true;
    if (!initialCurrent) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById(`seg-${initialCurrent.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [initialCurrent]);

  const dayBlocks = useMemo(
    () => blocks.filter((block) => block.dayNumber === day),
    [blocks, day],
  );
  const daySegments = useMemo(
    () =>
      segments.filter((segment) =>
        dayBlocks.some((block) => block.number === segment.block),
      ),
    [segments, dayBlocks],
  );
  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    return segments.filter((segment) =>
      normalize(
        `${segment.name} ${segment.presenter} ${segment.type} ${segment.notes} ${segment.block}`,
      ).includes(term),
    );
  }, [query, segments]);

  const progress =
    current && mode === "auto"
      ? Math.max(
          0,
          Math.min(
            100,
            ((now - Date.parse(current.startsAt)) /
              Math.max(1, Date.parse(current.endsAt) - Date.parse(current.startsAt))) *
              100,
          ),
        )
      : 0;

  const goNow = () => {
    if (!current) return;
    setDay(currentBlock?.dayNumber ?? day);
    window.setTimeout(() => {
      document
        .getElementById(`seg-${current.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  };

  const share = async () => {
    const url = `${window.location.origin}/programa`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Programa 48H La Supercasa",
          text: "Programa del equipo para la maratón 48H.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F2354]">
      <header className="mx-auto w-full max-w-4xl px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E6009E]">
              La Supercasa · Equipo
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Programa 48H
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Viernes 20 a domingo 22 de noviembre · Bogotá
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/program/excel"
              download
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E6009E] px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E]"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Excel
            </a>
            <button
              type="button"
              onClick={() => void share()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-extrabold text-[#0F2354] transition hover:border-[#E6009E]/40"
            >
              {shared ? (
                <Check className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              ) : (
                <Share2 className="h-4 w-4" strokeWidth={2} />
              )}
              {shared ? "Copiado" : "Compartir"}
            </button>
          </div>
        </div>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar invitado, segmento o bloque"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-[#0F2354] outline-none transition placeholder:text-slate-400 focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
          />
        </div>
      </header>

      <div className="sticky top-0 z-30 border-y border-white/10 bg-[#0F2354] text-white shadow-lg">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6009E] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider">
            <Radio className="h-3 w-3" strokeWidth={2.5} />
            {mode === "manual" ? "En vivo según el equipo" : "Según cronograma"}
          </span>
          <span className="text-[10px] font-bold text-white/60">
            {clock(new Date(now).toISOString())} Bogotá
          </span>
          {current ? (
            <button
              type="button"
              onClick={goNow}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
              Ir a ahora
            </button>
          ) : null}
        </div>
        {current ? (
          <div className="mx-auto w-full max-w-4xl px-4 pb-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[11px] font-extrabold text-[#B5F43D]">
                {currentBlock?.label ?? `Bloque ${current.block}`}
              </span>
              <span className="text-[10px] font-semibold text-white/55">
                {current.startClock} - {current.endClock}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-extrabold leading-snug sm:text-base">
              {current.name}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-semibold text-white/70">
              {current.presenter ? <span>{current.presenter}</span> : null}
              {current.type ? <span>{current.type}</span> : null}
              {next ? (
                <span className="text-white/50">
                  Sigue: {next.name} · {next.startClock}
                </span>
              ) : null}
            </p>
            {mode === "auto" ? (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#B5F43D] transition-all"
                  style={{ width: `${progress.toFixed(1)}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl px-4 pb-3 text-sm font-bold">
            {next ? `Lo próximo: ${next.name} · ${next.startClock}` : "El programa terminó."}
          </div>
        )}
      </div>

      <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4">
        {!query ? (
          <>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {PROGRAM_DAYS.map((item) => {
                const active = day === item.number;
                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setDay(item.number)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-extrabold transition ${
                      active
                        ? "bg-[#0F2354] text-white"
                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-[#0F2354]"
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
                    {item.short}
                  </button>
                );
              })}
              <span className="ml-auto self-center text-[10px] font-bold text-slate-400">
                {daySegments.length} segmentos
              </span>
            </div>

            <div className="space-y-3">
              {dayBlocks.map((block, index) => {
                const blockSegments = segments.filter(
                  (segment) => segment.block === block.number,
                );
                return (
                  <BlockDetails
                    key={block.number}
                    block={block}
                    segments={blockSegments}
                    currentId={current?.id}
                    initialOpen={
                      currentBlock?.number === block.number || (!currentBlock && index === 0)
                    }
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">
              {results.length} resultados para "{query}"
            </p>
            {results.map((segment) => {
              const block = blocks.find((item) => item.number === segment.block);
              return (
                <article
                  key={segment.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-[62px] shrink-0 text-[11px] font-extrabold text-[#0F2354]">
                      {segment.startClock}
                      <span className="block text-[10px] font-semibold text-slate-400">
                        {block?.label}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-extrabold leading-snug text-[#0F2354]">
                        {segment.name}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        {[segment.presenter, segment.type, segment.notes]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-[11px] font-semibold text-slate-400">
            Programa interno del equipo. No se indexa en buscadores.
          </p>
          <p className="mt-3 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} La Supercasa. All Rights Reserved. | Built by{" "}
            <a
              href="https://svgvisual.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E6009E] transition hover:brightness-110"
            >
              SVG
            </a>
          </p>
        </footer>
      </main>

      {current ? (
        <button
          type="button"
          onClick={goNow}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0F2354] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-xl transition hover:bg-[#183478]"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          Ahora
        </button>
      ) : null}
    </div>
  );
}
