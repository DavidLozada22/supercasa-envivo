"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  HandCoins,
  Loader2,
  Map,
  Radio,
  RefreshCw,
  Users,
  Wallet,
  Youtube,
} from "lucide-react";

type Metrics = {
  enabled: boolean;
  now: { envivo: number; donar: number; recorrido: number; home: number; total: number };
  today: {
    visitors: number;
    views: number;
    envivo: number;
    donar: number;
    recorrido: number;
    home: number;
    uniqueEnvivo: number;
    uniqueDonar: number;
    uniqueRecorrido: number;
  };
  series: Array<{
    hour: string;
    label: string;
    envivo: number;
    donar: number;
    recorrido: number;
    home: number;
    total: number;
  }>;
  donations: {
    todayCount: number;
    todayRaised: number;
    last: { amount: number; name: string; at: string } | null;
    onlineRaised: number;
    onlineCount: number;
    manualRaised: number;
    totalRaised: number;
    goal: number;
  };
  youtube: { studioUrl: string; channelUrl: string };
  updatedAt: string;
};

const cop = (value: number) =>
  "$" + Math.max(0, Math.round(value)).toLocaleString("es-CO");

function ago(seconds: number): string {
  if (seconds < 5) return "ahora";
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  return `hace ${minutes} min`;
}

const COLORS = {
  envivo: "#E6009E",
  donar: "#B5F43D",
  recorrido: "#00A8E8",
  home: "#CBD5E1",
};

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  live,
  progress,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof Radio;
  accent: string;
  live?: boolean;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-2 flex items-baseline gap-2 text-3xl font-extrabold leading-none text-[#0F2354]">
        {value}
        {live ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E6009E]" />
            en vivo
          </span>
        ) : null}
      </p>
      {typeof progress === "number" ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-[#E6009E] to-[#B5F43D]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      <p className="mt-2 text-[11px] font-semibold leading-snug text-slate-500">{hint}</p>
    </div>
  );
}

function PageStat({
  label,
  hint,
  views,
  unique,
  color,
  icon: Icon,
}: {
  label: string;
  hint: string;
  views: number;
  unique: number;
  color: string;
  icon: typeof Radio;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="text-lg font-extrabold leading-tight text-[#0F2354]">
          {views} <span className="text-xs font-bold text-slate-400">vistas</span>
        </p>
        <p className="text-[11px] font-semibold text-slate-500">
          {unique} únicos · {hint}
        </p>
      </div>
    </div>
  );
}

