import Link from "next/link";

const START = new Date("2026-11-20T18:00:00-05:00");
const END = new Date("2026-11-22T18:00:00-05:00");

export default function LiveRibbon() {
  const now = new Date();
  if (now > END) return null;

  const live = now >= START;

  return (
    <div className="live-topbar">
      <div className="live-topbar__inner">
        <div className="live-topbar__copy">
          <p className="live-topbar__text">
            <span className="live-topbar__dot" aria-hidden="true" />
            {live
              ? "Estamos en vivo · 48 horas por La Supercasa"
              : "La transmisión empieza el viernes 20 de noviembre a las 6:00 p. m., hora de Bogotá"}
          </p>
          <p className="live-topbar__sub">
            Evento de <strong>Familia Kavanah</strong> a beneficio de la{" "}
            <strong>Fundación Segundos de Vida</strong> para construir La Supercasa.
          </p>
        </div>

        <div className="live-topbar__actions">
          <Link href="/envivo" className="btn btn--white">
            Entrar al live
          </Link>
          <Link href="/donar" className="live-topbar__donate">
            Donar
          </Link>
        </div>
      </div>
    </div>
  );
}
