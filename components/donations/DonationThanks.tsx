"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

type Donation = {
  reference: string;
  status: "pending" | "approved" | "declined" | "voided" | "error";
  amountCop: number;
  donorName: string | null;
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function DonationThanks({ reference }: { reference: string }) {
  const [donation, setDonation] = useState<Donation | null>(null);
  const [missing, setMissing] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(`/api/donations/${encodeURIComponent(reference)}`, {
          cache: "no-store",
        });
        if (response.status === 404) {
          if (active) setMissing(true);
          return;
        }
        const data = (await response.json()) as Donation;
        if (active) setDonation(data);
      } catch {
        // Reintenta en el siguiente ciclo.
      }
    };

    void load();
    const timer = window.setInterval(load, 2500);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [reference]);

  if (missing) {
    return (
      <div className="card thanks-box">
        <XCircle className="thanks-box__icon thanks-box__icon--error" strokeWidth={1.75} />
        <h1>No encontramos ese aporte</h1>
        <p>Revisa el enlace o vuelve a intentarlo.</p>
        <Link href="/donar" className="btn btn--primary">
          Volver a donar
        </Link>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="card thanks-box">
        <Loader2 className="thanks-box__icon animate-spin" strokeWidth={2} />
        <p>Consultando tu aporte</p>
      </div>
    );
  }

  const approved = donation.status === "approved";
  const pending = donation.status === "pending";

  return (
    <div className="card thanks-box">
      {approved ? (
        <CheckCircle2 className="thanks-box__icon thanks-box__icon--ok" strokeWidth={1.75} />
      ) : pending ? (
        <Clock className="thanks-box__icon thanks-box__icon--wait" strokeWidth={1.75} />
      ) : (
        <XCircle className="thanks-box__icon thanks-box__icon--error" strokeWidth={1.75} />
      )}

      <h1>
        {approved
          ? "Gracias, tu aporte ya suma"
          : pending
            ? "Estamos confirmando tu pago"
            : "El pago no se completó"}
      </h1>

      <p>
        {approved
          ? `Recibimos ${cop.format(donation.amountCop)} para La Supercasa. Cada pared empieza con un aporte como el tuyo.`
          : pending
            ? "Wompi puede tardar unos segundos. Esta página se actualiza sola."
            : "No se hizo ningún cobro. Puedes intentarlo de nuevo o usar la llave Bre-B."}
      </p>

      <p className="thanks-box__ref">{donation.reference}</p>

      <div className="thanks-box__actions">
        <Link href="/envivo" className="btn btn--primary">
          Volver a la transmisión
        </Link>
        {!approved ? (
          <Link href="/donar" className="btn btn--white">
            Intentar de nuevo
          </Link>
        ) : null}
        {approved && origin ? (
          <a
            className="btn btn--white"
            href={`https://wa.me/?text=${encodeURIComponent(
              `Me uní a La Supercasa y ya puse mi pieza. Entra a la transmisión y dona: ${origin}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Compartir por WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
