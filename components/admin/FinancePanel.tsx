"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react";

type Manual = {
  reference: string;
  amount: number;
  method: string;
  note: string;
  createdAt: string;
};

type Wompi = {
  reference: string;
  amount: number;
  donorName: string | null;
  createdAt: string;
};

type FinanceData = {
  totals: { total: number; wompi: number; breb: number; bancolombia: number };
  goal: number;
  manual: Manual[];
  wompi: Wompi[];
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

const EMPTY: FinanceData = {
  totals: { total: 0, wompi: 0, breb: 0, bancolombia: 0 },
  goal: 0,
  manual: [],
  wompi: [],
};

function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(
    new Date(),
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Wallet;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg sm:h-8 sm:w-8 ${tone}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 sm:text-[10px]">
          {label}
        </p>
      </div>
      <p className="mt-2 text-lg font-extrabold tracking-tight text-[#0F2354] sm:text-xl">
        {cop.format(value)}
      </p>
    </div>
  );
}

export default function FinancePanel() {
  const [data, setData] = useState<FinanceData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    method: "breb",
    amount: "",
    note: "",
    date: today(),
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState({ method: "breb", amount: "", note: "" });

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/finance", { cache: "no-store" });
      if (!response.ok) {
        setError("No se pudo cargar el recaudo.");
        return;
      }
      setData((await response.json()) as FinanceData);
    } catch {
      setError("Error de conexión al cargar el recaudo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo agregar el aporte.");
        return;
      }
      setMessage("Aporte agregado. El total y la barra de la casa ya lo incluyen.");
      setForm({ method: "breb", amount: "", note: "", date: today() });
      await load();
    } catch {
      setError("Error de conexión al agregar el aporte.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item: Manual) => {
    setEditing(item.reference);
    setEdit({
      method: /bre/i.test(item.method) ? "breb" : "bancolombia",
      amount: String(item.amount),
      note: item.note,
    });
    setMessage("");
    setError("");
  };

  const saveEdit = async (reference: string) => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/finance/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo guardar el cambio.");
        return;
      }
      setEditing(null);
      setMessage("Aporte actualizado.");
      await load();
    } catch {
      setError("Error de conexión al guardar el cambio.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (reference: string) => {
    if (!window.confirm("¿Borrar este aporte? El total va a bajar.")) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/finance/${reference}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo borrar el aporte.");
        return;
      }
      setMessage("Aporte borrado.");
      await load();
    } catch {
      setError("Error de conexión al borrar el aporte.");
    } finally {
      setBusy(false);
    }
  };

  const pct =
    data.goal > 0 ? Math.min(100, (data.totals.total / data.goal) * 100) : 0;

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-[#E6009E]" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6009E]">
              Recaudo del evento
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F2354]">
              {cop.format(data.totals.total)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Wompi, Bre-B y Bancolombia sumados en un solo total. Meta:{" "}
              {cop.format(data.goal)}.
            </p>
          </div>
          <span className="rounded-full bg-[#B5F43D]/25 px-3 py-1.5 text-xs font-extrabold text-[#4d7a00]">
            {pct.toFixed(1)}% de la meta
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD400] to-[#B5F43D]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Total"
          value={data.totals.total}
          icon={Wallet}
          tone="bg-[#0F2354] text-white"
        />
        <SummaryCard
          label="Wompi"
          value={data.totals.wompi}
          icon={CreditCard}
          tone="bg-[#E6009E]/10 text-[#B8007E]"
        />
        <SummaryCard
          label="Bre-B"
          value={data.totals.breb}
          icon={Smartphone}
          tone="bg-[#B5F43D]/25 text-[#4d7a00]"
        />
        <SummaryCard
          label="Bancolombia"
          value={data.totals.bancolombia}
          icon={Landmark}
          tone="bg-[#00A8E8]/12 text-[#0077a8]"
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E6009E]/10 text-[#B8007E]">
              <Plus className="h-4 w-4" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F2354]">
                Registrar aporte manual
              </h3>
              <p className="text-[11px] text-slate-500">
                Para lo que entra por Bre-B o Bancolombia.
              </p>
            </div>
          </div>

          <form onSubmit={add} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">
                  Medio
                </span>
                <select
                  value={form.method}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, method: event.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="breb">Bre-B</option>
                  <option value="bancolombia">Bancolombia</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">
                  Monto
                </span>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  inputMode="numeric"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, amount: event.target.value }))
                  }
                  placeholder="50000"
                  className={inputClass}
                  required
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">
                  Fecha
                </span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-[#0F2354]">
                  Nota
                </span>
                <input
                  value={form.note}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, note: event.target.value }))
                  }
                  placeholder="Nombre o referencia"
                  className={inputClass}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#0F2354] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#183478] disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2} />
              )}
              Agregar aporte
            </button>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Se suma solo al total del sitio y a la barra de la casa. Puedes editarlo o
              borrarlo si te equivocaste.
            </p>
          </form>

          {message ? (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" strokeWidth={2} />
              {error}
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-[#0F2354]">
                Aportes manuales
              </h3>
              <p className="text-[11px] text-slate-500">
                Bre-B y Bancolombia. Puedes editar o borrar.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
              {data.manual.length}
            </span>
          </div>

          {data.manual.length === 0 ? (
            <p className="mt-4 rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500">
              Todavía no hay aportes manuales. Agrega el primero a la izquierda.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.manual.map((item) => (
                <li
                  key={item.reference}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  {editing === item.reference ? (
                    <div className="space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <select
                          value={edit.method}
                          onChange={(event) =>
                            setEdit((current) => ({ ...current, method: event.target.value }))
                          }
                          className={inputClass}
                        >
                          <option value="breb">Bre-B</option>
                          <option value="bancolombia">Bancolombia</option>
                        </select>
                        <input
                          type="number"
                          min={1000}
                          step={1000}
                          value={edit.amount}
                          onChange={(event) =>
                            setEdit((current) => ({ ...current, amount: event.target.value }))
                          }
                          className={inputClass}
                        />
                      </div>
                      <input
                        value={edit.note}
                        onChange={(event) =>
                          setEdit((current) => ({ ...current, note: event.target.value }))
                        }
                        placeholder="Nota"
                        className={inputClass}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void saveEdit(item.reference)}
                          disabled={busy}
                          className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-extrabold text-white disabled:opacity-60"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider ${
                          /bre/i.test(item.method)
                            ? "bg-[#B5F43D]/30 text-[#4d7a00]"
                            : "bg-[#00A8E8]/12 text-[#0077a8]"
                        }`}
                      >
                        {item.method}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-500">
                        {item.note || "Sin nota"} · {dateFmt.format(new Date(item.createdAt))}
                      </p>
                      <strong className="text-sm text-[#0F2354]">
                        {cop.format(item.amount)}
                      </strong>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        aria-label="Editar aporte"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-[#0F2354]"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(item.reference)}
                        aria-label="Borrar aporte"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E6009E]/10 text-[#B8007E]">
            <CreditCard className="h-4 w-4" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F2354]">Wompi</h3>
            <p className="text-[11px] text-slate-500">
              Se actualiza solo con cada pago aprobado. No se edita desde aquí.
            </p>
          </div>
        </div>

        {data.wompi.length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500">
            Todavía no hay pagos de Wompi aprobados.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {data.wompi.map((item) => (
              <li key={item.reference} className="flex items-center gap-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E6009E]/10 text-[10px] font-extrabold uppercase text-[#B8007E]">
                  W
                </span>
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-600">
                  {item.donorName || "Donante"} ·{" "}
                  <span className="font-normal text-slate-400">
                    {dateFmt.format(new Date(item.createdAt))}
                  </span>
                </p>
                <strong className="text-sm text-[#0F2354]">
                  {cop.format(item.amount)}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
