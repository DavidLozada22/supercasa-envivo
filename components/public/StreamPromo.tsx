"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";

export default function StreamPromo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="stream-promo" aria-labelledby="stream-promo-title">
      <button
        type="button"
        className="stream-promo__media"
        onClick={() => setOpen(true)}
        aria-label="Ver el video de La Supercasa"
      >
        <img src="/video/promo-poster.jpg" alt="" />
        <span className="stream-promo__play" aria-hidden="true">
          <Play className="h-6 w-6" strokeWidth={2} fill="currentColor" />
        </span>
        <span className="stream-promo__badge">1:35</span>
      </button>

      <div className="stream-promo__copy">
        <p className="stream-promo__kicker">Conoce La Supercasa</p>
        <h2 id="stream-promo-title">Mira de qué se trata</h2>
        <p>
          En un minuto y medio te contamos qué es La Supercasa, a quién ayuda y por qué tu aporte
          puede cambiarlo todo este diciembre.
        </p>
        <button type="button" className="stream-promo__cta" onClick={() => setOpen(true)}>
          <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
          Ver el video
        </button>
      </div>

      {open ? (
        <VideoModal onClose={() => setOpen(false)} label="Conoce La Supercasa" />
      ) : null}
    </section>
  );
}
