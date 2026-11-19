"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Send,
  Users,
} from "lucide-react";
import { announcementHtml, DONATE_URL, LIVE_URL } from "@/lib/announcements/templates";
import type { AnnouncementLogEntry } from "@/lib/announcements/store";
import type { ProgramBlock } from "@/lib/program/types";

type Kind = "inicio" | "bloque" | "en-vivo" | "meta" | "cierre" | "gracias" | "libre";

const PRESETS: Array<{ id: Kind; label: string }> = [
  { id: "inicio", label: "Antes de empezar" },
  { id: "bloque", label: "Ya viene un bloque" },
  { id: "en-vivo", label: "Bloque al aire" },
  { id: "meta", label: "Empujón de la meta" },
  { id: "cierre", label: "Última hora" },
  { id: "gracias", label: "Gracias" },
  { id: "libre", label: "Mensaje libre" },
];

const SUBJECTS: Record<Exclude<Kind, "bloque" | "en-vivo" | "libre">, string> = {
  inicio: "La maratón empieza en 1 hora",
  meta: "Vamos por la meta de La Supercasa",
  cierre: "Última hora: vamos por el 100%",
  gracias: "Gracias por acompañar La Supercasa",
};

const MESSAGES: Record<Exclude<Kind, "bloque" | "en-vivo" | "libre">, string> = {
  inicio:
    "Hoy a las 6:00 p. m. arrancan 48 horas por La Supercasa. Acompáñanos en el live y ayúdanos a terminar la casa de los Súper Calvitos.",
  meta: "Cada aporte acerca la casa a su meta. Entra al live, mira el avance y suma tu pieza.",
  cierre:
    "Quedan pocas horas de la maratón. Este es el último empujón para llegar al 100% de la meta.",
  gracias:
    "Terminaron 48 horas increíbles. Gracias por acompañarnos, por donar y por creer en los Súper Calvitos.",
};

