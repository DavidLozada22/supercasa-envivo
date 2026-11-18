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
  const [attempts, setAttempts] = useState(0);
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
        if (!active) return;
        setDonation(data);
        if (data.status !== "pending") setAttempts(99);
      } catch {
        // Reintenta en el siguiente ciclo.
      }
    };

    void load();
    const timer = window.setInterval(() => {
      setAttempts((current) => {
        if (current >= 20) {
          window.clearInterval(timer);
          return current;
        }
        void load();
        return current + 1;
      });
    }, 2500);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [reference]);

  if (missing) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-[#0F2354]/10 bg-white p-8 text-center shadow-lg">
        <XCircle className="mx-auto h-10 w-10 text-red-500" strokeWidth={1.75} />
        <h1 className="mt-4 text-xl font-extrabold text-[#0F2354]">No encontramos ese aporte</h1>
        <p className="mt-2 text-sm text-slate-500">Revisa el enlace o vuelve a intentarlo.</p>
        <Link
          href="/donar"
          className="mt-6 inline-flex rounded-full bg-[#E6009E] px-5 py-2.5 text-sm font-bold text-white"
        >
          Volver a donar
        </Link>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3 rounded-3xl border border-[#0F2354]/10 bg-white p-10 text-slate-500 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} />
        Consultando tu aporte
      </div>
    );
  }

  const approved = donation.status === "approved";
  const pending = donation.status === "pending";
  const failed = !approved && !pending;

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#0F2354]/10 bg-white p-8 text-center shadow-lg">
      {approved ? (
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.75} />
      ) : pending ? (
        <Clock className="mx-auto h-12 w-12 text-amber-500" strokeWidth={1.75} />
      ) : (
        <XCircle className="mx-auto h-12 w-12 text-red-500" strokeWidth={1.75} />
      )}

      <h1 className="mt-4 text-2xl font-extrabold text-[#0F2354]">
        {approved
          ? "Gracias, tu aporte ya suma"
          : pending
            ? "Estamos confirmando tu pago"
            : "El pago no se completó"}
      </h1>

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {approved
          ? `Recibimos ${cop.format(donation.amountCop)} para La Supercasa. Cada pared empieza con un aporte como el tuyo.`
          : pending
            ? "Wompi puede tardar unos segundos. Esta página se actualiza sola."
            : "No se hizo ningún cobro. Puedes intentarlo de nuevo o usar la llave Bre-B."}
      </p>

      <p className="mt-4 font-mono text-xs text-slate-400">{donation.reference}</p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link
          href="/"
          className="inline-flex justify-center rounded-full bg-[#0F2354] px-5 py-2.5 text-sm font-bold text-white"
        >
          Volver al live
        </Link>
        {!approved ? (
          <Link
            href="/donar"
            className="inline-flex justify-center rounded-full border border-[#0F2354]/15 px-5 py-2.5 text-sm font-bold text-[#0F2354]"
          >
            Intentar de nuevo
          </Link>
        ) : null}
      </div>

      {approved && origin ? (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Me uní a La Supercasa y ya puse mi pieza. Entra al live y dona: ${origin}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex justify-center rounded-full bg-[#E6009E] px-5 py-2.5 text-sm font-bold text-white"
        >
          Compartir por WhatsApp
        </a>
      ) : null}

      {failed ? <span className="sr-only">{donation.status}</span> : null}
    </div>
  );
}
