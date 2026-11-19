"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const START = new Date("2026-11-20T18:00:00-05:00").getTime();
const END = new Date("2026-11-22T18:00:00-05:00").getTime();
const FORCE_LIVE = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";

export default function HeroPromo({ forceLive }: { forceLive?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [live, setLive] = useState(Boolean(forceLive) || FORCE_LIVE);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    setLive(Boolean(forceLive) || FORCE_LIVE || (now >= START && now <= END));
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setSrc(
      window.matchMedia("(max-width: 760px)").matches
        ? "/video/promo-supercasa-mobile.mp4"
        : "/video/promo-supercasa.mp4",
    );
  }, [forceLive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const showCaptions = () => {
      const track = video.textTracks?.[0];
      if (track) track.mode = "showing";
    };
    showCaptions();
    video.addEventListener("loadedmetadata", showCaptions);

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const slow = connection?.saveData || connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "3g";

    if (reduced || slow) {
      video.pause();
      setPlaying(false);
      return () => video.removeEventListener("loadedmetadata", showCaptions);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
          } else {
            video.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", showCaptions);
    };
  }, [src, reduced]);

  if (live) return null;

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="hero-promo">
      <video
        ref={videoRef}
        className="hero-promo__video"
        src={src ?? undefined}
        poster="/video/promo-poster.jpg"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Video: de qué se trata La Supercasa y por qué necesitamos tu ayuda"
      >
        <track
          kind="captions"
          src="/video/promo-supercasa.es.vtt"
          srcLang="es"
          label="Español"
          default
        />
      </video>

      {!playing ? (
        <button type="button" className="hero-promo__center" onClick={togglePlay} aria-label="Reproducir el video">
          <Play className="h-6 w-6" strokeWidth={2} fill="currentColor" />
        </button>
      ) : null}

      <div className="hero-promo__controls">
        <button
          type="button"
          className="hero-promo__sound"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Activar el sonido del video" : "Silenciar el video"}
        >
          {muted ? <VolumeX className="h-4 w-4" strokeWidth={2} /> : <Volume2 className="h-4 w-4" strokeWidth={2} />}
          {muted ? "Activar sonido" : "Silenciar"}
        </button>
        <button
          type="button"
          className="hero-promo__icon"
          onClick={togglePlay}
          aria-label={playing ? "Pausar el video" : "Reproducir el video"}
        >
          {playing ? <Pause className="h-4 w-4" strokeWidth={2} /> : <Play className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}
