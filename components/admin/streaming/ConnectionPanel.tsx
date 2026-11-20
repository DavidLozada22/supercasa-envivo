"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Link2,
  Loader2,
  Mail,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
  Youtube,
  Zap,
} from "lucide-react";
import type { Health } from "./types";

function ago(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  if (!Number.isFinite(diff)) return "sin datos";
  const seconds = Math.max(0, Math.round(diff / 1000));
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return new Date(iso).toLocaleDateString("es-CO");
}

function YoutubeError({ error }: { error: string | null }) {
  if (!error) return null;
  const label =
    error === "missing_key"
      ? "Falta la clave de YouTube en Vercel."
      : error === "quota"
        ? "La cuota diaria de YouTube se agotó."
        : error === "network"
          ? "No se pudo conectar con Google."
          : "Google respondió con un error.";
  return (
    <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
      <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </p>
  );
}

const RESEND_LABEL: Record<string, { text: string; tone: "ok" | "warn" | "bad" }> = {
  verified: { text: "Dominio verificado", tone: "ok" },
  pending: { text: "Verificando DNS", tone: "warn" },
  not_started: { text: "Faltan los registros DNS", tone: "warn" },
  failed: { text: "Falló la verificación", tone: "bad" },
  missing_key: { text: "Falta la clave de Resend", tone: "bad" },
  not_found: { text: "Dominio no agregado", tone: "bad" },
  error: { text: "No se pudo consultar Resend", tone: "bad" },
};

