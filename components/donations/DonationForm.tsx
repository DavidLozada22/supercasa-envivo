"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, LockKeyhole, TriangleAlert } from "lucide-react";
import { MIN_AMOUNT, PIECES } from "@/lib/donations/catalog";

type Checkout = {
  reference: string;
  amountInCents: number;
  currency: "COP";
  publicKey: string;
  integrity: string;
  simulated: boolean;
};

type WidgetResult = {
  transaction?: { id: string; status: string };
};

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open(cb: (result: WidgetResult) => void): void;
    };
  }
}

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

let widgetLoading: Promise<void> | null = null;

function loadWidget(): Promise<void> {
  if (window.WidgetCheckout) return Promise.resolve();
  widgetLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      widgetLoading = null;
      reject(new Error("wompi-widget"));
    };
    document.head.appendChild(script);
  });
  return widgetLoading;
}

export default function DonationForm({
  available,
  raised,
  goal,
}: {
  available: boolean;
  raised: number;
  goal: number;
}) {
  const router = useRouter();
  const [pieceId, setPieceId] = useState("ventana");
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const piece = PIECES.find((item) => item.id === pieceId) ?? PIECES[0];
  const amount = piece.amount > 0 ? piece.amount : Math.floor(Number(custom) || 0);
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  const pay = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!consent) {
      setError("Necesitamos tu autorización para registrar el aporte.");
      return;
    }
    if (amount < MIN_AMOUNT) {
      setError(`El aporte mínimo es ${cop.format(MIN_AMOUNT)}.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceId,
          custom: piece.amount > 0 ? undefined : amount,
          donor: { name, email, phone, consent },
        }),
      });

      const checkout = (await response.json()) as Checkout & { error?: string };
      if (!response.ok) {
        setError(checkout.error ?? "No se pudo iniciar el aporte.");
        setLoading(false);
        return;
      }

      if (checkout.simulated) {
        await fetch("/api/dev/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: checkout.reference, status: "APPROVED" }),
        });
        router.push(`/donar/gracias?ref=${checkout.reference}`);
        return;
      }

      await loadWidget();
      const widget = new window.WidgetCheckout!({
        currency: checkout.currency,
        amountInCents: checkout.amountInCents,
        reference: checkout.reference,
        publicKey: checkout.publicKey,
        signature: { integrity: checkout.integrity },
        redirectUrl: `${window.location.origin}/donar/gracias?ref=${checkout.reference}`,
        customerData: {
          email,
          fullName: name || "Héroe anónimo",
          ...(phone
            ? {
                phoneNumber: phone.replace(/\D/g, "").slice(-10),
                phoneNumberPrefix: "+57",
              }
            : {}),
        },
      });

      widget.open((result) => {
        const transaction = result?.transaction;
        if (transaction?.id) {
          router.push(`/donar/gracias?ref=${checkout.reference}&id=${transaction.id}`);
        } else {
          setError("Cerraste el pago antes de terminar. Puedes intentarlo de nuevo.");
          setLoading(false);
        }
      });
    } catch {
      setError("No se pudo abrir el pago. Revisa tu conexión e intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={pay}
      className="mx-auto w-full max-w-3xl rounded-3xl border border-[#0F2354]/10 bg-white p-6 shadow-[0_18px_40px_rgba(15,35,84,0.10)] md:p-8"
    >
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs font-bold text-[#0F2354]">
          <span>Recaudado hasta ahora</span>
          <span>{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E6009E] to-[#FF6B2B]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500">
          {cop.format(raised)} de {cop.format(goal)}
        </p>
      </div>

      {!available ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          Los pagos con tarjeta están en configuración. Mientras tanto, usa la llave Bre-B o la
          cuenta Bancolombia que están más abajo.
        </div>
      ) : null}

      <fieldset>
        <legend className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#E6009E]">
          1. Elige tu aporte
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PIECES.map((item) => {
            const selected = item.id === pieceId;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setPieceId(item.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  selected
                    ? "border-[#E6009E] bg-[#E6009E]/5"
                    : "border-slate-200 bg-white hover:border-[#0F2354]/30"
                }`}
              >
                <span className="block text-sm font-extrabold text-[#0F2354]">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                  {item.description}
                </span>
                <span className="mt-2 block text-base font-extrabold text-[#E6009E]">
                  {item.amount > 0 ? cop.format(item.amount) : "Tú eliges"}
                </span>
              </button>
            );
          })}
        </div>

        {piece.amount === 0 ? (
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">
              Monto en pesos
            </span>
            <input
              type="number"
              min={MIN_AMOUNT}
              step={1000}
              inputMode="numeric"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              placeholder="50000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
            />
          </label>
        ) : null}
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#E6009E]">
          2. Tus datos
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">Nombre</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Héroe anónimo"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2354]">
              WhatsApp (opcional)
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="300 000 0000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#E6009E] focus:ring-2 focus:ring-[#E6009E]/15"
            />
          </label>
        </div>

        <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-slate-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#E6009E] focus:ring-[#E6009E]"
          />
          Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012 y la
          política de datos de la Fundación Segundos de Vida.
        </label>
      </fieldset>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !available}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E6009E] px-6 py-4 text-base font-extrabold text-white transition hover:bg-[#B8007E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
        ) : (
          <CreditCard className="h-5 w-5" strokeWidth={2} />
        )}
        {!available
          ? "Pagos en línea próximamente"
          : loading
            ? "Abriendo el pago"
            : `Aportar ${amount > 0 ? cop.format(amount) : ""}`}
      </button>

      <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
        <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.75} />
        Pago procesado por Wompi. No vemos ni guardamos los datos de tu tarjeta.
      </p>
    </form>
  );
}
