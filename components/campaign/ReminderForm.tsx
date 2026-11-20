"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, HeartHandshake, Loader2 } from "lucide-react";

export default function ReminderForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!consent) {
      setError("Necesitamos tu autorización para escribirte.");
      return;
    }

    let ref = "";
    try {
      ref = JSON.parse(localStorage.getItem("sc_attribution") || "{}").ref ?? "";
    } catch {
      ref = "";
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, consent, ref, source: "envivo" }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "No se pudo guardar tu correo.");
        return;
      }
      setDone(true);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border-2 border-[#1d2b4f] bg-[#B5F43D]/20 p-6 text-center shadow-[0_6px_0_#1d2b4f]">
        <Check className="mx-auto h-8 w-8 text-emerald-700" strokeWidth={2} />
        <p className="mt-2 text-lg font-extrabold text-[#1d2b4f]">
          Listo{name ? `, ${name}` : ""}. Quedaste en la lista.
        </p>
        <p className="mx-auto mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
          Te avisamos cuando abra cada bloque, cuando falte poco para la meta y cuando esté por
          cerrar. También te recordamos en qué bloque vamos.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/envivo"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0F2354] px-5 py-2.5 text-sm font-extrabold text-white"
          >
            Ver la transmisión
          </Link>
          <Link
            href="/donar"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#E6009E] px-5 py-2.5 text-sm font-extrabold text-white"
          >
            <HeartHandshake className="h-4 w-4" strokeWidth={2} />
            Donar ahora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-3xl rounded-3xl border-2 border-[#1d2b4f] bg-white p-5 shadow-[0_6px_0_#1d2b4f] md:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-[#ffd400]/30 p-2.5 text-[#1d2b4f]">
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-extrabold text-[#1d2b4f]">
            No te pierdas ningún bloque
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Déjanos tu correo y te avisamos cuando empiece cada bloque, cuando falte poco para la
            meta y cuando esté por cerrar. Son pocos correos, sin spam.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-[#1d2b4f]">Tu nombre</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="¿Cómo te llamas?"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#e53935] focus:ring-2 focus:ring-[#e53935]/15"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold text-[#1d2b4f]">Tu correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#e53935] focus:ring-2 focus:ring-[#e53935]/15"
          />
        </label>
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#c62828]"
        />
        Autorizo a la Fundación Segundos de Vida a enviarme correos sobre esta campaña.
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#c62828] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#a51f1f] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
          {loading ? "Guardando" : "Quiero mis avisos"}
        </button>
        <p className="text-[11px] font-semibold text-slate-500">
          Puedes salir de la lista cuando quieras.
        </p>
      </div>
    </form>
  );
}
