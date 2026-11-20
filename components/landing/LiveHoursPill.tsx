"use client";

import { useEffect, useState } from "react";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";

function two(value: number): string {
  return String(value).padStart(2, "0");
}

function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
}

function spoken(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `Faltan ${hours} horas y ${minutes} minutos`;
}

export default function LiveHoursPill({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  const initial = now === 0;
  const before = !initial && now < start;
  const after = !initial && now >= end;

  const tag = initial ? "48 H" : before ? "FALTA POCO" : after ? "GRACIAS" : "EN VIVO";
  const diff = initial ? end - start : after ? 0 : before ? start - now : end - now;
  const value = after ? `${EVENT_HOURS} h completas` : clock(diff);

  return (
    <div
      className={`live-hours-pill${compact ? " is-compact" : ""}`}
      role="timer"
      aria-label={after ? "La maratón terminó" : spoken(diff)}
    >
      <span className={`live-hours-pill__tag${!initial && !before && !after ? " is-live" : ""}`}>
        <i aria-hidden="true" />
        {tag}
      </span>
      <span className="live-hours-pill__time">
        {after ? null : <b>Faltan</b>}
        {value}
      </span>
    </div>
  );
}
