"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { feeFor } from "@/lib/donations/pricing";

type Checkout = {
  reference: string;
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

const A = { "data-astro-cid-erlevsxa": "" } as const;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const PIECES = [
  {
    id: "ventana",
    icon: "🪟",
    label: "La ventana de un cuarto",
    price: 100_000,
    badge: "⭐ Calvito la recomienda",
    impact: [
      "Una ventana con marco y vidrio para el cuarto de un niño",
      "Luz y aire fresco cada mañana",
      "El cielo de Bogotá visto desde la cama",
    ],
  },
  {
    id: "bano",
    icon: "🚿",
    label: "Un baño completo",
    price: 250_000,
    impact: [
      "Ducha, sanitario y lavamanos listos para una familia",
      "Un baño calientico después de un día de tratamiento",
    ],
  },
  {
    id: "habitacion",
    icon: "🛏️",
    label: "Una habitación equipada",
    price: 1_000_000,
    impact: [
      "Cama para el niño y para su mamá o cuidador",
      "Un lugar seguro para descansar juntos",
    ],
  },
  {
    id: "pintura",
    icon: "🎨",
    label: "Pintura de una pared",
    price: 50_000,
    impact: ["Color y calidez en una pared de la casa", "Un espacio que se siente hogar"],
  },
  {
    id: "material",
    icon: "🍲",
    label: "Material de instalación",
    price: 20_000,
    impact: ["Tuberías, cables y materiales para dejar la casa lista", "Cada detalle cuenta"],
  },
  {
    id: "libre",
    icon: "✏️",
    label: "Lo que tu corazón diga",
    price: 0,
    impact: ["Tu aporte se suma a la pieza que más falta", "Cada peso construye"],
  },
];

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
  const [wall, setWall] = useState(false);
  const [certificate, setCertificate] = useState(false);
  const [certName, setCertName] = useState("");
  const [docType, setDocType] = useState("CC");
  const [docNumber, setDocNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const piece = PIECES.find((item) => item.id === pieceId) ?? PIECES[0];
  const amount = piece.price > 0 ? piece.price : Math.floor(Number(custom) || 0);
  const { fee, total } = feeFor(Math.max(0, amount));
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  const next = () => {
    setError("");
    if (step === 1) {
      if (amount < 10_000) {
        setError("El aporte mínimo es $10.000.");
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
      if (certificate) {
        if (!certName.trim()) {
          setError("Escribe el nombre o la razón social del certificado.");
          return;
        }
        if (!/^[0-9A-Za-z.\-]{4,20}$/.test(docNumber)) {
          setError("Revisa el número de documento del certificado.");
          return;
        }
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
          custom: piece.price > 0 ? undefined : amount,
          donor: {
            name,
            email,
            phone,
            consent,
            showOnWall: wall,
            certificate: certificate
              ? { name: certName, docType, docNumber }
              : undefined,
          },
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
    <form className="flow card" onSubmit={pay} {...A}>
      <ol className="stepper" aria-label="Pasos" {...A}>
        {["Tu pieza", "Tus datos", "Confirma"].map((label, index) => {
          const number = index + 1;
          return (
            <li
              key={label}
              className={step === number ? "is-current" : ""}
              aria-current={step === number ? "step" : undefined}
              {...A}
            >
              <span className="stepper__n" {...A}>{number}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {!available ? (
        <p className="error" {...A}>
          Los pagos con tarjeta están en configuración. Usa la llave Bre-B o la cuenta
          Bancolombia que están más abajo en esta página.
        </p>
      ) : null}

      {step === 1 ? (
        <div className="step" {...A}>
          <fieldset className="frequency" {...A}>
            <legend {...A}>¿Cómo quieres ayudar?</legend>
            <label className="pill pill--big" {...A}>
              <input type="radio" name="frequency" checked readOnly {...A} />
              <span {...A}>🎁 Donación única</span>
            </label>
            <label className="pill pill--big" {...A} style={{ opacity: 0.55 }}>
              <input type="radio" name="frequency" disabled {...A} />
              <span {...A}>
                💛 Plan Padrino mensual{" "}
                <small {...A}>Muy pronto: cada mes pones una pieza más.</small>
              </span>
            </label>
          </fieldset>

          <fieldset className="pieces" {...A}>
            <legend className="visually-hidden" {...A}>Tu pieza</legend>
            {PIECES.map((item) => (
              <label
                key={item.id}
                className={`piece${item.id === "ventana" ? " piece--rec" : ""}`}
                data-piece={item.id}
                {...A}
              >
                <input
                  type="radio"
                  name="piece"
                  value={item.id}
                  checked={pieceId === item.id}
                  onChange={() => setPieceId(item.id)}
                  {...A}
                />
                <span className="piece__icon" aria-hidden="true" {...A}>{item.icon}</span>
                <span className="piece__label" {...A}>{item.label}</span>
                <span className="piece__price" {...A}>
                  <strong {...A}>{item.price > 0 ? cop.format(item.price) : "Tú eliges"}</strong>
                </span>
                {item.badge ? (
                  <span className="piece__badge piece__badge--once" {...A}>{item.badge}</span>
                ) : null}
              </label>
            ))}
          </fieldset>

          {piece.price === 0 ? (
            <div className="field" {...A}>
              <label htmlFor="custom-amount" {...A}>Monto en pesos</label>
              <input
                id="custom-amount"
                name="custom"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="80.000"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                {...A}
              />
            </div>
          ) : null}

          {error ? <p className="error" role="alert" {...A}>{error}</p> : null}

          <div className="actions" {...A}>
            <button type="button" className="btn btn--primary" onClick={next} {...A}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="step" {...A}>
          <div className="fields" {...A}>
            <div className="field" {...A}>
              <label htmlFor="donor-name" {...A}>Tu nombre o apodo de héroe</label>
              <input
                id="donor-name"
                type="text"
                autoComplete="name"
                maxLength={40}
                placeholder='Ej: Laura, o "La tía de Calvito"'
                value={name}
                onChange={(event) => setName(event.target.value)}
                {...A}
              />
              <small {...A}>Aparecerá en tu carnet. Si lo dejas vacío serás “Héroe anónimo”.</small>
            </div>

            <div className="field" {...A}>
              <label htmlFor="donor-email" {...A}>Tu correo *</label>
              <input
                id="donor-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                {...A}
              />
              <small {...A}>Para enviarte tu comprobante y contarte cómo va tu pieza.</small>
            </div>

            <div className="field" {...A}>
              <label htmlFor="donor-phone" {...A}>Tu WhatsApp (opcional)</label>
              <input
                id="donor-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                {...A}
              />
            </div>
          </div>

          <label className="check" {...A}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              {...A}
            />
            <span {...A}>
              Autorizo a la Fundación Segundos de Vida a tratar mis datos según su{" "}
              <a href="/politica-de-datos" target="_blank" rel="noopener">política de tratamiento de datos</a>{" "}
              (Ley 1581 de 2012).
            </span>
          </label>

          <label className="check" {...A}>
            <input type="checkbox" checked={wall} onChange={(event) => setWall(event.target.checked)} {...A} />
            <span {...A}>Quiero que mi nombre aparezca en el muro de héroes.</span>
          </label>

          <label className="check" {...A}>
            <input
              type="checkbox"
              checked={certificate}
              onChange={(event) => setCertificate(event.target.checked)}
              aria-controls="certificate-fields"
              {...A}
            />
            <span {...A}>Necesito certificado de donación (persona o empresa).</span>
          </label>

          {certificate ? (
            <div className="fields certificate" id="certificate-fields" {...A}>
              <div className="field" {...A}>
                <label htmlFor="cert-name" {...A}>Nombre o razón social para el certificado</label>
                <input
                  id="cert-name"
                  type="text"
                  maxLength={80}
                  value={certName}
                  onChange={(event) => setCertName(event.target.value)}
                  {...A}
                />
              </div>
              <div className="field field--row" {...A}>
                <div {...A}>
                  <label htmlFor="doc-type" {...A}>Tipo de documento</label>
                  <select id="doc-type" value={docType} onChange={(event) => setDocType(event.target.value)} {...A}>
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="NIT">NIT (empresa)</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                </div>
                <div {...A}>
                  <label htmlFor="doc-number" {...A}>Número de documento</label>
                  <input
                    id="doc-number"
                    type="text"
                    inputMode="numeric"
                    maxLength={20}
                    value={docNumber}
                    onChange={(event) => setDocNumber(event.target.value)}
                    {...A}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {error ? <p className="error" role="alert" {...A}>{error}</p> : null}

          <div className="actions" {...A}>
            <button type="button" className="btn btn--ghost" onClick={() => setStep(1)} {...A}>
              ← elegir otra pieza
            </button>
            <button type="button" className="btn btn--primary" onClick={next} {...A}>
              Ver el impacto de mi pieza →
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="step" {...A}>
          <div className="confirm" {...A}>
            <div className="confirm__calvita" {...A}>
              <figure className="character" data-astro-cid-itutal2x>
                <img
                  src="/img/calvita.webp"
                  width="299"
                  height="390"
                  alt="Calvita saluda feliz desde su silla de ruedas."
                  data-astro-cid-itutal2x
                />
              </figure>
            </div>
            <blockquote className="bubble bubble--left bubble--yellow" data-astro-cid-2hw3mi64 {...A}>
              <p data-astro-cid-2hw3mi64>
                ¡WOW! Mira todo lo que va a pasar por tu aporte. Cuando la luz entre por esa
                ventana, pensaré en ti. <strong>¿Confirmas con amor?</strong>
              </p>
            </blockquote>
          </div>

          <div className="summary" {...A}>
            <p className="summary__label" {...A}>Tu pieza</p>
            <p className="summary__piece" {...A}>{piece.label}</p>
            <p className="summary__amount" {...A}>{cop.format(amount)}</p>
            <ul className="impact" {...A}>
              {piece.impact.map((line) => <li key={line} {...A}>{line}</li>)}
            </ul>

            <label className="check check--fee" {...A}>
              <input type="checkbox" checked readOnly {...A} />
              <span {...A}>
                Incluye la comisión de Wompi ({cop.format(fee)}) para que a la Fundación le
                llegue tu pieza completa.
              </span>
            </label>

            <p className="summary__total" {...A}>
              Total: <strong {...A}>{cop.format(total)}</strong>
            </p>
            <p className="summary__pay" {...A}>
              Pagarás de forma segura con <strong {...A}>Wompi</strong>{" "}
              <small {...A}>Tarjetas, PSE, Nequi, Daviplata y efectivo</small>
            </p>
          </div>

          {error ? <p className="error" role="alert" {...A}>{error}</p> : null}

          <div className="actions" {...A}>
            <button type="button" className="btn btn--ghost" onClick={() => setStep(2)} {...A}>
              ← cambiar mis datos
            </button>
            <button type="submit" className="btn btn--primary btn--xl" disabled={loading || !available} {...A}>
              {loading ? "Abriendo el pago…" : `💳 Ir a pagar ${cop.format(total)}`}
            </button>
          </div>
          <p className="secure" {...A}>
            🔒 Pagas en Wompi, la pasarela de Bancolombia. Nunca vemos los datos de tu tarjeta.
          </p>
        </div>
      ) : null}

      <div className="donate-progress" style={{ marginTop: 18 }}>
        <div className="donate-progress__head">
          <span>Recaudado hasta ahora</span>
          <strong>{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</strong>
        </div>
        <div className="donate-progress__bar">
          <div style={{ width: `${pct}%` }} />
        </div>
        <p>{cop.format(raised)} de {cop.format(goal)}</p>
      </div>
    </form>
  );
}
