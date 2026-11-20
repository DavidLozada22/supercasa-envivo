"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import {
  entryById,
  matchEntry,
  progressAnswer,
  QUICK_ENTRIES,
  type ChatAction,
  type ChatEntry,
} from "@/lib/chat/knowledge";
import { whatsappLink } from "@/lib/contact";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  actions?: ChatAction[];
};

const TEASER_KEY = "sc_help_teaser";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [remindOpen, setRemindOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [remindState, setRemindState] = useState<"idle" | "loading" | "done">("idle");
  const [remindError, setRemindError] = useState("");
  const counter = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const teaserTimer = useRef<number | null>(null);

  const push = useCallback((role: Message["role"], text: string, actions?: ChatAction[]) => {
    counter.current += 1;
    setMessages((current) => [...current, { id: counter.current, role, text, actions }]);
  }, []);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    teaserTimer.current = window.setTimeout(() => setTeaser(true), 12_000);
    return () => {
      if (teaserTimer.current) window.clearTimeout(teaserTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, remindOpen, remindState]);

  const greet = useCallback(() => {
    if (messages.length > 0) return;
    push(
      "bot",
      "Hola. Soy el asistente de La Supercasa. Te ayudo a donar, a entender la causa y a no perderte ningún bloque. ¿Qué necesitas?",
      [
        { type: "link", label: "Donar ahora", href: "/donar" },
        { type: "remind", label: "Recibir avisos" },
      ],
    );
  }, [messages.length, push]);

  const openChat = () => {
    if (teaserTimer.current) window.clearTimeout(teaserTimer.current);
    setOpen(true);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // Sin almacenamiento el aviso vuelve a aparecer en la proxima visita.
    }
    greet();
  };

  const dismissTeaser = () => {
    if (teaserTimer.current) window.clearTimeout(teaserTimer.current);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // Sin almacenamiento el aviso vuelve a aparecer en la proxima visita.
    }
  };

  const answerEntry = useCallback(
    async (entry: ChatEntry, showQuestion = true) => {
      if (showQuestion) push("user", entry.question);
      let text = typeof entry.answer === "function" ? entry.answer() : entry.answer;

      if (entry.id === "progreso") {
        try {
          const response = await fetch("/api/live", { cache: "no-store" });
          if (response.ok) {
            const data = (await response.json()) as { raised?: number; goal?: number };
            text = progressAnswer(Number(data.raised) || 0, Number(data.goal) || 0);
          }
        } catch {
          // Se conserva la respuesta base.
        }
      }

      push("bot", text, entry.actions);
    },
    [push],
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    push("user", value);
    const entry = matchEntry(value);
    if (entry) {
      void answerEntry(entry, false);
      return;
    }
    push(
      "bot",
      "No tengo esa respuesta en mi guion, pero una persona del equipo te puede ayudar. Escríbenos por WhatsApp y te respondemos.",
      [
        {
          type: "whatsapp",
          label: "Hablar por WhatsApp",
          message: `Hola, tengo una duda sobre La Supercasa: ${value}`,
        },
        { type: "entry", label: "Ver preguntas frecuentes", id: "que-es" },
      ],
    );
  };

  const openRemind = () => {
    setRemindOpen(true);
    setRemindState("idle");
    setRemindError("");
    push(
      "bot",
      "Déjame tu nombre y tu correo. Te aviso cuando empiece cada bloque, cuando falte poco para la meta y cuando esté por cerrar. También te recuerdo en qué bloque vamos.",
    );
  };

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setRemindError("");
    if (!consent) {
      setRemindError("Necesitamos tu autorización para escribirte.");
      return;
    }
    setRemindState("loading");
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, source: "chat" }),
      });
      const data = (await response.json()) as { error?: string; already?: boolean };
      if (!response.ok) {
        setRemindError(data.error ?? "No se pudo guardar tu correo.");
        setRemindState("idle");
        return;
      }
      setRemindState("done");
      setRemindOpen(false);
      push(
        "bot",
        data.already
          ? `Ya teníamos tu correo, ${name || "gracias"}. Te avisamos en cada bloque importante y cuando la meta se mueva.`
          : `Listo, ${name || "gracias"}. Quedaste en la lista. Te aviso cuando abra cada bloque y cuando falte poco para la meta.`,
        [
          { type: "link", label: "Ver la transmisión", href: "/envivo" },
          { type: "link", label: "Donar ahora", href: "/donar" },
        ],
      );
    } catch {
      setRemindError("Error de conexión. Intenta de nuevo.");
      setRemindState("idle");
    }
  };

  const renderActions = (actions?: ChatAction[]) => {
    if (!actions?.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {actions.map((action) => {
          if (action.type === "link") {
            const external = action.href.startsWith("http");
            return (
              <a
                key={action.label}
                href={action.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-[#0F2354] px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-[#183478]"
              >
                {action.label}
                {external ? (
                  <ExternalLink className="h-3 w-3" strokeWidth={2} />
                ) : null}
              </a>
            );
          }
          if (action.type === "remind") {
            return (
              <button
                key={action.label}
                type="button"
                onClick={openRemind}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-[#B5F43D] px-3 py-1.5 text-[11px] font-extrabold text-[#0F2354] transition hover:brightness-105"
              >
                <Bell className="h-3 w-3" strokeWidth={2} />
                {action.label}
              </button>
            );
          }
          if (action.type === "whatsapp") {
            return (
              <a
                key={action.label}
                href={whatsappLink(action.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:brightness-95"
              >
                <MessageCircle className="h-3 w-3" strokeWidth={2} />
                {action.label}
              </a>
            );
          }
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                const entry = entryById(action.id);
                if (entry) void answerEntry(entry);
              }}
              className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
            >
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {teaser && !open ? (
        <div className="relative max-w-[290px] rounded-2xl border border-slate-200 bg-white p-3.5 pr-8 shadow-[0_18px_44px_rgba(15,35,84,0.22)]">
          <button
            type="button"
            onClick={dismissTeaser}
            aria-label="Cerrar aviso de ayuda"
            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <p className="text-xs font-extrabold leading-snug text-[#0F2354]">
            ¿Dudas o el pago no te funciona?
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Te ayudamos a donar por Wompi, Bre-B o transferencia. Escríbenos aquí.
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#0F2354] px-3 py-1.5 text-[11px] font-extrabold text-white"
          >
            Abrir ayuda
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          id="help-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Ayuda de La Supercasa"
          tabIndex={-1}
          className="flex max-h-[82vh] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,35,84,0.32)] outline-none sm:w-[390px]"
        >
          <header className="bg-[#0F2354] px-4 py-3.5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B5F43D]">
                  Ayuda de La Supercasa
                </p>
                <h2 className="mt-0.5 text-sm font-extrabold">Te ayudamos a donar</h2>
                <p className="mt-0.5 text-[11px] text-white/60">
                  Respuestas rápidas, causa y avisos del live.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar ayuda"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] ${message.role === "user" ? "ml-auto" : ""}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#0F2354] text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
                {message.role === "bot" ? renderActions(message.actions) : null}
              </div>
            ))}

            {remindOpen ? (
              <form
                onSubmit={subscribe}
                className="rounded-2xl border border-[#B5F43D] bg-[#B5F43D]/10 p-3"
              >
                <p className="text-[11px] font-extrabold text-[#0F2354]">
                  Recibe los avisos del live
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-slate-600">
                  Te avisamos en qué bloque vamos y cuándo falta poco para la meta.
                </p>
                <label className="mt-2 block">
                  <span className="text-[10px] font-bold text-[#0F2354]">Tu nombre</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="¿Cómo te llamas?"
                    autoComplete="name"
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#E6009E]"
                  />
                </label>
                <label className="mt-2 block">
                  <span className="text-[10px] font-bold text-[#0F2354]">Tu correo</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    required
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#E6009E]"
                  />
                </label>
                <label className="mt-2 flex items-start gap-2 text-[10px] leading-relaxed text-slate-600">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-[#E6009E]"
                  />
                  Autorizo que me escriban con avisos de La Supercasa. Sin spam.
                </label>
                {remindError ? (
                  <p className="mt-1.5 flex items-start gap-1.5 text-[10px] font-semibold text-red-700">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
                    {remindError}
                  </p>
                ) : null}
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="submit"
                    disabled={remindState === "loading" || !consent}
                    className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-extrabold text-white disabled:opacity-50"
                  >
                    {remindState === "loading" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    Guardar mis avisos
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemindOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600"
                  >
                    Luego
                  </button>
                </div>
              </form>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-100 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {QUICK_ENTRIES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => void answerEntry(entry)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-white"
                >
                  {entry.question}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex gap-1.5">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu duda"
                aria-label="Escribe tu duda"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Enviar mensaje"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E6009E] text-white transition hover:bg-[#B8007E]"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
            <div className="mt-1.5 flex gap-1.5">
              <a
                href="/donar"
                className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-extrabold text-white"
              >
                <HeartHandshake className="h-3.5 w-3.5" strokeWidth={2} />
                Donar ahora
              </a>
              <button
                type="button"
                onClick={openRemind}
                className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#B5F43D] px-3 py-2 text-[11px] font-extrabold text-[#0F2354]"
              >
                <Bell className="h-3.5 w-3.5" strokeWidth={2} />
                Recibir avisos
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={openChat}
        aria-expanded={open}
        aria-controls="help-panel"
        aria-label="Abrir ayuda y formas de donar"
        className="inline-flex min-h-[54px] items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(37,211,102,0.36)] transition hover:brightness-95"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2} />
        Ayuda
      </button>
    </div>
  );
}
