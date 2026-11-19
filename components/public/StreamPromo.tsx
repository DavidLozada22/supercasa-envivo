"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";
import { VideoCaption, useVideoCaption } from "./VideoCaption";

export default function StreamPromo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const caption = useVideoCaption(videoRef);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    const video = videoRef.current;
    if (!video || prefersReduced) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const openModal = () => {
    videoRef.current?.pause();
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    if (!reduced) videoRef.current?.play().catch(() => undefined);
  };

  return (
    <section className="stream-promo" aria-labelledby="stream-promo-title">
      <div className="stream-promo__media">
        <video
          ref={videoRef}
          className="stream-promo__video"
          poster="/video/promo-poster.jpg"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/video/promo-supercasa-mobile.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/video/promo-supercasa.es.vtt"
            srcLang="es"
            label="Español"
            default
          />
        </video>

        <VideoCaption text={caption} />

        <button
          type="button"
          className="stream-promo__hit"
          onClick={openModal}
          aria-label="Ver el video con sonido"
        >
          <span className="stream-promo__play" aria-hidden="true">
            <Play className="h-6 w-6" strokeWidth={2} fill="currentColor" />
          </span>
        </button>

        <span className="stream-promo__badge">1:35</span>
      </div>

      <div className="stream-promo__copy">
        <p className="stream-promo__kicker">Conoce La Supercasa</p>
        <h2 id="stream-promo-title">Mira de qué se trata</h2>
        <p>
          En un minuto y medio te contamos qué es La Supercasa, a quién ayuda y por qué tu aporte
          puede cambiarlo todo este diciembre.
        </p>
        <button type="button" className="stream-promo__cta" onClick={openModal}>
          <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
          Ver el video
        </button>
      </div>

      {open ? <VideoModal onClose={closeModal} label="Conoce La Supercasa" /> : null}
    </section>
  );
}
