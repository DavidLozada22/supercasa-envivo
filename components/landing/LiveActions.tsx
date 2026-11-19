"use client";

import { useEffect, useState } from "react";
import { Bell, HeartHandshake, QrCode } from "lucide-react";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";

export default function LiveActions() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  const total = end - start;
  const elapsed = now ? Math.max(0, Math.min(total, now - start)) : 0;
  const remaining = Math.max(0, total - elapsed);
  const before = now > 0 && now < start;
  const during = now >= start && now < end;
  const after = now >= end;

  const hoursLive = Math.floor(elapsed / 3_600_000);
  const hoursLeft = Math.ceil(remaining / 3_600_000);
  const hoursToStart = Math.max(0, Math.ceil((start - now) / 3_600_000));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const number = before ? hoursToStart : after ? EVENT_HOURS : hoursLive;
  const label = before ? "Horas para empezar" : after ? "Horas completadas" : "Horas en vivo";
  const status = before ? "FALTA POCO" : after ? "GRACIAS" : "EN VIVO";
  const detail = before
    ? "Viernes 20 de noviembre, 6:00 p. m., hora de Bogotá."
    : after
      ? "La campaña sigue abierta hasta el 30 de noviembre."
      : hoursLeft > 0
        ? `Faltan ${hoursLeft} horas para completar las 48.`
        : "Última hora. Este es el empujón final.";

  return (
    <section className="live-pulse" aria-label="Estado de la maratón">
      <div className="live-pulse__main">
        <span className={`live-pulse__tag${during ? " is-live" : ""}`}>
          <i aria-hidden="true" />
          {status}
        </span>
        <p className="live-pulse__number">
          {number}
          <span>{before ? "h" : `/${EVENT_HOURS}`}</span>
        </p>
        <p className="live-pulse__label">{label}</p>
        <div
          className="live-pulse__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
        >
          <span style={{ width: `${pct.toFixed(2)}%` }} />
        </div>
        <p className="live-pulse__detail">{detail}</p>
      </div>

      <div className="live-pulse__side">
        <p className="live-pulse__cause">
          <strong>48 horas para terminar La Supercasa.</strong> Cada aporte pone una pieza real
          para los Súper Calvitos y sus familias.
        </p>
        <div className="live-pulse__actions">
          <a className="live-pulse__btn live-pulse__btn--primary" href="/donar">
            <HeartHandshake size={18} strokeWidth={2} aria-hidden="true" />
            Donar ahora
          </a>
          <a className="live-pulse__btn" href="#avisame">
            <Bell size={18} strokeWidth={2} aria-hidden="true" />
            Recibir avisos
          </a>
          <a className="live-pulse__btn" href="/donar#transferencia">
            <QrCode size={18} strokeWidth={2} aria-hidden="true" />
            Cómo donar
          </a>
        </div>
        <p className="live-pulse__fine">
          Tarjeta, PSE, Nequi, Bre-B o transferencia. También puedes donar en especie.
        </p>
      </div>
    </section>
  );
}
