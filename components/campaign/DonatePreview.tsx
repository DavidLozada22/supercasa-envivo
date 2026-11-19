import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { PIECES } from "@/lib/donations/pieces";

const A = { "data-astro-cid-erlevsxa": "" } as const;
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function DonatePreview() {
  return (
    <div className="flow card donate-preview" {...A}>
      <div className="donate-preview__head">
        <p className="eyebrow" {...A}>Pon tu pieza</p>
        <h3>Elige la pieza que quieres poner</h3>
        <p>Cada aporte se ve en la casa. Elige la tuya y págala en un minuto.</p>
      </div>

      <fieldset className="pieces" {...A}>
        <legend className="visually-hidden" {...A}>Tu pieza</legend>
        {PIECES.map((piece) => (
          <Link
            key={piece.id}
            href="/donar"
            className={`piece${piece.id === "ventana" ? " piece--rec" : ""}`}
            aria-label={`${piece.label}${piece.price > 0 ? `, ${cop.format(piece.price)}` : ""}`}
            {...A}
          >
            <span className="piece__icon" aria-hidden="true" {...A}>{piece.icon}</span>
            <span className="piece__label" {...A}>{piece.label}</span>
            <span className="piece__price" {...A}>
              <strong {...A}>{piece.price > 0 ? cop.format(piece.price) : "Tú eliges"}</strong>
            </span>
            {piece.badge ? (
              <span className="piece__badge piece__badge--once" {...A}>{piece.badge}</span>
            ) : null}
          </Link>
        ))}
      </fieldset>

      <div className="donate-preview__actions">
        <Link href="/donar" className="btn btn--primary btn--xl">
          <HeartHandshake className="h-5 w-5" strokeWidth={2} />
          Elegir mi pieza
        </Link>
        <a href="#transferencia" className="btn btn--white">
          Pagar por transferencia
        </a>
      </div>

      <p className="donate-preview__note">
        El Plan Padrino mensual sigue bloqueado mientras conectamos los cobros recurrentes.
      </p>
    </div>
  );
}
