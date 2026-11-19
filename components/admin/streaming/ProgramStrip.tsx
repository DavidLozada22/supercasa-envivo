"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Send } from "lucide-react";
import blocksJson from "@/lib/program/blocks.json";
import segmentsJson from "@/lib/program/segments.json";
import type { ProgramBlock, ProgramSegment } from "@/lib/program/types";

const CLOCK = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Bogota",
});

function clock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

export default function ProgramStrip() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const blocks = blocksJson as ProgramBlock[];
  const segments = segmentsJson as ProgramSegment[];

  const currentBlock = useMemo(
    () =>
      blocks.find((block) => now >= Date.parse(block.startsAt) && now < Date.parse(block.endsAt)) ??
      null,
    [blocks, now],
  );

  const currentSegment = useMemo(
    () =>
      segments.find(
        (segment) => now >= Date.parse(segment.startsAt) && now < Date.parse(segment.endsAt),
      ) ?? null,
    [segments, now],
  );

  const next = useMemo(
    () =>
      segments
        .filter((segment) => Date.parse(segment.startsAt) > now)
        .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0] ?? null,
    [segments, now],
  );

  const upcomingBlock = useMemo(
    () =>
      blocks
        .filter((block) => Date.parse(block.startsAt) > now)
        .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0] ?? null,
    [blocks, now],
  );

  const block = currentBlock ?? upcomingBlock;

  return (
    <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          {currentBlock ? "Bloque en curso" : "Próximo bloque"}
        </p>
        <p className="mt-1 truncate text-sm font-extrabold text-[#0F2354]">
          {block ? `${block.label} · ${block.title}` : "Fuera de programación"}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {block ? `${block.schedule} · ${block.host || "por confirmar"}` : "Revisa la escaleta"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          {currentSegment ? "Al aire" : "Empieza"}
        </p>
        <p className="mt-1 truncate text-sm font-extrabold text-[#0F2354]">
          {currentSegment?.name ?? next?.name ?? "Sin segmento activo"}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {currentSegment
            ? `${currentSegment.clock} a ${clock(currentSegment.endsAt)} · ${currentSegment.presenter || "sin responsable"}`
            : next
              ? `${next.clock} · Bloque ${next.block}`
              : "Carga la escaleta nueva"}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
        <Link
          href="/admin/programa"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5"
        >
          Ver programa
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
        {block ? (
          <Link
            href={`/admin/avisos?block=${block.number}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E6009E] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#B8007E]"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
            Avisar
          </Link>
        ) : null}
      </div>
    </section>
  );
}
