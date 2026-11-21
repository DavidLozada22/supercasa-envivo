"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  HelpCircle,
  Link2,
  Search,
  Send,
} from "lucide-react";
import {
  ANSWER_CATEGORIES,
  QUICK_ANSWERS,
  SHARE_CATEGORIES,
  SHARE_MESSAGES,
  type AnswerCategory,
  type ShareCategory,
} from "@/lib/answers/presets";

const ANSWER_BADGES: Record<AnswerCategory, string> = {
  empezar: "bg-[#E6009E] text-white",
  causa: "bg-[#B5F43D] text-[#0B1A3D]",
  donar: "bg-[#FFD400] text-[#0B1A3D]",
  evento: "bg-[#00A8E8] text-white",
  otros: "bg-slate-100 text-slate-600",
};

const SHARE_BADGES: Record<ShareCategory, string> = {
  invitacion: "bg-[#E6009E] text-white",
  promocion: "bg-[#FF6B35] text-white",
  envivo: "bg-[#B5F43D] text-[#0B1A3D]",
  donacion: "bg-[#FFD400] text-[#0B1A3D]",
  cierre: "bg-[#00A8E8] text-white",
  empresas: "bg-slate-100 text-slate-600",
  agradecimiento: "bg-emerald-100 text-emerald-700",
};

const ANSWER_LABELS: Record<AnswerCategory, string> = {
  empezar: "Empezar",
  causa: "La causa",
  donar: "Donaciones",
  evento: "El evento",
  otros: "Otros",
};

const SHARE_LABELS: Record<ShareCategory, string> = {
  invitacion: "Invitación",
  promocion: "Promoción",
  envivo: "En vivo",
  donacion: "Donación",
  cierre: "Cierre",
  empresas: "Empresas",
  agradecimiento: "Agradecimiento",
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function whatsappShare(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export default function AnswerBoard() {
  const [tab, setTab] = useState<"answers" | "messages">("answers");
  const [query, setQuery] = useState("");
  const [answerCategory, setAnswerCategory] = useState<"all" | AnswerCategory>("all");
  const [shareCategory, setShareCategory] = useState<"all" | ShareCategory>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const answers = useMemo(() => {
    const term = normalize(query.trim());
    return QUICK_ANSWERS.filter((item) => {
      if (answerCategory !== "all" && item.category !== answerCategory) return false;
      if (!term) return true;
      return normalize(`${item.question} ${item.answer} ${item.links?.map((link) => link.label).join(" ") ?? ""}`).includes(term);
    });
  }, [answerCategory, query]);

  const messages = useMemo(() => {
    const term = normalize(query.trim());
    return SHARE_MESSAGES.filter((item) => {
      if (shareCategory !== "all" && item.category !== shareCategory) return false;
      if (!term) return true;
      return normalize(`${item.title} ${item.when} ${item.message}`).includes(term);
    });
  }, [shareCategory, query]);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
      return;
    } catch {
      // Si el navegador bloquea el portapapeles, se intenta el método clásico.
    }
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
    document.body.removeChild(field);
  };

  const copyPanel = () => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/respuestas` : "/respuestas";
    void copy("panel", url);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F2354]">
      <header className="mx-auto w-full max-w-4xl px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#E6009E]">
              La Supercasa · Equipo
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Respuestas rápidas
            </h1>
            <p className="mt-1 max-w-2xl text-xs font-semibold leading-relaxed text-slate-500">
              Copia la respuesta y pégala en WhatsApp. Los mensajes también se pueden compartir
              en grupos. Este panel no se indexa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyPanel}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-extrabold text-[#0F2354] transition hover:border-[#E6009E]/40"
            >
              {copied === "panel" ? (
                <Check className="h-4 w-4 text-emerald-600" strokeWidth={2} />
              ) : (
                <Link2 className="h-4 w-4" strokeWidth={2} />
              )}
              {copied === "panel" ? "Link copiado" : "Copiar link"}
            </button>
            <a
              href="/programa"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0F2354] px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-[#183478]"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
              Programa
            </a>
          </div>
        </div>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pregunta, mensaje o tema"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-[#0F2354] outline-none transition placeholder:text-slate-400 focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-[#F5F7FB]/95 px-4 py-2 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setTab("answers")}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition ${
                  tab === "answers"
                    ? "bg-[#0F2354] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" strokeWidth={2} />
                Respuestas ({QUICK_ANSWERS.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("messages")}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition ${
                  tab === "messages"
                    ? "bg-[#0F2354] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
                Mensajes ({SHARE_MESSAGES.length})
              </button>
            </div>
            <span className="ml-auto text-[10px] font-bold text-slate-400">
              {tab === "answers" ? `${answers.length} respuestas` : `${messages.length} mensajes`}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(tab === "answers" ? ANSWER_CATEGORIES : SHARE_CATEGORIES).map((item) => {
            const active =
              tab === "answers" ? answerCategory === item.id : shareCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (tab === "answers") setAnswerCategory(item.id as "all" | AnswerCategory);
                  else setShareCategory(item.id as "all" | ShareCategory);
                }}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition ${
                  active
                    ? "bg-[#0F2354] text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-[#0F2354]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "answers" ? (
          <div className="mt-4 space-y-3">
            {answers.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${ANSWER_BADGES[item.category]}`}
                    >
                      {ANSWER_LABELS[item.category]}
                    </span>
                    <h2 className="mt-2 text-base font-extrabold leading-snug text-[#0F2354]">
                      {item.question}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copy(item.id, item.answer)}
                    className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition ${
                      copied === item.id
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-[#E6009E] text-white hover:bg-[#B8007E]"
                    }`}
                  >
                    {copied === item.id ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {copied === item.id ? "Copiada" : "Copiar respuesta"}
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
                  {item.answer}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <a
                    href={whatsappShare(item.answer)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
                  >
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                    Abrir WhatsApp
                  </a>
                  {item.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#0F2354] transition hover:border-[#E6009E]/40"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {messages.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${SHARE_BADGES[item.category]}`}
                    >
                      {SHARE_LABELS[item.category]}
                    </span>
                    <h2 className="mt-2 text-base font-extrabold leading-snug text-[#0F2354]">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{item.when}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copy(item.id, item.message)}
                    className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition ${
                      copied === item.id
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-[#E6009E] text-white hover:bg-[#B8007E]"
                    }`}
                  >
                    {copied === item.id ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {copied === item.id ? "Copiado" : "Copiar mensaje"}
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
                  {item.message}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <a
                    href={whatsappShare(item.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0F2354] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#183478]"
                  >
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                    Compartir en WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "answers" && answers.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-400">
            No hay respuestas con esa búsqueda. Prueba otra palabra.
          </p>
        ) : null}
        {tab === "messages" && messages.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-400">
            No hay mensajes con esa búsqueda. Prueba otra palabra.
          </p>
        ) : null}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-[11px] font-semibold text-slate-400">
            Panel interno del equipo. No se indexa en buscadores.
          </p>
          <p className="mt-3 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} La Supercasa. All Rights Reserved. | Built by{" "}
            <a
              href="https://svgvisual.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E6009E] transition hover:brightness-110"
            >
              SVG
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
