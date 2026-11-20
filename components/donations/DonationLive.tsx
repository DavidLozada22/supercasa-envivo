"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  Maximize2,
  Play,
  Radio,
  X,
} from "lucide-react";
import type { LiveSnapshot } from "@/lib/youtube/live";

function embedUrl(videoId: string, full = false): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: full ? "0" : "1",
    controls: full ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export default function DonationLive({
  initial,
  preview = false,
}: {
  initial: LiveSnapshot;
  preview?: boolean;
}) {
  const [snap, setSnap] = useState<LiveSnapshot>(initial);
  const [open, setOpen] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (preview) return;
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/live/current", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as LiveSnapshot;
        if (alive) setSnap(body);
      } catch {
        // Se conserva el ultimo estado valido.
      }
    };

    const id = window.setInterval(load, 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [preview]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowPill(!entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isLive = snap.state === "live";
  const canPlay = Boolean(snap.videoId);
  const title =
    snap.state === "before"
      ? "La maratón empieza el viernes 20"
      : snap.state === "after"
        ? "La maratón terminó"
        : "48 horas por La Supercasa";
  const kicker =
    snap.state === "before" ? "Ya viene" : snap.state === "after" ? "Gracias" : "Está pasando ahora";
  const text =
    snap.state === "before"
      ? "A las 6:00 p. m., hora de Bogotá, arrancan 48 horas por la casa de los Súper Calvitos. Guarda este enlace y acompáñanos."
      : snap.state === "after"
        ? "La campaña sigue abierta hasta el 30 de noviembre. Todavía puedes donar y compartir."
        : "La casa se está construyendo en vivo. Dona sin perderte ningún bloque.";

  return (
    <>
      <section className="donation-live" ref={sectionRef} aria-label="Transmisión en vivo">
        <div className="donation-live__frame">
          {isLive && canPlay ? (
            <>
              <iframe
                src={embedUrl(snap.videoId)}
                title="Transmisión en vivo de La Supercasa"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
              <button
                type="button"
                className="donation-live__frame-btn"
                onClick={() => setOpen(true)}
                aria-label="Abrir la transmisión en pantalla completa"
              />
              <span className="donation-live__badge">
                <i aria-hidden="true" />
                En vivo
              </span>
              <span className="donation-live__play" aria-hidden="true">
                <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
              </span>
            </>
          ) : (
            <div className="donation-live__standby">
              <span className="donation-live__standby-icon" aria-hidden="true">
                {snap.state === "before" ? (
                  <CalendarClock className="h-6 w-6" strokeWidth={1.75} />
                ) : (
                  <Radio className="h-6 w-6" strokeWidth={1.75} />
                )}
              </span>
              <p className="donation-live__standby-eyebrow">
                {snap.state === "before" ? "Transmisión especial" : "Señal"}
              </p>
              <p className="donation-live__standby-title">
                {snap.state === "before"
                  ? "El live empieza el viernes 20"
                  : "Estamos al aire"}
              </p>
              <p className="donation-live__standby-note">
                {snap.state === "before"
                  ? "6:00 p. m., hora de Bogotá"
                  : "Abre el envío para ver la señal"}
              </p>
            </div>
          )}
        </div>

        <div className="donation-live__copy">
          <p className="donation-live__kicker">{kicker}</p>
          <h2 className="donation-live__title">{title}</h2>
          <p className="donation-live__text">{text}</p>
          <div className="donation-live__actions">
            {isLive && canPlay ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setOpen(true)}
              >
                <Maximize2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                Pantalla completa
              </button>
            ) : null}
            <Link href="/envivo" className="btn btn--white">
              <ArrowUpRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              Ir al envío
            </Link>
          </div>
          <p className="donation-live__note">
            {isLive
              ? "Puedes seguir donando mientras ves el live."
              : "La página del envío te muestra el estado y las cortinas del evento."}
          </p>
        </div>
      </section>

      {showPill && isLive && !open ? (
        <Link href="/envivo" className="donation-live__pill">
          <i aria-hidden="true" />
          EN VIVO · Ver
        </Link>
      ) : null}

      {open && canPlay ? (
        <div
          className="donation-live-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Transmisión en vivo"
          onClick={() => setOpen(false)}
        >
          <div
            className="donation-live-modal__box"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="donation-live-modal__close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar la transmisión"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <div className="donation-live-modal__frame">
              <iframe
                src={embedUrl(snap.videoId, true)}
                title="Transmisión en vivo de La Supercasa"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="donation-live-modal__foot">
              <span>48 horas por La Supercasa</span>
              <Link href="/envivo" className="btn btn--yellow">
                Ir al envío
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
