"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { ProgramBlock, ProgramSegment, ProgramState } from "@/lib/program/types";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-[#0F2354] outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

function addMinutes(value: string, amount: number): string {
  const total = timeToMinutes(value);
  if (total === null) return value;
  const next = ((total + amount) % (24 * 60) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
}

function durationLabel(segment: ProgramSegment): string {
  const start = timeToMinutes(segment.startClock);
  const end = timeToMinutes(segment.endClock);
  if (start === null || end === null) return "";
  const minutes = end >= start ? end - start : 24 * 60 - start + end;
  return `${minutes} min`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function validate(draft: ProgramState): string[] {
  const errors: string[] = [];
  for (const block of draft.blocks) {
    if (!block.title.trim()) errors.push(`${block.label}: falta el nombre del bloque.`);
    if (timeToMinutes(block.startClock) === null || timeToMinutes(block.endClock) === null) {
      errors.push(`${block.label}: la hora de inicio o fin no es válida.`);
    }
  }
  for (const segment of draft.segments) {
    if (!segment.name.trim()) {
      errors.push(`Bloque ${segment.block}, ${segment.startClock}: falta el nombre del segmento.`);
    }
    if (timeToMinutes(segment.startClock) === null || timeToMinutes(segment.endClock) === null) {
      errors.push(`Bloque ${segment.block}, ${segment.startClock || "sin hora"}: hora inválida.`);
    }
  }
  return errors;
}

export default function ProgramEditor({
  initial,
  user,
}: {
  initial: ProgramState;
  user: string;
}) {
  const [draft, setDraft] = useState<ProgramState>(() => clone(initial));
  const [baseline, setBaseline] = useState<ProgramState>(() => clone(initial));
  const [selected, setSelected] = useState(initial.blocks[0]?.number ?? "");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  );

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const selectedBlock = draft.blocks.find((block) => block.number === selected) ?? null;
  const blockSegments = useMemo(
    () => draft.segments.filter((segment) => segment.block === selected),
    [draft.segments, selected],
  );
  const filteredSegments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return blockSegments;
    return blockSegments.filter((segment) =>
      `${segment.name} ${segment.presenter} ${segment.type} ${segment.notes}`
        .toLowerCase()
        .includes(term),
    );
  }, [blockSegments, query]);
  const liveCount = draft.segments.filter((segment) => segment.live).length;
  const doneCount = draft.segments.filter((segment) => segment.done).length;
  const blockDone = blockSegments.filter((segment) => segment.done).length;
  const blockIndex = selectedBlock
    ? draft.blocks.findIndex((block) => block.number === selectedBlock.number)
    : -1;
  const canMoveBlockUp =
    blockIndex > 0 &&
    draft.blocks[blockIndex - 1]?.dayNumber === selectedBlock?.dayNumber;
  const canMoveBlockDown =
    blockIndex >= 0 &&
    blockIndex < draft.blocks.length - 1 &&
    draft.blocks[blockIndex + 1]?.dayNumber === selectedBlock?.dayNumber;

  const updateBlock = (patch: Partial<ProgramBlock>) => {
    if (!selectedBlock) return;
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.number === selectedBlock.number ? { ...block, ...patch } : block,
      ),
    }));
  };

  const updateSegment = (id: string, patch: Partial<ProgramSegment>) => {
    setDraft((current) => ({
      ...current,
      segments: current.segments.map((segment) =>
        segment.id === id ? { ...segment, ...patch } : segment,
      ),
    }));
  };

  const addBlock = () => {
    const max = draft.blocks.reduce((value, block) => Math.max(value, Number(block.number) || 0), 0);
    const number = String(max + 1).padStart(2, "0").slice(-2);
    const block: ProgramBlock = {
      number,
      label: `Bloque ${number}`,
      day: "Día 1",
      dayNumber: 1,
      schedule: "18:00 - 22:00",
      startClock: "18:00",
      endClock: "22:00",
      startsAt: "",
      endsAt: "",
      title: "Nuevo bloque",
      pillar: "",
      host: "",
      guests: "",
      focus: "",
      challenge: "",
      channels: "",
      minutes: 0,
      segmentCount: 0,
    };
    setDraft((current) => ({ ...current, blocks: [...current.blocks, block] }));
    setSelected(number);
    setMessage("Bloque agregado. Completa el nombre y los horarios.");
  };

  const deleteBlock = (number: string) => {
    if (draft.blocks.length <= 1) {
      setErrors(["El programa necesita al menos un bloque."]);
      return;
    }
    const remaining = draft.blocks.filter((block) => block.number !== number);
    setDraft((current) => ({
      ...current,
      blocks: remaining,
      segments: current.segments.filter((segment) => segment.block !== number),
    }));
    setSelected(remaining[0]?.number ?? "");
    setConfirmDelete(null);
    setMessage("Bloque eliminado. Guarda para confirmar.");
  };

  const addSegment = () => {
    if (!selectedBlock) return;
    const last = blockSegments[blockSegments.length - 1];
    const start = last?.endClock ?? selectedBlock.startClock;
    const end = addMinutes(start, 5);
    const segment: ProgramSegment = {
      id: newId(`S${selectedBlock.number}`),
      code: "",
      day: selectedBlock.day,
      block: selectedBlock.number,
      duration: 5,
      name: "Nuevo segmento",
      execution: "POR DEFINIR",
      live: false,
      type: "",
      presenter: "",
      file: "",
      format: "",
      platforms: "",
      status: "",
      notes: "",
      done: false,
      startsAt: "",
      endsAt: "",
      clock: start,
      startClock: start,
      endClock: end,
    };
    setDraft((current) => {
      const segments = [...current.segments];
      const lastIndex = segments.reduce(
        (index, item, position) => (item.block === selectedBlock.number ? position : index),
        -1,
      );
      if (lastIndex === -1) segments.push(segment);
      else segments.splice(lastIndex + 1, 0, segment);
      return { ...current, segments };
    });
    setQuery("");
  };

  const duplicateSegment = (segment: ProgramSegment) => {
    const copy: ProgramSegment = {
      ...segment,
      id: newId(`S${segment.block}`),
      code: "",
      name: `${segment.name} (copia)`,
      done: false,
      startsAt: "",
      endsAt: "",
    };
    setDraft((current) => {
      const segments = [...current.segments];
      const index = segments.findIndex((item) => item.id === segment.id);
      segments.splice(index + 1, 0, copy);
      return { ...current, segments };
    });
    setQuery("");
  };

  const moveSegment = (segment: ProgramSegment, direction: -1 | 1) => {
    setDraft((current) => {
      const group = current.segments.filter((item) => item.block === segment.block);
      const position = group.findIndex((item) => item.id === segment.id);
      const target = group[position + direction];
      if (!target) return current;

      const segments = [...current.segments];
      const from = segments.findIndex((item) => item.id === segment.id);
      const to = segments.findIndex((item) => item.id === target.id);
      segments.splice(from, 1);
      segments.splice(to, 0, segment);
      return { ...current, segments };
    });
  };

  const moveBlock = (direction: -1 | 1) => {
    if (!selectedBlock) return;
    setDraft((current) => {
      const index = current.blocks.findIndex((block) => block.number === selectedBlock.number);
      const target = index + direction;
      if (target < 0 || target >= current.blocks.length) return current;
      if (current.blocks[target].dayNumber !== current.blocks[index].dayNumber) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(index, 1);
      blocks.splice(target, 0, moved);
      return { ...current, blocks };
    });
  };

  const toggleDone = async (segment: ProgramSegment) => {
    const next = !segment.done;
    updateSegment(segment.id, { done: next });

    const stored = baseline.segments.some((item) => item.id === segment.id);
    if (!stored) return;

    setChecking(segment.id);
    try {
      const response = await fetch("/api/admin/program/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmentId: segment.id, done: next }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        updateSegment(segment.id, { done: segment.done });
        setErrors([body.error ?? "No se pudo guardar la marca."]);
        return;
      }
      setBaseline((current) => ({
        ...current,
        segments: current.segments.map((item) =>
          item.id === segment.id ? { ...item, done: next } : item,
        ),
      }));
    } catch {
      updateSegment(segment.id, { done: segment.done });
      setErrors(["Error de conexión al marcar el segmento."]);
    } finally {
      setChecking(null);
    }
  };

  const deleteSegment = (id: string) => {
    setDraft((current) => ({
      ...current,
      segments: current.segments.filter((segment) => segment.id !== id),
    }));
  };

  const save = async (): Promise<boolean> => {
    const nextErrors = validate(draft);
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setMessage("");
      return false;
    }

    setSaving(true);
    setErrors([]);
    setMessage("");
    try {
      const response = await fetch("/api/admin/program", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: draft.blocks, segments: draft.segments }),
      });
      const body = (await response.json()) as ProgramState & {
        error?: string;
        errors?: string[];
      };
      if (!response.ok) {
        setErrors(body.errors ?? [body.error ?? "No se pudo guardar."]);
        return false;
      }
      setDraft(body);
      setBaseline(body);
      setMessage(`Programa guardado por ${user}. Ya sale en /programa y en las moscas.`);
      return true;
    } catch {
      setErrors(["Error de conexión al guardar."]);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const syncAgenda = async () => {
    if (dirty) {
      const saved = await save();
      if (!saved) return;
    }
    setSyncing(true);
    setErrors([]);
    setMessage("");
    try {
      const response = await fetch("/api/admin/program/sync-agenda", { method: "POST" });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrors([body.error ?? "No se pudo sincronizar la agenda."]);
        return;
      }
      setMessage("Agenda de marketing actualizada con el programa actual.");
    } catch {
      setErrors(["Error de conexión al sincronizar la agenda."]);
    } finally {
      setSyncing(false);
    }
  };

  const discard = () => {
    setDraft(clone(baseline));
    setErrors([]);
    setMessage("Cambios descartados.");
  };

  const reset = async () => {
    setSaving(true);
    setErrors([]);
    setMessage("");
    try {
      const response = await fetch("/api/admin/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      const body = (await response.json()) as ProgramState & { error?: string };
      if (!response.ok) {
        setErrors([body.error ?? "No se pudo restaurar."]);
        return;
      }
      setDraft(body);
      setBaseline(body);
      setSelected(body.blocks[0]?.number ?? "");
      setConfirmReset(false);
      setMessage("Programa restaurado al JSON base.");
    } catch {
      setErrors(["Error de conexión al restaurar."]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="sticky top-0 z-30 -mx-4 border-b border-slate-200 bg-[#F5F7FB]/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/programa"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Volver
          </Link>
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${
              dirty ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {dirty ? "Cambios sin guardar" : "Guardado"}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={discard}
              disabled={!dirty || saving}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
              Descartar
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={!dirty || saving}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#E6009E] px-3.5 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Save className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Editor del programa
            </p>
            <h1 className="mt-1 text-lg font-extrabold text-[#0F2354]">
              Bloques, horarios, invitados y segmentos
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
              Cambia el programa y guarda. Se actualiza `/programa`, las moscas y el Excel.
              Marca la casilla de cada segmento cuando se cumpla: se guarda al instante.
              Mueve filas y bloques con las flechas.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              {draft.blocks.length} bloques
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              {draft.segments.length} segmentos
            </span>
            <span className="rounded-full bg-[#E6009E]/10 px-2.5 py-1 text-[#B8007E]">
              {liveCount} en vivo
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
              {doneCount} {doneCount === 1 ? "hecho" : "hechos"}
            </span>
            <button
              type="button"
              onClick={() => void syncAgenda()}
              disabled={syncing || saving}
              className="inline-flex items-center gap-1 rounded-full border border-[#E6009E]/30 bg-white px-2.5 py-1 text-[#B8007E] transition hover:bg-[#E6009E]/5 disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
              ) : (
                <RefreshCw className="h-3 w-3" strokeWidth={2} />
              )}
              Sincronizar agenda
            </button>
            <a
              href="/api/program/excel"
              className="inline-flex items-center gap-1 rounded-full bg-[#0F2354] px-2.5 py-1 text-white"
            >
              <Download className="h-3 w-3" strokeWidth={2} />
              Excel
            </a>
            <a
              href="/programa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[#0F2354]"
            >
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
              Ver público
            </a>
          </div>
        </div>
        {message ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
            {message}
          </p>
        ) : null}
      </section>

      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-red-800">Revisa esto antes de guardar</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-red-700">
                {errors.slice(0, 8).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {confirmReset ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-extrabold text-amber-900">
            ¿Restaurar el programa al JSON base?
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
            Se pierden los cambios guardados en el editor, incluidas las marcas de hecho. Las
            escenas y los gráficos vuelven al programa del repositorio.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void reset()}
              disabled={saving}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-[11px] font-extrabold text-white disabled:opacity-60"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Sí, restaurar
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="inline-flex min-h-[40px] items-center rounded-lg border border-amber-300 px-3 py-2 text-[11px] font-bold text-amber-900"
            >
              Cancelar
            </button>
          </div>
        </section>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-[10px] font-bold text-slate-400 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Restaurar al JSON base
          </button>
        </div>
      )}

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Bloques
            </p>
            <button
              type="button"
              onClick={addBlock}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#0F2354] px-2.5 py-1.5 text-[10px] font-extrabold text-white"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Agregar bloque
            </button>
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {draft.blocks.map((block) => {
              const active = block.number === selected;
              const items = draft.segments.filter((segment) => segment.block === block.number);
              const count = items.length;
              const done = items.filter((segment) => segment.done).length;
              return (
                <button
                  key={block.number}
                  type="button"
                  onClick={() => {
                    setSelected(block.number);
                    setQuery("");
                  }}
                  className={`min-w-[184px] shrink-0 rounded-xl border px-2.5 py-2 text-left transition ${
                    active
                      ? "border-[#E6009E]/40 bg-[#E6009E]/5"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-lg text-[10px] font-extrabold ${
                        active ? "bg-[#E6009E] text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {block.number}
                    </span>
                    <span className="line-clamp-2 text-[10px] font-extrabold leading-tight text-[#0F2354]">
                      {block.title || "Sin nombre"}
                    </span>
                  </span>
                  <span className="mt-1 block text-[9px] font-semibold text-slate-400">
                    {block.day} · {block.startClock} a {block.endClock} · {count} seg.
                  </span>
                  <span
                    className={`mt-0.5 block text-[9px] font-extrabold ${
                      done === count && count > 0 ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {done} de {count} hechos
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="min-w-0 space-y-4">
          {selectedBlock ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                    {selectedBlock.label}
                  </p>
                  <h2 className="mt-1 text-base font-extrabold text-[#0F2354]">
                    Datos del bloque
                  </h2>
                </div>
                {confirmDelete === selectedBlock.number ? (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => deleteBlock(selectedBlock.number)}
                      className="min-h-[36px] rounded-lg bg-red-600 px-2.5 py-1.5 text-[10px] font-extrabold text-white"
                    >
                      Eliminar bloque
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="min-h-[36px] rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-600"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveBlock(-1)}
                      disabled={!canMoveBlockUp}
                      aria-label="Subir bloque"
                      title="Subir bloque"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#E6009E]/40 hover:text-[#0F2354] disabled:opacity-40"
                    >
                      <ChevronUp className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(1)}
                      disabled={!canMoveBlockDown}
                      aria-label="Bajar bloque"
                      title="Bajar bloque"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#E6009E]/40 hover:text-[#0F2354] disabled:opacity-40"
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(selectedBlock.number)}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={2} />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-3">
                <Field label="Nombre del bloque">
                  <input
                    value={selectedBlock.title}
                    onChange={(event) => updateBlock({ title: event.target.value })}
                    className={inputClass}
                    placeholder="Ej. El Gran Inicio"
                  />
                </Field>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Día">
                    <select
                      value={selectedBlock.dayNumber}
                      onChange={(event) => {
                        const dayNumber = Number(event.target.value);
                        updateBlock({ dayNumber, day: `Día ${dayNumber}` });
                      }}
                      className={inputClass}
                    >
                      <option value={1}>Día 1</option>
                      <option value={2}>Día 2</option>
                      <option value={3}>Día 3</option>
                    </select>
                  </Field>
                  <Field label="Inicio">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="HH:MM"
                      value={selectedBlock.startClock}
                      onChange={(event) => updateBlock({ startClock: event.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fin">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="HH:MM"
                      value={selectedBlock.endClock}
                      onChange={(event) => updateBlock({ endClock: event.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Conducción">
                    <input
                      value={selectedBlock.host}
                      onChange={(event) => updateBlock({ host: event.target.value })}
                      className={inputClass}
                      placeholder="Ej. Sebas"
                    />
                  </Field>
                </div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Horas en formato 24 horas. Ejemplo: 18:00. Si el bloque cruza medianoche,
                  pon el fin antes del inicio.
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Field label="Pilar">
                    <input
                      value={selectedBlock.pillar}
                      onChange={(event) => updateBlock({ pillar: event.target.value })}
                      className={inputClass}
                      placeholder="Ej. Visión general"
                    />
                  </Field>
                  <Field label="Invitados">
                    <input
                      value={selectedBlock.guests}
                      onChange={(event) => updateBlock({ guests: event.target.value })}
                      className={inputClass}
                      placeholder="Ej. Invitados especiales"
                    />
                  </Field>
                  <Field label="Enfoque">
                    <input
                      value={selectedBlock.focus}
                      onChange={(event) => updateBlock({ focus: event.target.value })}
                      className={inputClass}
                      placeholder="Ej. Piso 1 y red eléctrica"
                    />
                  </Field>
                </div>
                <Field label="Reto del bloque">
                  <textarea
                    rows={2}
                    value={selectedBlock.challenge}
                    onChange={(event) => updateBlock({ challenge: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Canales">
                  <input
                    value={selectedBlock.channels}
                    onChange={(event) => updateBlock({ channels: event.target.value })}
                    className={inputClass}
                    placeholder="Ej. Instagram, TikTok, Kick"
                  />
                </Field>
              </div>
            </section>
          ) : null}

          {selectedBlock ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
                    Segmentos
                  </p>
                  <h2 className="mt-1 text-base font-extrabold text-[#0F2354]">
                    {blockSegments.length} en {selectedBlock.label}
                  </h2>
                  <p className="mt-0.5 text-[10px] font-extrabold text-emerald-600">
                    {blockDone} de {blockSegments.length} hechos
                  </p>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar segmento"
                      className="w-44 rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-2 text-[11px] font-semibold text-[#0F2354] outline-none focus:border-[#E6009E]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSegment}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-[#E6009E] px-2.5 py-1.5 text-[10px] font-extrabold text-white"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    Agregar segmento
                  </button>
                </div>
              </div>

              <p className="mt-2 text-[10px] font-semibold text-slate-400">
                Desliza la tabla para ver todas las columnas, sobre todo Estado y Notas.
              </p>

              <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[1108px] table-fixed border-collapse text-left">
                  <colgroup>
                    <col style={{ width: 48 }} />
                    <col style={{ width: 72 }} />
                    <col style={{ width: 72 }} />
                    <col style={{ width: 210 }} />
                    <col style={{ width: 116 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 108 }} />
                    <col style={{ width: 92 }} />
                    <col style={{ width: 140 }} />
                    <col style={{ width: 140 }} />
                  </colgroup>
                  <thead className="bg-slate-50 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th
                        className="sticky left-0 z-20 bg-slate-50 px-1 py-2 text-center shadow-[1px_0_0_0_#e2e8f0]"
                        scope="col"
                      >
                        Hecho
                      </th>
                      <th className="px-2 py-2">Inicio</th>
                      <th className="px-2 py-2">Fin</th>
                      <th className="px-2 py-2">Segmento</th>
                      <th className="px-2 py-2">Ejecución</th>
                      <th className="px-2 py-2">Tipo</th>
                      <th className="px-2 py-2">Responsable</th>
                      <th className="px-2 py-2">Estado</th>
                      <th className="px-2 py-2">Notas</th>
                      <th className="bg-slate-50 px-2 py-2 text-right lg:sticky lg:right-0 lg:z-20 lg:shadow-[-1px_0_0_0_#e2e8f0]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSegments.map((segment) => (
                      <tr
                        key={segment.id}
                        className={`border-t border-slate-100 align-top ${
                          segment.done ? "bg-emerald-50" : ""
                        }`}
                      >
                        <td
                          className={`sticky left-0 z-10 px-1 py-1.5 shadow-[1px_0_0_0_#e2e8f0] ${
                            segment.done ? "bg-emerald-50" : "bg-white"
                          }`}
                        >
                          <label className="flex h-11 w-11 cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              checked={segment.done}
                              disabled={checking !== null}
                              onChange={() => void toggleDone(segment)}
                              aria-label={`Marcar ${segment.name} como hecho`}
                              title={segment.done ? "Hecho" : "Marcar como hecho"}
                              className="h-4 w-4 cursor-pointer accent-[#E6009E]"
                            />
                          </label>
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="HH:MM"
                            value={segment.startClock}
                            onChange={(event) =>
                              updateSegment(segment.id, {
                                startClock: event.target.value,
                                clock: event.target.value,
                              })
                            }
                            aria-label={`Inicio de ${segment.name}`}
                            className={inputClass}
                          />
                          <span className="mt-0.5 block px-1 text-[9px] font-semibold text-slate-400">
                            {durationLabel(segment)}
                          </span>
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="HH:MM"
                            value={segment.endClock}
                            onChange={(event) =>
                              updateSegment(segment.id, { endClock: event.target.value })
                            }
                            aria-label={`Fin de ${segment.name}`}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            value={segment.name}
                            onChange={(event) =>
                              updateSegment(segment.id, { name: event.target.value })
                            }
                            aria-label="Nombre del segmento"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-1.5 py-1.5">
                          <select
                            value={segment.execution}
                            onChange={(event) => {
                              const execution = event.target.value;
                              updateSegment(segment.id, {
                                execution,
                                live: execution === "EN VIVO",
                              });
                            }}
                            aria-label="Ejecución"
                            className={`${inputClass} text-[11px]`}
                          >
                            <option value="EN VIVO">EN VIVO</option>
                            <option value="PREGRABADO">PREGRABADO</option>
                            <option value="POR DEFINIR">POR DEFINIR</option>
                          </select>
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            value={segment.type}
                            onChange={(event) =>
                              updateSegment(segment.id, { type: event.target.value })
                            }
                            aria-label="Tipo de contenido"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            value={segment.presenter}
                            onChange={(event) =>
                              updateSegment(segment.id, { presenter: event.target.value })
                            }
                            aria-label="Responsable"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            value={segment.status}
                            onChange={(event) =>
                              updateSegment(segment.id, { status: event.target.value })
                            }
                            aria-label="Estado"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-1.5 py-1.5">
                          <input
                            value={segment.notes}
                            onChange={(event) =>
                              updateSegment(segment.id, { notes: event.target.value })
                            }
                            aria-label="Notas"
                            className={inputClass}
                          />
                        </td>
                        <td
                          className={`px-1.5 py-1.5 lg:sticky lg:right-0 lg:z-10 lg:shadow-[-1px_0_0_0_#e2e8f0] ${
                            segment.done ? "lg:bg-emerald-50" : "lg:bg-white"
                          }`}
                        >
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => moveSegment(segment, -1)}
                              disabled={blockSegments[0]?.id === segment.id}
                              aria-label={`Subir ${segment.name}`}
                              title="Subir"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#E6009E]/40 hover:text-[#0F2354] disabled:opacity-40"
                            >
                              <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSegment(segment, 1)}
                              disabled={blockSegments[blockSegments.length - 1]?.id === segment.id}
                              aria-label={`Bajar ${segment.name}`}
                              title="Bajar"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#E6009E]/40 hover:text-[#0F2354] disabled:opacity-40"
                            >
                              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateSegment(segment)}
                              aria-label={`Duplicar ${segment.name}`}
                              title="Duplicar"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#E6009E]/40 hover:text-[#0F2354]"
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSegment(segment.id)}
                              aria-label={`Eliminar ${segment.name}`}
                              title="Eliminar"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredSegments.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs font-semibold text-slate-400">
                  {blockSegments.length === 0
                    ? "Este bloque no tiene segmentos. Agrega el primero."
                    : "No hay segmentos con esa búsqueda."}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
