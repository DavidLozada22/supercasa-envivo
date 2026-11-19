"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Send,
  Users,
} from "lucide-react";
import type { AnnouncementLogEntry } from "@/lib/announcements/store";
import {
  REMINDER_GROUPS,
  REMINDER_PRESETS,
  type ReminderGroup,
  type ReminderPreset,
} from "@/lib/announcements/presets";

type Reminder = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  sentAt: string | null;
  ref: string | null;
};

const date = new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short" });

const FORM_URL = "https://supercasa.svgvisual.com/envivo#avisame";

const GROUP_TONE: Record<ReminderGroup, string> = {
  "Antes del evento": "bg-[#E6009E]/10 text-[#B8007E]",
  "Durante el live": "bg-[#B5F43D]/25 text-[#4d7a00]",
  "Después del live": "bg-[#00A8E8]/12 text-[#0077a8]",
};

export default function RemindersPanel() {
  const [rows, setRows] = useState<Reminder[]>([]);
  const [audience, setAudience] = useState(0);
  const [history, setHistory] = useState<AnnouncementLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [remindersResponse, announcementsResponse] = await Promise.all([
        fetch("/api/admin/reminders", { cache: "no-store" }),
        fetch("/api/admin/announcements", { cache: "no-store" }),
      ]);
      if (remindersResponse.ok) {
        const data = (await remindersResponse.json()) as { reminders?: Reminder[] };
        setRows(data.reminders ?? []);
      }
      if (announcementsResponse.ok) {
        const data = (await announcementsResponse.json()) as {
          audience?: { total?: number };
          history?: AnnouncementLogEntry[];
        };
        setAudience(Number(data.audience?.total ?? 0));
        setHistory(data.history ?? []);
      }
    } catch {
      // Se conserva la ultima lectura.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(
    () =>
      REMINDER_GROUPS.map((group) => ({
        group,
        presets: REMINDER_PRESETS.filter((preset) => preset.group === group),
      })),
    [],
  );

  const send = async (preset: ReminderPreset) => {
    setSendingId(preset.id);
    setResult("");
    setError("");
    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: preset.id,
          subject: preset.subject,
          message: preset.message,
          ctaLabel: preset.ctaLabel,
          ctaUrl: preset.ctaUrl,
        }),
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
        `“${preset.title}” salió a ${body.sent ?? 0} de ${body.total ?? 0} personas. Fallidos: ${body.failed ?? 0}.`,
      );
      setConfirmId("");
      await load();
    } catch {
      setError("Error de conexión al enviar.");
    } finally {
      setSendingId("");
    }
  };

  const copyForm = async () => {
    try {
      await navigator.clipboard.writeText(FORM_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const exportCsv = () => {
    const lines = rows.map((row) =>
      [
        row.email,
        row.name ?? "",
        date.format(new Date(row.createdAt)),
        row.sentAt ? "Enviado" : "Pendiente",
        row.ref ?? "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([`\uFEFFCorreo,Nombre,Fecha,Estado,Referido\n${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recordatorios-supercasa.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Cómo funcionan
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#0F2354]">
              Recordatorios listos para enviar
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              Elige el momento, revisa el asunto y el texto, y confirma. El correo sale a todos
              los inscritos con su nombre. No se programan solos: tú decides cuándo enviar para
              no mandar un aviso equivocado en pleno live.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            {loading ? "Consultando" : `${audience} inscritos`}
          </span>
        </div>

        <ol className="mt-4 grid gap-2 md:grid-cols-3">
          {[
            "Elige el momento: antes, durante o después del live.",
            "Revisa el asunto, el texto y el botón.",
            "Confirma el envío. Llega a los inscritos con su nombre.",
          ].map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-slate-600"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0F2354] text-[10px] font-extrabold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {audience === 0 ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-extrabold text-amber-800">
              Todavía no hay inscritos en la base.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-700">
              Comparte el formulario del live para empezar a llenar la lista. Cuando alguien deja
              su correo, queda aquí y recibe la confirmación.
            </p>
            <button
              type="button"
              onClick={copyForm}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#183478]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Copy className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {copied ? "Enlace copiado" : "Copiar enlace del formulario"}
            </button>
          </div>
        ) : null}

        {result ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            {result}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            {error}
          </p>
        ) : null}
      </section>

      {grouped.map(({ group, presets }) => (
        <section key={group} className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${GROUP_TONE[group]}`}
            >
              {group}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {presets.length} mensajes listos
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {presets.map((preset) => {
              const confirming = confirmId === preset.id;
              const busy = sendingId === preset.id;
              return (
                <article
                  key={preset.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold leading-tight text-[#0F2354]">
                        {preset.title}
                      </h3>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {preset.when}
                      </p>
                    </div>
                    <Bell className="h-4 w-4 shrink-0 text-[#E6009E]" strokeWidth={2} />
                  </div>

                  <p className="mt-2 text-xs font-bold leading-snug text-[#0F2354]">
                    {preset.subject}
                  </p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-slate-500">
                    {preset.message}
                  </p>

                  <p className="mt-2 text-[10px] font-semibold text-slate-400">
                    Botón: {preset.ctaLabel}
                  </p>

                  <div className="mt-auto pt-3">
                    {confirming ? (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-[#0F2354]">
                          ¿Enviar a {audience} personas?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void send(preset)}
                            disabled={busy || audience === 0}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#E6009E] px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-50"
                          >
                            {busy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                            ) : (
                              <Send className="h-3.5 w-3.5" strokeWidth={2} />
                            )}
                            Sí, enviar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId("")}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmId(preset.id);
                          setResult("");
                          setError("");
                        }}
                        disabled={audience === 0}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#183478] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" strokeWidth={2} />
                        {audience === 0 ? "Sin inscritos" : "Enviar recordatorio"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Inscritos
              </p>
              <h3 className="mt-1 text-sm font-extrabold text-[#0F2354]">
                {rows.length} personas en la lista
              </h3>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              CSV
            </button>
          </div>

          {rows.length === 0 ? (
            <p className="text-xs text-slate-500">
              Aún no hay correos. Comparte el formulario del live para empezar.
            </p>
          ) : (
            <div className="max-h-[320px] overflow-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="sticky top-0 bg-white text-[9px] uppercase tracking-wider text-slate-400">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-2 font-extrabold">Correo</th>
                    <th className="py-2 pr-2 font-extrabold">Nombre</th>
                    <th className="py-2 font-extrabold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="max-w-[180px] truncate py-2 pr-2 font-semibold text-[#0F2354]">
                        {row.email}
                      </td>
                      <td className="py-2 pr-2 text-slate-600">{row.name ?? "—"}</td>
                      <td className="whitespace-nowrap py-2 text-slate-400">
                        {date.format(new Date(row.createdAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Historial de envíos
          </p>
          {history.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">
              Todavía no se ha enviado ningún recordatorio.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.slice(0, 6).map((entry) => (
                <li
                  key={`${entry.at}-${entry.subject}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="text-[11px] font-bold text-[#0F2354]">{entry.subject}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(entry.at).toLocaleString("es-CO")} · {entry.sent} enviados ·{" "}
                    {entry.failed} fallidos
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
