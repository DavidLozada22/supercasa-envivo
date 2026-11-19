"use client";

import { useState } from "react";

const A = { "data-astro-cid-maqz3d7x": "" } as const;

export default function HouseCompare() {
  const [value, setValue] = useState(50);

  return (
    <figure className="compare card" data-compare {...A}>
      <div className="compare__frame" {...A}>
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
