"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Lock, Menu, X } from "lucide-react";

const START = new Date("2026-11-20T18:00:00-05:00").getTime();
const END = new Date("2026-11-22T18:00:00-05:00").getTime();
const PREVIEW = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";

export type SiteSection = "campaign" | "live" | "donate" | "legal";

function remainingLabel(ms: number): string {
  const minutes = Math.max(0, Math.ceil(ms / 60000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days >= 1) return `${days} ${days === 1 ? "día" : "días"} y ${hours} h`;
  if (hours >= 1) return `${hours} h ${mins} min`;
  return `${mins} min`;
}

export default function SiteHeader({
  current,
  forceLive,
}: {
  current?: SiteSection;
  forceLive?: boolean;
}) {
  const pathname = usePathname();
  const [now, setNow] = useState<number | null>(null);
  const [serverLive, setServerLive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  // La píldora sigue al directo real: si el evento se alarga en YouTube, no se
  // apaga por la hora prevista.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/live/current", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { state?: string; live?: boolean };
        if (alive) setServerLive(body.state === "live" || body.live === true);
      } catch {
        // Se queda con el cálculo por horario.
      }
    };
    void load();
    const id = window.setInterval(load, 60000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const live =
    forceLive || PREVIEW || serverLive || (now !== null && now >= START && now <= END);
  const before = now !== null && now < START;
  const after = now !== null && now > END;

  const status = live
    ? "Estamos en vivo · 48 horas por La Supercasa"
    : before
      ? `Empezamos en vivo en ${remainingLabel(START - (now ?? START))}`
      : after
        ? "La última transmisión quedó disponible · la campaña sigue hasta el 30 de noviembre"
        : "La transmisión empieza el viernes 20 de noviembre a las 6:00 p. m., hora de Bogotá";

  return (
    <>
      <div className="site-topbar">
        <div className="site-topbar__inner">
          <p className="site-topbar__text">
            <span className={`site-topbar__dot${live ? " is-live" : ""}`} aria-hidden="true" />
            <span>{status}</span>
          </p>
          <p className="site-topbar__sub">
            Evento de <strong>Familia Kavanah</strong> a beneficio de la{" "}
            <strong>Fundación Segundos de Vida</strong> para construir La Supercasa.
          </p>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-header__brand" href="/" aria-label="La Supercasa, inicio">
            <img src="/img/logo-fsv-official.png" width="404" height="84" alt="Fundación Segundos de Vida" />
          </Link>

          <nav className="site-header__nav" aria-label="Navegación principal">
            <Link
              href="/"
              className="site-btn"
              aria-current={current === "campaign" ? "page" : undefined}
            >
              Conoce La Supercasa
            </Link>
            <Link
              href="/envivo"
              className="site-btn"
              aria-current={current === "live" ? "page" : undefined}
            >
              Maratón 48 horas
            </Link>
            <Link href="/envivo#avisame" className="site-btn">
              Avísame
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

            <button
              type="button"
              className="site-burger"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="site-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="site-menu__top">
            <Link className="site-menu__brand" href="/" aria-label="La Supercasa, inicio">
              <img src="/img/logo-fsv-official.png" width="404" height="84" alt="Fundación Segundos de Vida" />
            </Link>
            <button
              type="button"
              className="site-menu__close"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <nav className="site-menu__nav" aria-label="Menú principal">
            <Link href="/" className="site-menu__link">
              <span>
                Conoce La Supercasa
                <small>Qué estamos construyendo y por qué</small>
              </span>
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </Link>
            <Link href="/envivo" className="site-menu__link">
              <span>
                Maratón 48 horas
                <small>{live ? "Estamos en vivo ahora" : "Viernes 20, 6:00 p. m., hora Bogotá"}</small>
              </span>
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </Link>
            <Link href="/envivo#avisame" className="site-menu__link">
              <span>
                Avísame
                <small>Te escribimos cuando empiece la transmisión</small>
              </span>
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </Link>
            <Link href="/donar" className="site-menu__donate">
              Donar ahora
              <small>Ponte la capa</small>
            </Link>
            <a href="/admin" className="site-menu__link site-menu__link--soft">
              <span>
                Panel de administración
                <small>Solo para el equipo de producción</small>
              </span>
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </a>
          </nav>

          <div className="site-menu__event">
            <p className="site-menu__event-title">Maratón 48 horas</p>
            <p>Viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m.</p>
            <p className="site-menu__event-note">Hora de Bogotá · La Supercasa</p>
          </div>

          <div className="site-menu__footer">
            <p className="site-menu__footer-label">Organizan</p>
            <div className="site-menu__logos">
              <span className="site-menu__logo-card">
                <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
              </span>
              <span className="site-menu__cross" aria-hidden="true">×</span>
              <img
                className="site-menu__kavanah"
                src="/img/kavanah-horizontal-white.png"
                alt="Kavanah"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