function Dot({ tone }: { tone: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "bg-emerald-500" : tone === "warn" ? "bg-amber-400" : "bg-red-500";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}

export default function ConnectionPanel({
  health,
  onRefresh,
}: {
  health: Health | null;
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [linkState, setLinkState] = useState("");

  if (!health) {
    return (
      <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm">
        <Loader2 className="mb-2 h-5 w-5 animate-spin" strokeWidth={2} />
        Consultando conexiones
      </div>
    );
  }

  const { youtube, resend, capabilities, simulation, override } = health;
  const resendInfo = RESEND_LABEL[resend.status] ?? RESEND_LABEL.error;
  const youtubeTone = !youtube.keyPresent
    ? "bad"
    : youtube.error
      ? "warn"
      : "ok";
  const liveLabel = youtube.live
    ? `${youtube.source === "manual" ? "Manual" : "En vivo"}: ${youtube.videoId}`
    : youtube.videoId
      ? `Último video conocido: ${youtube.videoId}`
      : "Sin directo detectado";

  const check = async () => {
    setBusy("check");
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/check", { method: "POST" });
      if (!response.ok) {
        setError("No se pudo comprobar YouTube.");
        return;
      }
      const body = (await response.json()) as { videoId?: string; live?: boolean };
      setMessage(
        body.live
          ? `YouTube responde: directo ${body.videoId}.`
          : "YouTube responde: no hay directo activo en este momento.",
      );
      onRefresh();
    } catch {
      setError("Error de conexión al comprobar YouTube.");
    } finally {
      setBusy("");
    }
  };

  const simulate = async () => {
    setBusy("simulate");
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: 60 }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "No se pudo iniciar el simulacro.");
        return;
      }
      setMessage("Simulacro activo por 60 segundos. Abre /envivo y mira cómo cambia el video.");
      onRefresh();
    } catch {
      setError("Error de conexión al simular.");
    } finally {
      setBusy("");
    }
  };

  const stopSimulation = async () => {
    setBusy("stop");
    setMessage("");
    setError("");
    try {
      await fetch("/api/admin/streaming/simulate", { method: "DELETE" });
      setMessage("Simulacro detenido.");
      onRefresh();
    } catch {
      setError("Error de conexión al detener el simulacro.");
    } finally {
      setBusy("");
    }
  };

  const useLink = async () => {
    setBusy("link");
    setLinkState("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/live-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: liveUrl }),
      });
      const body = (await response.json()) as { error?: string; override?: { videoId?: string } };
      if (!response.ok) {
        setLinkState(body.error ?? "No se pudo usar ese link.");
        return;
      }
      setLinkState(`Listo. El sitio usa el directo ${body.override?.videoId ?? ""}.`);
      setLiveUrl("");
      onRefresh();
    } catch {
      setLinkState("Error de conexión al guardar el link.");
    } finally {
      setBusy("");
    }
  };

  const useAuto = async () => {
    setBusy("auto");
    setLinkState("");
    setError("");
    try {
      const response = await fetch("/api/admin/streaming/live-override", { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setLinkState(body.error ?? "No se pudo volver a automático.");
        return;
      }
      setLinkState("Modo automático activo. Se vuelve a consultar la API.");
      onRefresh();
    } catch {
      setLinkState("Error de conexión al volver a automático.");
    } finally {
      setBusy("");
    }
  };

  const sendTest = async () => {
    setBusy("email");
    setEmailState("");
    setError("");
    try {
      const response = await fetch("/api/admin/resend/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setEmailState(body.error ?? "No se pudo enviar la prueba.");
        return;
      }
      setEmailState("Prueba enviada. Revisa la bandeja y el spam.");
    } catch {
      setEmailState("Error de conexión al enviar la prueba.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E6009E]/10 text-[#E6009E]">
              <Youtube className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F2354]">YouTube</h3>
              <p className="text-[11px] text-slate-500">Detección automática del directo</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            <Dot tone={youtubeTone} />
            {youtube.keyPresent ? "Llave cargada" : "Sin llave"}
          </span>
        </header>

        <dl className="grid gap-2 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Canal</dt>
            <dd className="flex items-center gap-1 font-semibold text-[#0F2354]">
              Kavanah PL35
              <a
                href={youtube.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6009E]"
                aria-label="Abrir el canal de YouTube"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Estado</dt>
            <dd className="font-semibold text-[#0F2354]">{liveLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Última comprobación</dt>
            <dd className="font-semibold text-[#0F2354]">{ago(youtube.checkedAt)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Último cambio de ID</dt>
            <dd className="font-semibold text-[#0F2354]">
              {youtube.changedAt ? ago(youtube.changedAt) : "todavía no"}
            </dd>
          </div>
        </dl>

        <YoutubeError error={youtube.error} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={check}
            disabled={Boolean(busy)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F2354] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#183478] disabled:opacity-60"
          >
            {busy === "check" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            Comprobar ahora
          </button>
          {simulation ? (
            <button
              type="button"
              onClick={stopSimulation}
              disabled={Boolean(busy)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              <Square className="h-3.5 w-3.5" strokeWidth={2} />
              Detener simulacro
            </button>
          ) : (
            <button
              type="button"
              onClick={simulate}
              disabled={Boolean(busy)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5 disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
              Simular corte
            </button>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Link manual
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Si Google falla, pega el link del directo. Se usa de inmediato y el sitio deja de
            consultar la API hasta que vuelvas a automático.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              aria-label="Link del directo de YouTube"
              className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2354] outline-none transition focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
            />
            <button
              type="button"
              onClick={useLink}
              disabled={Boolean(busy) || !liveUrl.trim()}
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-[#E6009E] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#B8007E] disabled:opacity-50"
            >
              {busy === "link" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Usar link
            </button>
          </div>
          {override ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-semibold text-white">
              <span>
                Modo manual: {override.videoId}
                {override.updatedBy ? ` · ${override.updatedBy}` : ""}
              </span>
              <button
                type="button"
                onClick={useAuto}
                disabled={Boolean(busy)}
                className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
              >
                {busy === "auto" ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                ) : (
                  <RotateCcw className="h-3 w-3" strokeWidth={2} />
                )}
                Volver a automático
              </button>
            </div>
          ) : null}
          {linkState ? (
            <p className="mt-2 text-[11px] font-semibold text-slate-600">{linkState}</p>
          ) : null}
        </div>

        {simulation ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
            Simulacro activo hasta las{" "}
            {new Date(simulation.until).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            . Solo lo ves tú con la sesión abierta.
          </p>
        ) : null}

        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        {youtube.history.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Historial de cambios
            </p>
            <ul className="space-y-1.5">
              {youtube.history.slice(0, 6).map((entry) => (
                <li key={`${entry.at}-${entry.to}`} className="flex items-center gap-2 text-[11px]">
                  <Dot tone="ok" />
                  <span className="font-semibold text-[#0F2354]">{entry.to}</span>
                  <span className="text-slate-500">{ago(entry.at)}</span>
                  {entry.from ? (
                    <span className="text-slate-400">desde {entry.from}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">
            Aún no hay cambios registrados. El historial se llena cuando el sitio detecta un
            directo nuevo.
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#B5F43D]/20 text-[#4d7a00]">
              <Mail className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F2354]">Resend</h3>
              <p className="text-[11px] text-slate-500">Recordatorios y avisos por correo</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            <Dot tone={resendInfo.tone} />
            {resendInfo.text}
          </span>
        </header>

        <dl className="grid gap-2 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Remitente</dt>
            <dd className="font-semibold text-[#0F2354]">{resend.from}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Dominio</dt>
            <dd className="font-semibold text-[#0F2354]">{resend.domain}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Revisado</dt>
            <dd className="font-semibold text-[#0F2354]">{ago(resend.checkedAt)}</dd>
          </div>
        </dl>

        {resend.status === "not_started" || resend.status === "pending" ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">
            Los registros DNS están en BanaHosting. Cuando queden publicados, la verificación
            pasa sola en unos minutos.
          </p>
        ) : null}

        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Correo de prueba
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
            />
            <button
              type="button"
              onClick={sendTest}
              disabled={Boolean(busy) || !email}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2354] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#183478] disabled:opacity-60"
            >
              {busy === "email" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Zap className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Enviar prueba
            </button>
          </div>
          {emailState ? (
            <p className="mt-2 text-[11px] font-semibold text-slate-600">{emailState}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <Dot tone={capabilities.blob ? "ok" : "bad"} />
            Almacenamiento del panel
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <Dot tone={capabilities.database ? "ok" : "bad"} />
            Base de datos
          </div>
        </div>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
          La clave vive solo en Vercel. El panel no la muestra ni la guarda.
        </p>
      </section>
    </div>
  );
}
