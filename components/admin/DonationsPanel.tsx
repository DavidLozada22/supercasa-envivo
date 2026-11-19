"use client";

import { useEffect, useState } from "react";
import { Check, Download, Loader2, Plus } from "lucide-react";

type Donation = {
  reference: string;
  createdAt: string;
  status: string;
  source: string;
  amountCop: number;
  donorName: string | null;
  donorEmail: string | null;
  donorPhone: string | null;
  paymentMethod: string | null;
  notes: string | null;
  attribution: { ref?: string } | null;
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
});

const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

const STATUS_LABEL: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  declined: "Rechazado",
  voided: "Anulado",
  error: "Error",
};

export default function DonationsPanel() {
  const [rows, setRows] = useState<Donation[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    method: "transfer",
    notes: "",
    consent: false,
  });

  const load = async (status = filter) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/donations?status=${status}`, { cache: "no-store" });
      const data = (await response.json()) as { donations?: Donation[] };
      setRows(data.donations ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.consent) {
      setError("Confirma que la persona autorizó el registro de sus datos.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: form.name,
          donorEmail: form.email,
          donorPhone: form.phone,
          amount: Number(form.amount),
          method: form.method,
          notes: form.notes,
          consent: form.consent,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo registrar.");
        return;
      }
      setMessage("Aporte registrado y sumado al recaudo.");
      setForm({ name: "", email: "", phone: "", amount: "", method: "transfer", notes: "", consent: false });
      await load();
    } catch {
      setError("Error de conexión al registrar.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const headers = ["Referencia", "Fecha", "Donante", "Correo", "Teléfono", "Monto", "Estado", "Origen", "Método", "Referido", "Notas"];
    const lines = rows.map((row) =>
      [
        row.reference,
        date.format(new Date(row.createdAt)),
        row.donorName ?? "",
        row.donorEmail ?? "",
        row.donorPhone ?? "",
        row.amountCop,
        STATUS_LABEL[row.status] ?? row.status,
        row.source,
        row.paymentMethod ?? "",
        row.attribution?.ref ?? "",
        row.notes ?? "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([`\uFEFF${headers.join(",")}\n${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donaciones-supercasa.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F2354]">Registrar aporte manual</h2>
        <p className="mt-1 text-sm text-slate-500">
          Para transferencias, efectivo o aportes que llegan por fuera de Wompi. Se registran como
          aprobados y suman al recaudo.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className={input}
            placeholder="Nombre del donante"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            className={input}
            type="email"
            placeholder="Correo (opcional)"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className={input}
            placeholder="WhatsApp (opcional)"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <input
            className={input}
            type="number"
            min={1000}
            placeholder="Monto en COP"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
          <select
            className={input}
            value={form.method}
            onChange={(event) => setForm({ ...form, method: event.target.value })}
          >
            <option value="transfer">Transferencia Bancolombia</option>
            <option value="cash">Efectivo</option>
            <option value="other">Otro medio</option>
          </select>
          <input
            className={input}
            placeholder="Nota interna (opcional)"
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />

          <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 md:col-span-2">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => setForm({ ...form, consent: event.target.checked })}
              className="mt-0.5 h-4 w-4"
            />
            Confirmo que la persona autorizó el registro de sus datos para el certificado y la
            trazabilidad del aporte.
          </label>

          {error ? <p className="text-sm font-semibold text-red-700 md:col-span-2">{error}</p> : null}
          {message ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 md:col-span-2">
              <Check className="h-4 w-4" /> {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6009E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#B8007E] disabled:opacity-60 md:col-span-2 md:w-fit"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {saving ? "Registrando" : "Registrar aporte"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F2354]">Donaciones</h2>
            <p className="text-sm text-slate-500">
              Los pagos de Wompi aparecen solos cuando el webhook confirma. Los manuales, aquí.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0F2354]"
            >
              <option value="all">Todas</option>
              <option value="approved">Aprobadas</option>
              <option value="pending">Pendientes</option>
              <option value="declined">Rechazadas</option>
            </select>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0F2354] hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="py-2">Fecha</th>
                <th>Donante</th>
                <th>Contacto</th>
                <th className="text-right">Monto</th>
                <th>Estado</th>
                <th>Origen</th>
                <th>Referido</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.reference} className="border-t border-slate-100 align-top">
                  <td className="py-3 text-xs text-slate-500">{date.format(new Date(row.createdAt))}</td>
                  <td className="py-3 font-semibold text-[#0F2354]">{row.donorName ?? "Anónimo"}</td>
                  <td className="py-3 text-xs text-slate-600">
                    {row.donorEmail ?? ""}
                    {row.donorEmail && row.donorPhone ? <br /> : null}
                    {row.donorPhone ?? ""}
                  </td>
                  <td className="py-3 text-right font-semibold">{cop.format(row.amountCop)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        row.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : row.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {STATUS_LABEL[row.status] ?? row.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs capitalize text-slate-600">
                    {row.paymentMethod ?? row.source}
                  </td>
                  <td className="py-3 text-xs text-slate-600">{row.attribution?.ref ?? "—"}</td>
                </tr>
              ))}
              {!rows.length && !loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                    Todavía no hay donaciones registradas.
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
