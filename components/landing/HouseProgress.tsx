"use client";

import { useEffect, useState } from "react";
import styles from "./house-progress.module.css";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function HouseProgress({
  initialRaised,
  initialGoal,
}: {
  initialRaised: number;
  initialGoal: number;
}) {
  const [raised, setRaised] = useState(initialRaised);
  const [goal, setGoal] = useState(initialGoal);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { raised?: number; goal?: number };
        if (!active) return;
        if (typeof data.raised === "number") setRaised(data.raised);
        if (typeof data.goal === "number" && data.goal > 0) setGoal(data.goal);
      } catch {
        // La cifra anterior sigue visible.
      }
    };
    void load();
    const timer = window.setInterval(load, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
  const frame = failed ? 0 : Math.floor(pct / 5) * 5;
  const file = `/img/casa/supercasa-${String(frame).padStart(3, "0")}-1400.webp`;

  return (
    <section className={styles.section} aria-label="Avance de La Supercasa">
      <div className={styles.frame}>
        <img
          src={file}
          width={1400}
          height={1042}
          alt={`La Supercasa con ${frame}% de avance`}
          onError={() => setFailed(true)}
        />
        <span className={styles.badge}>La Supercasa hoy</span>
      </div>

      <div className={styles.stats}>
        <p className={styles.kicker}>Avance de la obra</p>
        <p className={styles.amount}>{cop.format(raised)}</p>
        <p className={styles.goal}>
          de {cop.format(goal)} · {pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%
        </p>
        <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.note}>
          La ilustración cambia cada 5% recaudado. Las cifras se actualizan solas mientras la
          página está abierta.
        </p>
      </div>
    </section>
  );
}
