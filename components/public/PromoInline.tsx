"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export default function PromoInline() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  const openVideo = () => {
    setOpen(true);
    window.setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      video.muted = false;
      video.play().catch(() => undefined);
    }, 40);
  };

  const stop = () => {
    const video = videoRef.current;
    if (video) video.pause();
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="promo-inline__open" onClick={openVideo}>
        <Play className="h-4 w-4" strokeWidth={2} fill="currentColor" />
        Mira de qué se trata · 1:35
      </button>
    );
  }

  return (
    <div className="promo-inline">
      <video
        ref={videoRef}
        className="promo-inline__video"
        poster="/video/promo-poster.jpg"
        controls
        autoPlay
        playsInline
        preload="metadata"
        onEnded={stop}
        aria-label="Video: de qué se trata La Supercasa"
      >
        <source src="/video/promo-supercasa.mp4" type="video/mp4" />
        <track
          kind="captions"
          src="/video/promo-supercasa.es.vtt"
          srcLang="es"
          label="Español"
          default
        />
      </video>
      <button type="button" className="promo-inline__close" onClick={stop}>
        Volver a la espera
      </button>
    </div>
  );
}
