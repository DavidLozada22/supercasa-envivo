"use client";

import { useRef, useState } from "react";

const A = { "data-astro-cid-maqz3d7x": "" } as const;

export default function HouseCompare() {
  const [value, setValue] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const apply = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setValue(Math.round(pct));
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
    <figure className="compare card" data-compare {...A}>
      <div className="compare__frame" ref={frameRef} {...A}>
        <img
          className="compare__after"
          src="/img/casa/supercasa-100-1400.webp"
          srcSet="/img/casa/supercasa-100-800.webp 800w, /img/casa/supercasa-100-1400.webp 1400w, /img/casa/supercasa-100-2000.webp 2000w"
          sizes="(min-width: 900px) 620px, calc(100vw - 64px)"
          width={2000}
          height={1489}
          alt="Dibujo de la SUPERCASA terminada: edificio de ladrillo con jardín en la azotea, ventanas iluminadas y el letrero La Super Casa."
          loading="lazy"
          decoding="async"
          {...A}
        />

        <div
          className="compare__before"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          {...A}
        >
          <img
            src="/img/casa/supercasa-000-1400.webp"
            srcSet="/img/casa/supercasa-000-800.webp 800w, /img/casa/supercasa-000-1400.webp 1400w, /img/casa/supercasa-000-2000.webp 2000w"
            sizes="(min-width: 900px) 620px, calc(100vw - 64px)"
            width={2000}
            height={1489}
            alt="Obra gris, como está hoy"
            loading="lazy"
            decoding="async"
            {...A}
          />
        </div>

        <span
          className="compare__line"
          style={{ left: `${value}%` }}
          aria-hidden="true"
          {...A}
        />

        <div
          className="compare__handle"
          role="slider"
          tabIndex={0}
          aria-label="Comparar la casa de hoy con la casa terminada"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          style={{ left: `${value}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          {...A}
        >
          <span aria-hidden="true">⇆</span>
        </div>

        <span className="tag tag--before" {...A}>
          Hoy
        </span>
        <span className="tag tag--after" {...A}>
          Así quedará
        </span>
      </div>

      <label className="visually-hidden" htmlFor="compare-range" {...A}>
        Desliza para comparar la obra de hoy con la casa terminada
      </label>
      <input
        id="compare-range"
        className="compare__range"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        {...A}
      />
      <figcaption {...A}>
        Obra gris, como está hoy · Dibujo de la casa terminada
      </figcaption>
    </figure>
  );
}