export default function AnnouncementsPanel({
  blocks,
  initialBlock,
}: {
  blocks: ProgramBlock[];
  initialBlock: string;
}) {
  const [kind, setKind] = useState<Kind>(initialBlock ? "bloque" : "inicio");
  const [blockNumber, setBlockNumber] = useState(
    initialBlock || blocks[0]?.number || "01",
  );
  const [subject, setSubject] = useState(SUBJECTS.inicio);
  const [message, setMessage] = useState(MESSAGES.inicio);
  const [ctaLabel, setCtaLabel] = useState("Entrar al live");
  const [ctaUrl, setCtaUrl] = useState(LIVE_URL);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [audience, setAudience] = useState(0);
  const [history, setHistory] = useState<AnnouncementLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const block = blocks.find((item) => item.number === blockNumber) ?? blocks[0];

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/announcements", { cache: "no-store" });
      if (!response.ok) return;
      const body = (await response.json()) as {
        audience?: { total?: number };
        history?: AnnouncementLogEntry[];
      };
      setAudience(Number(body.audience?.total ?? 0));
      setHistory(body.history ?? []);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const applyBlock = useCallback(
    (number: string, mode: "bloque" | "en-vivo") => {
      const target = blocks.find((item) => item.number === number);
      if (!target) return;
      if (mode === "bloque") {
        setSubject(`Ya viene el ${target.label}: ${target.title}`);
        setMessage(
          `${target.day}, de ${target.startClock} a ${target.endClock}. ${target.challenge} Entra al live y acompáñanos.`,
        );
      } else {
        setSubject(`Estamos en vivo: ${target.title}`);
        setMessage(
          `Ya empezó el ${target.label}. ${target.challenge} Entra ahora y no te pierdas lo que viene.`,
        );
      }
      setCtaLabel("Entrar al live");
      setCtaUrl(LIVE_URL);
      setConfirmed(false);
      setResult("");
      setError("");
    },
    [blocks],
  );

  useEffect(() => {
    if (initialBlock) applyBlock(initialBlock, "bloque");
  }, [initialBlock, applyBlock]);

  const choose = (next: Kind) => {
    setKind(next);
    setConfirmed(false);
    setResult("");
    setError("");
    if (next === "bloque" || next === "en-vivo") {
      applyBlock(blockNumber, next);
      return;
    }
    if (next === "meta" || next === "cierre") {
      setCtaLabel("Donar ahora");
      setCtaUrl(DONATE_URL);
    } else {
      setCtaLabel("Entrar al live");
      setCtaUrl(LIVE_URL);
    }
    if (next !== "libre") {
      setSubject(SUBJECTS[next]);
      setMessage(MESSAGES[next]);
    }
  };

  const chooseBlock = (number: string) => {
    setBlockNumber(number);
    if (kind === "bloque" || kind === "en-vivo") applyBlock(number, kind);
    setConfirmed(false);
  };

  const preview = useMemo(
    () => announcementHtml({ subject, message, ctaLabel, ctaUrl }, "Nelson"),
    [subject, message, ctaLabel, ctaUrl],
  );

  const send = async () => {
    setSending(true);
    setResult("");
    setError("");
    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, subject, message, ctaLabel, ctaUrl }),
      });
      const body = (await response.json()) as {
        sent?: number;
        failed?: number;
        total?: number;
        error?: string;
      };
      if (!response.ok) {
        setError(body.error ?? "No se pudo enviar.");
        return;
      }
      setResult(
        `Enviados ${body.sent ?? 0} de ${body.total ?? 0}. Fallidos: ${body.failed ?? 0}.`,
      );
      setConfirmed(false);
      await load();
    } catch {
      setError("Error de conexión al enviar.");
    } finally {
      setSending(false);
    }
  };

  const canSend = confirmed && !sending && audience > 0 && subject.trim().length > 3;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Avisos a inscritos
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#0F2354]">Nuevo correo</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            {loaded ? `${audience} inscritos` : "Consultando"}
          </span>
        </header>

        <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700">
          Solo llega a quienes dejaron el correo en la página del live. A un espectador que
          nunca se inscribió no se le puede escribir.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Tipo de aviso</span>
            <select
              value={kind}
              onChange={(event) => choose(event.target.value as Kind)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#0F2354] outline-none focus:border-[#E6009E] focus:bg-white"
            >
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          {kind === "bloque" || kind === "en-vivo" ? (
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Bloque</span>
              <select
                value={blockNumber}
                onChange={(event) => chooseBlock(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#0F2354] outline-none focus:border-[#E6009E] focus:bg-white"
              >
                {blocks.map((item) => (
                  <option key={item.number} value={item.number}>
                    {item.label} · {item.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Asunto</span>
          <input
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setConfirmed(false);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#E6009E] focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Mensaje</span>
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setConfirmed(false);
            }}
            rows={5}
            className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none focus:border-[#E6009E] focus:bg-white"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Texto del botón</span>
            <input
              value={ctaLabel}
              onChange={(event) => setCtaLabel(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#E6009E] focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">Enlace del botón</span>
            <input
              value={ctaUrl}
              onChange={(event) => setCtaUrl(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#E6009E] focus:bg-white"
            />
          </label>
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#E6009E]"
          />
          Revisé el asunto, el texto y el enlace. Confirmo enviarlo a {audience} personas.
        </label>

        {result ? (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            {result}
          </p>
        ) : null}
        {error ? (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#B8007E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Send className="h-4 w-4" strokeWidth={2} />
          )}
          {sending ? "Enviando" : `Enviar a ${audience} inscritos`}
        </button>

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            Buenos momentos para enviar
          </p>
          <ul className="grid gap-1 text-[11px] text-slate-600">
            <li>24 horas antes y 1 hora antes del arranque.</li>
            <li>Al abrir los bloques ancla: inicio, gamer, gala y cierre.</li>
            <li>10:00 a. m. y 4:00 p. m. de cada día, con el avance de la meta.</li>
            <li>Última hora y mensaje de gracias al terminar.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            <Mail className="h-4 w-4" strokeWidth={2} />
            Vista previa
          </div>
          <iframe
            title="Vista previa del correo"
            srcDoc={preview}
            className="h-[520px] w-full border-0 bg-white"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
            Historial
          </p>
          {history.length === 0 ? (
            <p className="text-xs text-slate-500">Todavía no se ha enviado ningún aviso.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li
                  key={`${entry.at}-${entry.subject}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="text-xs font-bold text-[#0F2354]">{entry.subject}</p>
                  <p className="text-[11px] text-slate-500">
                    {new Date(entry.at).toLocaleString("es-CO")} · {entry.sent} enviados ·{" "}
                    {entry.failed} fallidos
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
