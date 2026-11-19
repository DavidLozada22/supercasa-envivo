"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

type VisitRow = { source: string; campaign: string; ref: string; visits: number };
type DonationRow = { source: string; campaign: string; ref: string; donations: number; raised: number };
type Report = { visits: VisitRow[]; donations: DonationRow[] };

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

export default function CampaignTools() {
  const [ref, setRef] = useState("meta");
  const [days, setDays] = useState("30");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const cleanRef = ref
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);
  const url = `https://supercasa.svgvisual.com/ref/${cleanRef || "meta"}`;

  const load = async (range: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/attribution?days=${range}`, { cache: "no-store" });
      setReport((await response.json()) as Report);
    } catch {
      setReport({ visits: [], donations: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin permiso de portapapeles.
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F2354]">Enlace de afiliado</h2>
        <p className="mt-1 text-sm text-slate-500">
          Úsalo en los anuncios de Meta, en la bio de Instagram y en los perfiles. Abre directo la
          transmisión y guarda el referido por 90 días.
        </p>

        <div className="mt-4 max-w-md">
          <label className="block text-sm font-semibold text-[#0F2354]">
            Código de afiliado
            <input
              className={`${input} mt-1`}
              value={ref}
              onChange={(event) => setRef(event.target.value)}
              placeholder="meta"
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            Solo letras, números, punto, guion y guion bajo.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
          <code className="min-w-0 flex-1 break-all text-xs text-slate-700">{url}</code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2354] hover:bg-slate-100"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2354] hover:bg-slate-100"
          >
            <ExternalLink className="h-4 w-4" /> Abrir
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F2354]">Resultados por referido</h2>
            <p className="text-sm text-slate-500">Visitas y aportes aprobados.</p>
          </div>
          <select
            value={days}
            onChange={(event) => {
              const value = event.target.value;
              setDays(value);
              void load(value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2354]"
          >
            <option value="7">7 días</option>
            <option value="30">30 días</option>
            <option value="90">90 días</option>
          </select>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Visitas</h3>
            {loading ? <p className="text-sm text-slate-500">Cargando…</p> : null}
            {!loading && !report?.visits.length ? (
              <p className="text-sm text-slate-500">Aún no hay visitas con referido.</p>
            ) : null}
            {report?.visits.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-slate-500">
                      <th className="py-1">Referido</th>
                      <th className="text-right">Visitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.visits.map((row) => (
                      <tr key={`${row.ref}-${row.source}-${row.campaign}`} className="border-t border-slate-100">
                        <td className="py-2 font-semibold">{row.ref || row.source}</td>
                        <td className="text-right">{row.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Aportes</h3>
            {!loading && !report?.donations.length ? (
              <p className="text-sm text-slate-500">Aún no hay aportes atribuidos.</p>
            ) : null}
            {report?.donations.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-slate-500">
                      <th className="py-1">Referido</th>
                      <th className="text-right">Aportes</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.donations.map((row) => (
                      <tr key={`${row.ref}-${row.source}-${row.campaign}`} className="border-t border-slate-100">
                        <td className="py-2 font-semibold">{row.ref || row.source}</td>
                        <td className="text-right">{row.donations}</td>
                        <td className="text-right">{cop.format(row.raised)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
