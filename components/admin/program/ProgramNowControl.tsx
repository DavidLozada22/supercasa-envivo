"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Loader2, Radio } from "lucide-react";
import { PROGRAM_BLOCKS } from "@/lib/program/data";
import type { ProgramSegment } from "@/lib/program/types";

type Marker = {
  segmentId: string | null;
  updatedAt: string;
  updatedBy: string;
};

export default function ProgramNowControl({ segments }: { segments: ProgramSegment[] }) {
  const [marker, setMarker] = useState<Marker | null>(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/program/now", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Marker | null) => {
        if (!alive || !body) return;
        setMarker(body);
        setSelected(body.segmentId ?? "");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const save = async (segmentId: string | null) => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/program/now", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmentId }),
      });
      const body = (await response.json()) as Marker & { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo guardar.");
        return;
      }
      setMarker(body);
      setSelected(body.segmentId ?? "");
      setMessage(
        segmentId
          ? "El programa público va a mostrar este segmento como el actual."
          : "El programa público vuelve a seguir el reloj.",
      );
    } catch {
      setError("Error de conexión al guardar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
            Programa en vivo
          </p>
          <h3 className="mt-1 text-sm font-extrabold text-[#0F2354]">
            ¿Dónde va el equipo ahora?
          </h3>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
            Si el programa se corre, marca el segmento actual. El programa público lo sigue
            aunque el reloj diga otra cosa. Si no marcas nada, sigue el cronograma automático.
          </p>
        </div>
        <a
          href="/programa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Ver programa público
        </a>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-[#0F2354] outline-none focus:border-[#E6009E] focus:bg-white"
        >
          <option value="">Automático por reloj</option>
          {PROGRAM_BLOCKS.map((block) => (
            <optgroup key={block.number} label={`${block.label} · ${block.schedule}`}>
              {segments
                .filter((segment) => segment.block === block.number)
                .map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.clock} · {segment.name || segment.code}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void save(selected || null)}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Radio className="h-4 w-4" strokeWidth={2} />
          )}
          Marcar aquí
        </button>
        <button
          type="button"
          onClick={() => void save(null)}
          disabled={busy}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Check className="h-4 w-4" strokeWidth={2} />
          Automático
        </button>
      </div>

      <p className="mt-2 text-[11px] font-semibold text-slate-500">
        {marker?.segmentId
          ? `Marcado por ${marker.updatedBy || "el equipo"} a las ${new Date(
              marker.updatedAt,
            ).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}.`
          : "Modo automático: el programa público usa la hora de Bogotá."}
      </p>
      {message ? (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
