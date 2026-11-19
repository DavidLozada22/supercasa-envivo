"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {

  Check,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Loader2,
  LogOut,
  Megaphone,
  QrCode,
  Radio,
  Save,
  Target,
  TriangleAlert,
  Wallet,
  Youtube,
} from "lucide-react";
import CampaignTools from "@/components/admin/CampaignTools";
import type { AppConfig } from "@/lib/types";
import { youtubeEmbedUrl, youtubeVideoId } from "@/lib/youtube";

const TABS = [
  { id: "stream", label: "Transmisión", icon: Radio },
  { id: "totals", label: "Recaudo", icon: Wallet },
  { id: "calendar", label: "Calendario", icon: Megaphone },
  { id: "campaigns", label: "Campañas", icon: Target },
] as const;

type TabId = (typeof TABS)[number]["id"];

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("es-CO");

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15";

const cardClass = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">{hint}</span> : null}
    </label>
  );
}

function CopyButton({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2354] transition hover:border-[#0F2354]/30 hover:bg-slate-50"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-600" strokeWidth={2} />
      ) : (
        <Copy className="h-4 w-4" strokeWidth={1.75} />
      )}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function AdminDashboard({
  initialConfig,
  user,
}: {
  initialConfig: AppConfig;
  user: string;
}) {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [tab, setTab] = useState<TabId>("stream");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [showKey, setShowKey] = useState(false);

  const copy = async (id: string, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setMessage("No se pudo copiar. Selecciona el texto y cópialo a mano.");
      setStatus("error");
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as AppConfig & { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "No se pudo guardar.");
        return;
      }

      setConfig(data);
      setStatus("saved");
      setMessage("Cambios publicados.");
      window.setTimeout(() => setStatus("idle"), 2600);
    } catch {
      setStatus("error");
      setMessage("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };


  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const pct = config.totals.goal > 0 ? (config.totals.raised / config.totals.goal) * 100 : 0;

  return (
    <div
      className="flex min-h-screen bg-[#F4F6FB] text-slate-800"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col justify-between bg-[#0F2354] p-6 text-white lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B5F43D]">
            Supercasa en vivo
          </p>
          <h2 className="mt-2 text-lg font-extrabold leading-tight">Panel de producción</h2>
          <p className="mt-1 text-xs text-white/50">Fundación Segundos de Vida</p>

          <nav className="mt-8 space-y-1">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${active ? "text-[#B5F43D]" : ""}`}
                    strokeWidth={1.75}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6009E] text-xs font-extrabold uppercase text-white">
              {user.slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user}</p>
              <p className="text-[11px] text-white/45">Sesión activa</p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Ver sitio
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E6009E]">
              Panel de producción
            </p>
            <h1 className="text-lg font-extrabold tracking-tight text-[#0F2354]">
              {TABS.find((item) => item.id === tab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {status === "saved" ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" strokeWidth={2} />
                {message}
              </span>
            ) : null}
            {status === "error" ? (
              <span className="inline-flex max-w-[280px] items-center gap-1.5 text-sm font-semibold text-red-700">
                <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={2} />
                {message}
              </span>
            ) : null}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#B8007E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Save className="h-4 w-4" strokeWidth={2} />
              )}
              {saving ? "Guardando" : "Guardar cambios"}
            </button>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-[#0F2354] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </div>

        <main className="mx-auto w-full max-w-5xl space-y-5 p-5 md:p-8">
          <div className="flex flex-wrap gap-2">
            <a href="/admin/recorrido" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0F2354] transition hover:bg-slate-100">
              Ver mapa y demostración del recorrido
            </a>
            <a href="/admin/cortina" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0F2354] transition hover:bg-slate-100">
              Ver cortinas del live
            </a>
          </div>
          {tab === "stream" ? (
            <>
              <section className={cardClass}>
                <div className="mb-5 flex items-start gap-3">
                  <span className="rounded-xl bg-[#E6009E]/10 p-2.5 text-[#E6009E]">
                    <Youtube className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0F2354]">Link directo de YouTube</h2>
                    <p className="text-sm text-slate-500">
                      Este es el enlace que ve la audiencia en la página.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field
                    label="URL del directo"
                    hint="Pega el enlace del video en vivo. El reproductor se actualiza solo."
                  >
                    <input
                      className={inputClass}
                      value={config.stream.youtubeUrl}
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((current) => ({
                          ...current,
                          stream: {
                            ...current.stream,
                            youtubeUrl: value,
                            videoId: youtubeVideoId(value),
                            embedUrl: youtubeEmbedUrl(value),
                          },
                        }));
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="ID del video"
                      hint="Once caracteres. Es lo que permite enmascarar el reproductor y controlar la reproducción."
                    >
                      <input
                        className={`${inputClass} font-mono text-xs`}
                        value={config.stream.videoId}
                        onChange={(event) =>
                          setConfig((current) => ({
                            ...current,
                            stream: { ...current.stream, videoId: event.target.value.trim() },
                          }))
                        }
                        placeholder="dQw4w9WgXcQ"
                      />
                    </Field>

                    <Field
                      label="URL embebida"
                      hint="Se calcula a partir del enlace del directo. Solo cámbiala si usas un canal fijo."
                    >
                      <input
                        className={inputClass}
                        value={config.stream.embedUrl}
                        onChange={(event) =>
                          setConfig((current) => ({
                            ...current,
                            stream: { ...current.stream, embedUrl: event.target.value },
                          }))
                        }
                      />
                    </Field>
                  </div>

                  <Field label="Enlace de respaldo" hint="Uso interno. No se muestra a la audiencia.">
                    <input
                      className={inputClass}
                      value={config.stream.backupUrl}
                      onChange={(event) =>
                        setConfig((current) => ({
                          ...current,
                          stream: { ...current.stream, backupUrl: event.target.value },
                        }))
                      }
                    />
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-start gap-3">
                  <span className="rounded-xl bg-[#0F2354]/10 p-2.5 text-[#0F2354]">
                    <KeyRound className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0F2354]">Conexión para OBS</h2>
                    <p className="text-sm text-slate-500">
                      Servidor y clave que entrega YouTube Studio en Transmitir.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field label="Servidor RTMP">
                    <div className="flex gap-2">
                      <input
                        className={`${inputClass} font-mono text-xs`}
                        value={config.stream.rtmpUrl}
                        onChange={(event) =>
                          setConfig((current) => ({
                            ...current,
                            stream: { ...current.stream, rtmpUrl: event.target.value },
                          }))
                        }
                        placeholder="rtmp://a.rtmp.youtube.com/live2"
                      />
                      <CopyButton
                        value={config.stream.rtmpUrl}
                        copied={copied === "rtmp"}
                        onCopy={() => copy("rtmp", config.stream.rtmpUrl)}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Clave de transmisión"
                    hint="Es privada. Nunca se muestra en el sitio público."
                  >
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? "text" : "password"}
                          className={`${inputClass} pr-11 font-mono text-xs`}
                          value={config.stream.streamKey}
                          onChange={(event) =>
                            setConfig((current) => ({
                              ...current,
                              stream: { ...current.stream, streamKey: event.target.value },
                            }))
                          }
                          placeholder="Clave del directo"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey((value) => !value)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0F2354]"
                          aria-label={showKey ? "Ocultar clave" : "Mostrar clave"}
                        >
                          {showKey ? (
                            <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                          ) : (
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                          )}
                        </button>
                      </div>
                      <CopyButton
                        value={config.stream.streamKey}
                        copied={copied === "key"}
                        onCopy={() => copy("key", config.stream.streamKey)}
                      />
                    </div>
                  </Field>
                </div>

                <div className="mt-5 rounded-xl border border-[#B5F43D]/40 bg-[#B5F43D]/10 px-4 py-3 text-sm leading-relaxed text-[#0F2354]">
                  En OBS usa <strong>Servicio: YouTube - RTMP</strong>, pega el servidor y la clave, y
                  guarda. Esos dos datos salen de YouTube Studio, en la pantalla de configuración de
                  la transmisión.
                  <br />
                  <strong>Duración:</strong> YouTube cierra cada transmisión a las 12 horas. Para
                  cubrir 48 horas, programa cuatro bloques y actualiza el ID del video en cada
                  reinicio.
                </div>
              </section>

              <section className={cardClass}>
                <div className="mb-5 flex items-start gap-3">
                  <span className="rounded-xl bg-[#00A8E8]/10 p-2.5 text-[#00A8E8]">
                    <QrCode className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0F2354]">QR de donaciones</h2>
                    <p className="text-sm text-slate-500">
                      Descárgalo y ponlo en OBS. Siempre lleva a la página de donaciones.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <img
                    src="/api/admin/qr"
                    alt="Código QR que lleva a la página de donaciones"
                    className="h-44 w-44 rounded-xl border border-slate-200 bg-white p-2"
                  />
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="/api/admin/qr?download=1"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#E6009E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#B8007E]"
                      >
                        Descargar PNG
                      </a>
                      <a
                        href="/api/admin/qr?format=svg&download=1"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0F2354] transition hover:bg-slate-50"
                      >
                        Descargar SVG
                      </a>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      1024 px, fondo blanco. Sirve como fuente en OBS. La imagen se genera con la
                      dirección de este sitio y apunta a <span className="font-mono">/donar</span>.
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {tab === "totals" ? (
            <section className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="rounded-xl bg-[#E6009E]/10 p-2.5 text-[#E6009E]">
                  <Wallet className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0F2354]">Recaudo en vivo</h2>
                  <p className="text-sm text-slate-500">
                    Las cifras se publican en la página y en el render de la casa.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Monto recaudado (COP)">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={config.totals.raised}
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        totals: { ...current.totals, raised: Number(event.target.value) || 0 },
                      }))
                    }
                  />
                </Field>

                <Field label="Meta total (COP)">
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={config.totals.goal}
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        totals: {
                          ...current.totals,
                          goal: Number(event.target.value) || current.totals.goal,
                        },
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[50_000, 100_000, 500_000, 1_000_000, 5_000_000, 10_000_000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        totals: { ...current.totals, raised: current.totals.raised + amount },
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:text-[#E6009E]"
                  >
                    +{num.format(amount)}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between text-sm font-semibold text-[#0F2354]">
                  <span>Avance</span>
                  <span>{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E6009E] to-[#FF6B2B] transition-all"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                  <span>Recaudado: {cop.format(config.totals.raised)}</span>
                  <span>Meta: {cop.format(config.totals.goal)}</span>
                  <span>Falta: {cop.format(Math.max(0, config.totals.goal - config.totals.raised))}</span>
                </div>
              </div>
            </section>
          ) : null}

          {tab === "calendar" ? (
            <section className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <span className="rounded-xl bg-[#FF6B2B]/10 p-2.5 text-[#FF6B2B]">
                  <Megaphone className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0F2354]">Calendario de la campaña</h2>
                  <p className="text-sm text-slate-500">
                    Fechas fijas, siempre en hora de Bogotá (GMT-5).
                  </p>
                </div>
              </div>

              <dl className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Maratón en vivo
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#0F2354]">
                    Viernes 20 de noviembre, 6:00 p. m., a domingo 22 de noviembre, 6:00 p. m.
                  </dd>
                  <dd className="text-xs text-slate-500">48 horas continuas</dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Cierre de donaciones
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#0F2354]">
                    Lunes 30 de noviembre de 2026, 11:59 p. m.
                  </dd>
                  <dd className="text-xs text-slate-500">Después de esa fecha no se reciben aportes en línea</dd>
                </div>
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Estos horarios no se editan desde el panel. El contador y los estados del live se
                calculan automáticamente con estas fechas.
              </p>
            </section>
          ) : null}

          {tab === "campaigns" ? <CampaignTools /> : null}
        </main>
      </div>
    </div>
  );
}
