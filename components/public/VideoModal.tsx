"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { VideoCaption, useVideoCaption } from "./VideoCaption";

export default function VideoModal({
  onClose,
  label,
}: {
  onClose: () => void;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const caption = useVideoCaption(videoRef);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => undefined);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      video?.pause();
    };
  }, [onClose]);

  return (
    <div
      className="video-modal"
      role="dialog"
      aria-modal="true"
      aria-label={label ?? "Video de La Supercasa"}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="video-modal__panel">
        <button type="button" className="video-modal__close" onClick={onClose} aria-label="Cerrar video">
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="video-modal__stage">
          <video
            ref={videoRef}
            className="video-modal__video"
            poster="/video/promo-poster.jpg"
            controls
            playsInline
            preload="metadata"
            aria-label="Video: de qué se trata La Supercasa y por qué necesitamos tu ayuda"
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
        </div>
        <div className="video-modal__captions">
          <VideoCaption text={caption} />
        </div>
      </div>
    </div>
  );
}
