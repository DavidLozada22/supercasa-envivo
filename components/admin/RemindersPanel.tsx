"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Send } from "lucide-react";

type Reminder = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  sentAt: string | null;
  ref: string | null;
};

const date = new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short" });

export default function RemindersPanel() {
  const [rows, setRows] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reminders", { cache: "no-store" });
      const data = (await response.json()) as { reminders?: Reminder[] };
      setRows(data.reminders ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const send = async () => {
    setSending(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/reminders", { method: "POST" });
      const data = (await response.json()) as { sent?: number; failed?: number; error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo enviar.");
        return;
      }
      setMessage(`Enviados: ${data.sent ?? 0}. Fallidos: ${data.failed ?? 0}.`);
      if (data.failed && data.error) setError(data.error);
      await load();
    } catch {
      setError("Error de conexión al enviar.");
    } finally {
      setSending(false);
    }
  };

  const exportCsv = () => {
    const lines = rows.map((row) =>
      [row.email, row.name ?? "", date.format(new Date(row.createdAt)), row.sentAt ? "Enviado" : "Pendiente", row.ref ?? ""]
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

  const pending = rows.filter((row) => !row.sentAt).length;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F2354]">Recordatorios del live</h2>
            <p className="mt-1 text-sm text-slate-500">
              {rows.length} correos registrados · {pending} pendientes de enviar.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              El envío usa Resend. Requiere RESEND_API_KEY y un dominio verificado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0F2354] hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button
              type="button"
              onClick={send}
              disabled={sending || !pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E6009E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#B8007E] disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar a pendientes
            </button>
          </div>
        </div>

        {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="py-2">Correo</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Referido</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="py-2 font-semibold text-[#0F2354]">{row.email}</td>
                  <td className="text-slate-600">{row.name ?? "—"}</td>
                  <td className="text-xs text-slate-500">{date.format(new Date(row.createdAt))}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        row.sentAt ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {row.sentAt ? "Enviado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600">{row.ref ?? "—"}</td>
                </tr>
              ))}
              {!rows.length && !loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Todavía no hay recordatorios.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {loading ? <p className="mt-3 text-sm text-slate-500">Cargando…</p> : null}
      </section>
    </div>
  );
}
