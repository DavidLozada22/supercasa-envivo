"use client";

import { useEffect, useRef, useState } from "react";
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
  const [value, setValue] = useState(55);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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

  const apply = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setValue(Math.round(next));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    apply(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) apply(event.clientX);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // El puntero pudo liberarse antes.
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setValue((current) => Math.max(0, current - 5));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setValue((current) => Math.min(100, current + 5));
    }
  };

  return (
    <section className={styles.section} aria-label="Avance de La Supercasa">
      <figure className={styles.compare}>
        <div
          className={styles.frame}
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <img
            className={styles.after}
            src="/img/casa/supercasa-100-1400.webp"
            srcSet="/img/casa/supercasa-100-800.webp 800w, /img/casa/supercasa-100-1400.webp 1400w, /img/casa/supercasa-100-2000.webp 2000w"
            sizes="(min-width: 900px) 560px, calc(100vw - 48px)"
            width={2000}
            height={1489}
            alt="La Supercasa terminada, con jardín en la azotea y las ventanas iluminadas"
            loading="lazy"
            decoding="async"
          />

          <div className={styles.before} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
            <img
              src="/img/casa/supercasa-000-1400.webp"
              srcSet="/img/casa/supercasa-000-800.webp 800w, /img/casa/supercasa-000-1400.webp 1400w, /img/casa/supercasa-000-2000.webp 2000w"
              sizes="(min-width: 900px) 560px, calc(100vw - 48px)"
              width={2000}
              height={1489}
              alt="Obra gris, como está hoy"
              loading="lazy"
              decoding="async"
            />
          </div>

          <span className={styles.line} style={{ left: `${value}%` }} aria-hidden="true" />

          <div
            className={styles.handle}
            role="slider"
            tabIndex={0}
            aria-label="Comparar la casa de hoy con la casa terminada"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            style={{ left: `${value}%` }}
            onKeyDown={onKeyDown}
          >
            <span aria-hidden="true">⇆</span>
          </div>

          <span className={`${styles.tag} ${styles.tagBefore}`}>Hoy</span>
          <span className={`${styles.tag} ${styles.tagAfter}`}>Así quedará</span>
        </div>

        <input
          className={styles.range}
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="Desliza para comparar la obra de hoy con la casa terminada"
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </figure>

      <div className={styles.stats}>
        <p className={styles.kicker}>Llevamos</p>
        <p className={styles.amount}>{cop.format(raised)}</p>
        <div
          className={styles.track}
          role="progressbar"
          aria-label={`Llevamos ${cop.format(raised)} recaudados`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${cop.format(raised)} recaudados`}
        >
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.note}>
          Desliza la casa para ver cómo está hoy y cómo quedará. La cifra se actualiza sola
          mientras la página está abierta.
        </p>
      </div>
    </section>
  );
}
