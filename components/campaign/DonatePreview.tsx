import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import DonationQR from "@/components/landing/DonationQR";
import { PIECES } from "@/lib/donations/catalog";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function DonatePreview() {
  return (
    <div className="flow card donate-preview">
      <div>
        <ul className="donate-preview__list">
          {PIECES.filter((piece) => piece.amount > 0).map((piece) => (
            <li key={piece.id}>
              <span>{piece.label}</span>
              <strong>{cop.format(piece.amount)}</strong>
            </li>
          ))}
          <li>
            <span>Otro monto</span>
            <strong>Tú eliges</strong>
          </li>
        </ul>

        <p className="donate-preview__note">
          La comisión de Wompi la cubre el aportante, así a la Fundación le llega el valor exacto de
          la pieza. Pago seguro, no guardamos datos de tarjeta.
        </p>

        <div className="donate-preview__actions">
          <Link href="/donar" className="btn btn--primary btn--xl">
            <HeartHandshake className="h-5 w-5" strokeWidth={2} />
            Elegir mi pieza
          </Link>
          <a href="#transferencia" className="btn btn--white">
            Pagar por transferencia
          </a>
        </div>
      </div>

      <div className="donate-preview__qr">
        <DonationQR />
        <p>Escanea y dona desde tu celular</p>
      </div>
    </div>
  );
}
