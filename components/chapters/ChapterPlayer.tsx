"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatDuration } from "@/lib/chapters/format";

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return formatDuration(seconds);
}

export default function ChapterPlayer({
  slug,
  provider,
  videoUrl,
  poster,
  title,
  durationSeconds,
}: {
  slug: string;
  provider: "drive" | "file";
  videoUrl: string;
  poster: string;
  title: string;
  durationSeconds: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFile = provider === "file" && Boolean(videoUrl);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fauxFull, setFauxFull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [legacySrc, setLegacySrc] = useState("");
  const [legacyLoading, setLegacyLoading] = useState(false);
  const [legacyError, setLegacyError] = useState("");

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const start = async () => {
    containerRef.current?.focus();

    if (!isFile) {
      setStarted(true);
      setLegacyLoading(true);
      setLegacyError("");
      try {
        const response = await fetch(`/api/chapters/embed/${slug}`, { cache: "no-store" });
        const data = (await response.json()) as { src?: string; error?: string };
        if (!response.ok || !data.src) {
          setLegacyError(data.error ?? "No se pudo cargar el video.");
          return;
        }
        setLegacySrc(data.src);
      } catch {
        setLegacyError("No se pudo cargar el video. Revisa la conexión.");
      } finally {
        setLegacyLoading(false);
      }
      return;
    }

    setStarted(true);
    setError("");
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
    } catch {
      setError("No se pudo iniciar el video. Toca de nuevo para reproducir.");
    }
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setError("No se pudo iniciar el video."));
    } else {
      video.pause();
    }
  };

  const seekBy = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const max = Number.isFinite(video.duration) ? video.duration : duration;
    video.currentTime = Math.max(0, Math.min(max, video.currentTime + delta));
    setCurrent(video.currentTime);
  };

  const onSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    video.currentTime = value;
    setCurrent(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const onVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    video.volume = value / 100;
    if (value > 0 && video.muted) video.muted = false;
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }

    if (fauxFull) {
      setFauxFull(false);
      return;
    }

    if (container?.requestFullscreen) {
      try {
        await container.requestFullscreen();
        return;
      } catch {
        // Algunos navegadores móviles no permiten pantalla completa sobre un div.
      }
    }

    const iosVideo = video as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (iosVideo?.webkitEnterFullscreen) {
      try {
        iosVideo.webkitEnterFullscreen();
        return;
      } catch {
        // Si el modo nativo falla, se usa la capa fija.
      }
    }

    setFauxFull(true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      toggle();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      seekBy(-10);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seekBy(10);
    } else if (event.key === "m") {
      toggleMute();
    } else if (event.key === "f") {
      void toggleFullscreen();
    } else if (event.key === "Escape" && fauxFull) {
      setFauxFull(false);
    }
  };

  const retry = () => {
    const video = videoRef.current;
    setError("");
    if (!video) return;
    video.load();
    void video.play().catch(() => setError("No se pudo iniciar el video."));
  };

  return (
    <div
      ref={containerRef}
      className={`chapter-player${fullscreen ? " is-fullscreen" : ""}${
        fauxFull ? " is-faux-fullscreen" : ""
      }`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Reproductor de ${title}`}
    >
      {fauxFull ? (
        <button
          type="button"
          className="chapter-player__exit"
          onClick={() => setFauxFull(false)}
          aria-label="Salir de pantalla completa"
        >
          <Minimize className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          Salir
        </button>
      ) : null}
      {isFile ? (
        <video
          ref={videoRef}
          className="chapter-player__video"
          src={videoUrl}
          poster={poster || undefined}
          preload="metadata"
          playsInline
          onClick={() => {
            containerRef.current?.focus();
            toggle();
          }}
          onPlay={() => {
            setStarted(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (Number.isFinite(video.duration)) setDuration(video.duration);
            setVolume(Math.round(video.volume * 100));
            setMuted(video.muted);
          }}
          onVolumeChange={(event) => {
            setVolume(Math.round(event.currentTarget.volume * 100));
            setMuted(event.currentTarget.muted);
          }}
          onWaiting={() => setLoading(true)}
          onStalled={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onPlaying={() => setLoading(false)}
          onError={() => setError("No se pudo cargar el video. Revisa la conexión.")}
        >
          Tu navegador no puede reproducir este video.
        </video>
      ) : legacySrc ? (
        <>
          <iframe
            className="chapter-player__frame"
            src={legacySrc}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <span className="chapter-player__mask" aria-hidden="true">
            <img
              className="chapter-player__mask-fsv"
              src="/img/logo-fsv-official.png"
              alt=""
            />
            <span className="chapter-player__mask-cross">×</span>
            <img
              className="chapter-player__mask-kavanah"
              src="/img/kavanah-horizontal-gold.png"
              alt=""
            />
          </span>
        </>
      ) : null}

      {!started ? (
        <button
          type="button"
          className="chapter-player__overlay"
          onClick={() => void start()}
          aria-label={`Reproducir ${title}`}
        >
          {poster ? <img src={poster} alt="" /> : null}
          <span className="chapter-player__shade" aria-hidden="true" />
          <span className="chapter-player__play" aria-hidden="true">
            <Play className="h-7 w-7" strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="chapter-player__time">{formatDuration(durationSeconds)}</span>
        </button>
      ) : null}

      {isFile && loading ? (
        <div className="chapter-player__loading" role="status">
          <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} aria-hidden="true" />
          Cargando video
        </div>
      ) : null}

      {isFile && error ? (
        <div className="chapter-player__error" role="status">
          <p>{error}</p>
          <button type="button" className="chapter-player__retry" onClick={retry}>
            Reintentar
          </button>
        </div>
      ) : null}

      {!isFile && started && !legacySrc ? (
        <div className="chapter-player__loading" role="status">
          {legacyError ? (
            <p>{legacyError}</p>
          ) : (
            <>
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} aria-hidden="true" />
              {legacyLoading ? "Cargando video" : "Preparando el video"}
            </>
          )}
        </div>
      ) : null}

      {isFile && started && !error ? (
        <div className="chapter-player__controls">
          <button
            type="button"
            className="chapter-player__control"
            onClick={toggle}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            {playing ? (
              <Pause className="h-5 w-5" strokeWidth={2.2} fill="currentColor" />
            ) : (
              <Play className="h-5 w-5" strokeWidth={2.2} fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            className="chapter-player__control"
            onClick={() => seekBy(-10)}
            aria-label="Retroceder 10 segundos"
          >
            <RotateCcw className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="chapter-player__control-label">10</span>
          </button>

          <button
            type="button"
            className="chapter-player__control"
            onClick={() => seekBy(10)}
            aria-label="Adelantar 10 segundos"
          >
            <RotateCw className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="chapter-player__control-label">10</span>
          </button>

          <span className="chapter-player__timecode">
            {clock(current)} / {clock(duration || durationSeconds)}
          </span>

          <input
            className="chapter-player__seek"
            type="range"
            min="0"
            max={duration || durationSeconds || 0}
            step="0.1"
            value={Math.min(current, duration || durationSeconds || 0)}
            onChange={onSeek}
            aria-label="Posición del video"
          />

          <div className="chapter-player__volume">
            <button
              type="button"
              className="chapter-player__control"
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-[18px] w-[18px]" strokeWidth={2.2} />
              ) : volume < 50 ? (
                <Volume1 className="h-[18px] w-[18px]" strokeWidth={2.2} />
              ) : (
                <Volume2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
              )}
            </button>
            <input
              className="chapter-player__volume-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={muted ? 0 : volume}
              onChange={onVolume}
              aria-label="Volumen"
            />
          </div>

          <button
            type="button"
            className="chapter-player__control"
            onClick={() => void toggleFullscreen()}
            aria-label={fullscreen || fauxFull ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {fullscreen || fauxFull ? (
              <Minimize className="h-[18px] w-[18px]" strokeWidth={2.2} />
            ) : (
              <Maximize className="h-[18px] w-[18px]" strokeWidth={2.2} />
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
