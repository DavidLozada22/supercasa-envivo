"use client";

import { useEffect, useState } from "react";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";

export default function LiveHoursPill({ compact = false }: { compact?: boolean }) {
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
  const after = now >= end;
  const during = now >= start && now < end;

  const hoursLive = Math.floor(elapsed / 3_600_000);
  const hoursLeft = Math.ceil(remaining / 3_600_000);
  const hoursToStart = Math.max(0, Math.ceil((start - now) / 3_600_000));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const number = before ? hoursToStart : after ? EVENT_HOURS : hoursLive;
  const left = before
    ? `PARA EMPEZAR`
    : after
      ? "CAMPAÑA ABIERTA"
      : hoursLeft > 0
        ? `FALTAN ${hoursLeft} H`
        : "ÚLTIMA HORA";
  const tag = before ? "FALTA POCO" : after ? "GRACIAS" : "EN VIVO";

  return (
    <div className={`live-hours-pill${compact ? " is-compact" : ""}`}>
      <span className={`live-hours-pill__tag${during ? " is-live" : ""}`}>
        <i aria-hidden="true" />
        {tag}
      </span>
      <div className="live-hours-pill__row">
        <strong>
          {number}
          <small>{before ? "h" : `/${EVENT_HOURS}`}</small>
        </strong>
        <span>{before ? "PARA EMPEZAR" : left}</span>
      </div>
      <div className="live-hours-pill__bar" aria-hidden="true">
        <span style={{ width: `${pct.toFixed(2)}%` }} />
      </div>
    </div>
  );
}