export default function LiveMetrics() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/analytics/live", { cache: "no-store" });
      if (!response.ok) {
        setError("No se pudieron cargar las métricas.");
        return;
      }
      setData((await response.json()) as Metrics);
      setError("");
    } catch {
      setError("Error de conexión al cargar las métricas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 12_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const max = useMemo(
    () => Math.max(1, ...(data?.series ?? []).map((point) => point.total)),
    [data],
  );

  if (!data) {
    return (
      <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm">
        <Loader2 className="mb-2 h-5 w-5 animate-spin" strokeWidth={2} />
        Cargando métricas
      </div>
    );
  }

  const seconds = Math.max(0, Math.round((now - Date.parse(data.updatedAt)) / 1000));
  const goalPct = data.donations.goal > 0 ? (data.donations.totalRaised / data.donations.goal) * 100 : 0;

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6009E]">
            Métricas en vivo
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-[#0F2354]">
            Audiencia, páginas y recaudo
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
            Personas en la página, únicos, visitas a donaciones y recorrido, y el recaudo del
            evento. Se actualiza solo cada 12 segundos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500">
            <RefreshCw
              className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
            {ago(seconds)}
          </span>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
          >
            Actualizar
          </button>
          <a
            href={data.youtube.studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#FF0000] px-3 text-[11px] font-extrabold text-white transition hover:brightness-110"
          >
            <Youtube className="h-3.5 w-3.5" strokeWidth={2} />
            YouTube Studio
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </a>
        </div>
      </section>

      {error ? (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
          {error}
        </p>
      ) : null}

      {!data.enabled ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
          Falta conectar la base de datos para guardar las métricas. Mientras tanto se muestran
          el recaudo y los totales manuales.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Viendo ahora /envivo"
          value={data.now.envivo}
          hint={`${data.now.donar} en donar · ${data.now.recorrido} en recorrido`}
          icon={Radio}
          accent={COLORS.envivo}
          live
        />
        <Stat
          label="Únicos hoy"
          value={data.today.visitors}
          hint={`${data.today.views} vistas en las páginas medidas`}
          icon={Users}
          accent="#0F2354"
        />
        <Stat
          label="Donaciones hoy"
          value={data.donations.todayCount}
          hint={`${cop(data.donations.todayRaised)} aprobados hoy`}
          icon={HandCoins}
          accent="#00A88B"
        />
        <Stat
          label="Recaudo total"
          value={cop(data.donations.totalRaised)}
          hint={`Meta ${cop(data.donations.goal)} · ${goalPct.toFixed(1)}%`}
          icon={Wallet}
          accent="#E6009E"
          progress={goalPct}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <PageStat
          label="/envivo"
          hint="transmisión"
          views={data.today.envivo}
          unique={data.today.uniqueEnvivo}
          color={COLORS.envivo}
          icon={Radio}
        />
        <PageStat
          label="/donar"
          hint="donaciones"
          views={data.today.donar}
          unique={data.today.uniqueDonar}
          color="#7BA800"
          icon={HandCoins}
        />
        <PageStat
          label="/recorrido"
          hint="recorrido"
          views={data.today.recorrido}
          unique={data.today.uniqueRecorrido}
          color={COLORS.recorrido}
          icon={Map}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Últimas 12 horas
              </p>
              <h3 className="mt-0.5 text-sm font-extrabold text-[#0F2354]">Vistas por hora</h3>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full" style={{ background: COLORS.envivo }} />
                En vivo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full" style={{ background: COLORS.donar }} />
                Donar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full" style={{ background: COLORS.recorrido }} />
                Recorrido
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-44 items-end gap-1.5">
            {data.series.map((point) => {
              const height = Math.max(2, Math.round((point.total / max) * 100));
              return (
                <div
                  key={point.hour}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  title={`${point.label}: ${point.total} vistas`}
                >
                  <div
                    className="flex w-full flex-col-reverse overflow-hidden rounded-md bg-slate-100"
                    style={{ height: `${height}%` }}
                  >
                    {point.home > 0 ? (
                      <span style={{ flexGrow: point.home, background: COLORS.home }} />
                    ) : null}
                    {point.recorrido > 0 ? (
                      <span style={{ flexGrow: point.recorrido, background: COLORS.recorrido }} />
                    ) : null}
                    {point.donar > 0 ? (
                      <span style={{ flexGrow: point.donar, background: COLORS.donar }} />
                    ) : null}
                    {point.envivo > 0 ? (
                      <span style={{ flexGrow: point.envivo, background: COLORS.envivo }} />
                    ) : null}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400">
                    {point.label.replace(":00", "h")}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] font-semibold text-slate-400">
            Cada barra son las visitas de esa hora. El total del día se reinicia a medianoche de
            Bogotá.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Recaudo
            </p>
            <p className="mt-1 text-2xl font-extrabold leading-none text-[#0F2354]">
              {cop(data.donations.totalRaised)}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Meta {cop(data.donations.goal)}
            </p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#E6009E] via-[#FF7AD3] to-[#B5F43D]"
              style={{ width: `${Math.min(100, Math.max(0, goalPct))}%` }}
            />
          </div>
          <dl className="grid gap-1.5 text-[11px]">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">En línea</dt>
              <dd className="font-extrabold text-[#0F2354]">
                {cop(data.donations.onlineRaised)} · {data.donations.onlineCount}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Registro manual</dt>
              <dd className="font-extrabold text-[#0F2354]">{cop(data.donations.manualRaised)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Hoy</dt>
              <dd className="font-extrabold text-[#0F2354]">
                {cop(data.donations.todayRaised)} · {data.donations.todayCount}
              </dd>
            </div>
          </dl>
          {data.donations.last ? (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Última donación
              </p>
              <p className="mt-1 text-xs font-extrabold text-[#0F2354]">
                {cop(data.donations.last.amount)} · {data.donations.last.name}
              </p>
              <p className="text-[10px] font-semibold text-slate-500">
                {new Date(data.donations.last.at).toLocaleString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Bogota",
                })}
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <section className="flex flex-wrap items-start gap-3 rounded-2xl border border-slate-200 bg-[#0F2354] p-4 text-white shadow-sm">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FF0000]">
          <Youtube className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">Sobre las vistas de YouTube</p>
          <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-white/70">
            El reproductor de esta página también cuenta como vista en YouTube Studio, en la
            categoría de tráfico externo. YouTube no separa cuántas vienen de aquí, así que estos
            números miden las visitas a nuestras páginas y la audiencia en vivo de este panel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={data.youtube.studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-white px-3 text-[11px] font-extrabold text-[#0F2354] transition hover:bg-white/90"
          >
            Abrir YouTube Studio
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </a>
          <a
            href="/admin/donaciones"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/20 px-3 text-[11px] font-extrabold text-white transition hover:bg-white/10"
          >
            Donaciones
          </a>
          <a
            href="/envivo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/20 px-3 text-[11px] font-extrabold text-white transition hover:bg-white/10"
          >
            Ver el vivo
          </a>
        </div>
      </section>
    </div>
  );
}
