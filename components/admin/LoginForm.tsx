"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, ShieldCheck, UserRound } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0F2354] px-4 py-12"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(230,0,158,0.35) 0%, transparent 38%), radial-gradient(circle at 85% 80%, rgba(181,244,61,0.22) 0%, transparent 40%)",
        }}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0F2354]/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#0F2354]">
            <ShieldCheck className="h-4 w-4 text-[#E6009E]" strokeWidth={2} />
            Acceso privado
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0F2354]">
            Panel de producción
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Administra la transmisión, el recaudo y la campaña de La Supercasa.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">Usuario</span>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                placeholder="nelson"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">Clave</span>
            <div className="relative">
              <KeyRound
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#E6009E] focus:bg-white focus:ring-2 focus:ring-[#E6009E]/15"
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E6009E] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#B8007E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : null}
            {loading ? "Verificando" : "Entrar al panel"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Fundación Segundos de Vida • Kavanah
        </p>
      </div>
    </div>
  );
}
