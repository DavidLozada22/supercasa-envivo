"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2, LockKeyhole, TriangleAlert } from "lucide-react";
import { MIN_AMOUNT, PIECES } from "@/lib/donations/catalog";
import { feeFor } from "@/lib/donations/pricing";

type Checkout = {
  reference: string;
  amountCop: number;
  fee: number;
  total: number;
  amountInCents: number;
  currency: "COP";
  publicKey: string;
  integrity: string;
  simulated: boolean;
};

type WidgetResult = { transaction?: { id: string; status: string } };

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

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const STEPS = ["Tu pieza", "Tus datos", "Confirma"];

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

export default function DonationFlow({
  available,
  raised,
  goal,
}: {
  available: boolean;
  raised: number;
  goal: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
  const { fee, total } = feeFor(Math.max(0, amount));
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  const next = () => {
    setError("");
    if (step === 1) {
      if (amount < MIN_AMOUNT) {
        setError(`El aporte mínimo es ${cop.format(MIN_AMOUNT)}.`);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!EMAIL.test(email)) {
        setError("Revisa tu correo, parece que le falta algo.");
        return;
      }
      if (!consent) {
        setError("Necesitamos tu autorización para registrar el aporte.");
        return;
      }
      setStep(3);
    }
  };

  const pay = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step !== 3) {
      next();
      return;
    }
    setError("");
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
            ? { phoneNumber: phone.replace(/\D/g, "").slice(-10), phoneNumberPrefix: "+57" }
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
    <form className="donate-flow card" onSubmit={pay}>
      <ol className="wizard-steps" aria-label="Pasos">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const current = step === number;
          const done = step > number;
          return (
            <li
              key={label}
              className={current ? "is-current" : done ? "is-done" : ""}
              aria-current={current ? "step" : undefined}
            >
              <span>{number}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {!available ? (
        <div className="donate-alert">
          Los pagos con tarjeta están en configuración. Mientras tanto, usa la llave Bre-B o la
          cuenta Bancolombia que están más abajo.
        </div>
      ) : null}

      {step === 1 ? (
        <div className="wizard-step">
          <fieldset className="donate-block">
            <legend>¿Cómo quieres ayudar?</legend>

            <div className="pieces">
              {PIECES.map((item) => {
                const selected = item.id === pieceId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    className={`piece${selected ? " is-selected" : ""}`}
                    onClick={() => setPieceId(item.id)}
                  >
                    <span className="piece__label">{item.label}</span>
                    <span className="piece__desc">{item.description}</span>
                    <span className="piece__price">
                      {item.amount > 0 ? cop.format(item.amount) : "Tú eliges"}
                    </span>
                  </button>
                );
              })}
            </div>

            {piece.amount === 0 ? (
              <label className="donate-field" style={{ marginTop: 12 }}>
                <span>Monto en pesos</span>
                <input
                  type="number"
                  min={MIN_AMOUNT}
                  step={1000}
                  inputMode="numeric"
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  placeholder="50000"
                />
              </label>
            ) : null}
          </fieldset>

          <div className="wizard-nav">
            <button type="button" className="btn btn--primary btn--xl" onClick={next}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="wizard-step">
          <fieldset className="donate-block">
            <legend>Tus datos</legend>

            <div className="donate-grid">
              <label className="donate-field">
                <span>Nombre</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Héroe anónimo"
                />
              </label>

              <label className="donate-field">
                <span>Correo</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@correo.com"
                />
              </label>

              <label className="donate-field donate-field--wide">
                <span>WhatsApp (opcional)</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="300 000 0000"
                />
              </label>
            </div>

            <label className="donate-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012 y la
              política de datos de la Fundación Segundos de Vida.
            </label>
          </fieldset>

          <div className="wizard-nav">
            <button type="button" className="btn btn--white" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Atrás
            </button>
            <button type="button" className="btn btn--primary btn--xl" onClick={next}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="wizard-step">
          <div className="wizard-summary">
            <div>
              <span>Pieza</span>
              <strong>{piece.label}</strong>
            </div>
            <div>
              <span>A nombre de</span>
              <strong>{name || "Héroe anónimo"}</strong>
            </div>
            <div>
              <span>Correo</span>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="fee-box">
            <div>
              <span>Tu pieza</span>
              <strong>{cop.format(amount)}</strong>
            </div>
            <div>
              <span>Comisión de Wompi</span>
              <strong>{cop.format(fee)}</strong>
            </div>
            <div className="fee-box__total">
              <span>Total a pagar</span>
              <strong>{cop.format(total)}</strong>
            </div>
            <p>
              La comisión la cubre el aportante. A la Fundación le llega el valor exacto de tu
              pieza.
            </p>
          </div>

          <div className="wizard-nav">
            <button type="button" className="btn btn--white" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Atrás
            </button>
            <button type="submit" className="btn btn--primary btn--xl" disabled={loading || !available}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
              ) : (
                <CreditCard className="h-5 w-5" strokeWidth={2} />
              )}
              {!available
                ? "Pagos en línea próximamente"
                : loading
                  ? "Abriendo el pago"
                  : `Pagar ${cop.format(total)}`}
            </button>
          </div>

          <p className="donate-secure">
            <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.75} />
            Pago procesado por Wompi. No vemos ni guardamos los datos de tu tarjeta.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="donate-alert donate-alert--error" role="alert">
          <TriangleAlert className="h-4 w-4" strokeWidth={2} />
          {error}
        </p>
      ) : null}

      <div className="donate-progress">
        <div className="donate-progress__head">
          <span>Recaudado hasta ahora</span>
          <strong>{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</strong>
        </div>
        <div className="donate-progress__bar">
          <div style={{ width: `${pct}%` }} />
        </div>
        <p>
          {cop.format(raised)} de {cop.format(goal)}
        </p>
      </div>
    </form>
  );
}
