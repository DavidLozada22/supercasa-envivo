import Link from "next/link";
import { Lock } from "lucide-react";

const START = new Date("2026-11-20T18:00:00-05:00");
const END = new Date("2026-11-22T18:00:00-05:00");

export type SiteSection = "campaign" | "live" | "donate" | "legal";

export default function SiteHeader({ current }: { current?: SiteSection }) {
  const now = new Date();
  const before = now < START;
  const preview = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";
  const live = preview || (now >= START && now <= END);

  return (
    <>
      <div className="site-topbar">
        <div className="site-topbar__inner">
          <p className="site-topbar__text">
            <span className="site-topbar__dot" aria-hidden="true" />
            {live
              ? "Estamos en vivo · 48 horas por La Supercasa"
              : before
                ? "La transmisión empieza el viernes 20 de noviembre a las 6:00 p. m., hora de Bogotá"
                : "La maratón terminó. La campaña sigue abierta hasta el 30 de noviembre"}
          </p>
          <p className="site-topbar__sub">
            Evento de <strong>Familia Kavanah</strong> a beneficio de la{" "}
            <strong>Fundación Segundos de Vida</strong> para construir La Supercasa.
          </p>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-header__brand" href="/" aria-label="La SUPERCASA, inicio">
            <img src="/img/logo-fsv.png" width="188" height="39" alt="Fundación Segundos de Vida" />
          </Link>

          <nav className="site-header__nav" aria-label="Navegación principal">
            <Link
              href="/"
              className="site-header__link"
              aria-current={current === "campaign" ? "page" : undefined}
            >
              La campaña
            </Link>
            <Link
              href="/envivo"
              className="site-header__link"
              aria-current={current === "live" ? "page" : undefined}
            >
              Maratón 48 horas
            </Link>
          </nav>

          <div className="site-header__actions">
            {live ? (
              <Link href="/envivo" className="site-live-pill" aria-label="Entrar a la transmisión en vivo">
                <span className="site-live-pill__dot" aria-hidden="true" />
                En vivo
              </Link>
            ) : null}
            <Link href="/donar" className="site-donate">
              Donar
            </Link>
            <a
              className="site-admin"
              href="/admin"
              aria-label="Panel de administración"
              title="Panel de administración"
            >
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
