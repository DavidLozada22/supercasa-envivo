import { Radio } from "lucide-react";
import type { ReactNode } from "react";

export default function StreamPlaceholder({
  title,
  message,
  note,
  cta,
  extra,
}: {
  title: string;
  message: string;
  note?: string;
  cta?: { href: string; label: string };
  extra?: ReactNode;
}) {
  return (
    <div className="stream-placeholder">
      <div className="stream-placeholder__logos">
        <span className="stream-placeholder__logo">
          <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
        </span>
        <span className="stream-placeholder__cross" aria-hidden="true">
          ×
        </span>
        <span className="stream-placeholder__logo stream-placeholder__logo--kavanah">
          <img src="/img/kavanah-horizontal-white.png" alt="Kavanah" />
        </span>
      </div>

      <span className="stream-placeholder__icon" aria-hidden="true">
        <Radio className="h-6 w-6" strokeWidth={1.75} />
      </span>

      <p className="stream-placeholder__eyebrow">Transmisión especial</p>
      <h2>{title}</h2>
      <p className="stream-placeholder__message">{message}</p>
      {note ? <p className="stream-placeholder__note">{note}</p> : null}

      {cta ? (
        <a className="stream-placeholder__cta" href={cta.href}>
          {cta.label}
        </a>
      ) : null}

      {extra}
    </div>
  );
}
