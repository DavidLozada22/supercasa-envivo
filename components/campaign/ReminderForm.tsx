"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";

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
        body: JSON.stringify({ email, name, consent, ref }),
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
      <div className="mx-auto max-w-3xl rounded-3xl border-2 border-[#1d2b4f] bg-white p-6 text-center shadow-[0_6px_0_#1d2b4f]">
        <Check className="mx-auto h-8 w-8 text-emerald-600" strokeWidth={2} />
        <p className="mt-2 text-lg font-extrabold text-[#1d2b4f]">Quedaste en la lista</p>
        <p className="mt-1 text-sm text-slate-600">
          Te escribiremos antes de que empiece la transmisión, con el enlace y las formas de donar.
        </p>
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
          <h3 className="text-lg font-extrabold text-[#1d2b4f]">Avísame cuando empiece</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Te enviamos un correo con el enlace del live y cómo donar. Sin spam.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@correo.com"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#e53935] focus:ring-2 focus:ring-[#e53935]/15"
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tu nombre (opcional)"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#e53935] focus:ring-2 focus:ring-[#e53935]/15"
        />
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        Autorizo a la Fundación Segundos de Vida a enviarme correos sobre esta campaña.
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#c62828] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#a51f1f] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
        {loading ? "Guardando" : "Avísame"}
      </button>
    </form>
  );
}
