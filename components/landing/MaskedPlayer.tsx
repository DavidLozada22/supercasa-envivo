"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Radio, Volume2, VolumeX } from "lucide-react";
import styles from "./masked-player.module.css";
import CortinaLive from "./CortinaLive";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYER_ID = "supercasa-yt-player";

function MaskedPlayer({ videoId, title }: { videoId: string; title: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [behind, setBehind] = useState(false);
  const pausedSince = useRef(0);
  const hasPlayed = useRef(false);
  const syncingUntil = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(PLAYER_ID, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          autoplay: 1,
          mute: 1,
          iv_load_policy: 3,
          fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) hasPlayed.current = true;
            setPlaying(state === window.YT.PlayerState.PLAYING);
            setMuted(Boolean(event.target.isMuted?.()));
            if (state === window.YT.PlayerState.PAUSED) {
              if (!pausedSince.current) pausedSince.current = Date.now();
            } else {
              pausedSince.current = 0;
            }
          },
          onError: () => setUnavailable(true),
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-iframe-api")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [videoId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getDuration || !hasPlayed.current) return;
      if (Date.now() < syncingUntil.current) {
        setBehind(false);
        return;
      }
      if (pausedSince.current && Date.now() - pausedSince.current > 12_000) {
        setBehind(true);
        return;
      }
      const duration = Number(player.getDuration?.() ?? 0);
      const current = Number(player.getCurrentTime?.() ?? 0);
      const gap = Number.isFinite(duration) && Number.isFinite(current) ? duration - current : 0;
      stageRef.current?.setAttribute("data-live-gap", String(Math.max(0, Math.round(gap))));
      stageRef.current?.setAttribute("data-live-current", String(Math.round(current)));
      stageRef.current?.setAttribute("data-live-duration", String(Math.round(duration)));
      stageRef.current?.setAttribute("data-live-state", String(player.getPlayerState?.() ?? ""));
      if (Number.isFinite(duration) && duration > 0) {
        setBehind(gap > 12);
      } else {
        setBehind(false);
      }
    }, 2_000);
    return () => window.clearInterval(timer);
  }, []);

  const goLive = () => {
    const player = playerRef.current;
    if (!player) return;

    pausedSince.current = 0;
    syncingUntil.current = Date.now() + 3_500;
    setBehind(false);

    const seek = () => {
      const duration = Number(player.getDuration?.() ?? 0);
      if (duration > 0) player.seekTo(duration, true);
      player.playVideo?.();
    };

    // En pausa, getDuration queda congelado en el momento de la pausa. Hay que
    // reanudar primero y buscar el borde cuando la duracion ya se actualizo.
    const state = Number(player.getPlayerState?.() ?? -1);
    if (state === 2 || state === 5 || state === -1) {
      player.playVideo?.();
      window.setTimeout(seek, 900);
    } else {
      seek();
    }

    window.setTimeout(() => {
      const current = playerRef.current;
      if (!current) return;
      const duration = Number(current.getDuration?.() ?? 0);
      const position = Number(current.getCurrentTime?.() ?? 0);
      if (duration - position > 10) current.seekTo?.(duration, true);
    }, 2_000);
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      player.setVolume(100);
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const fullscreen = () => {
    const node = stageRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen?.();
  };

  if (unavailable) {
    return <CortinaLive />;
  }

  return (
    <div className={styles.stage} ref={stageRef}>
      <div id={PLAYER_ID} className={styles.frame} />

      {/* Bloquea cualquier clic o toque que intente abrir YouTube. */}
      <div className={styles.shield} aria-hidden="true" />

      <div className={styles.topMask} aria-hidden="true" />
      <div className={styles.bottomMask} aria-hidden="true" />

      <div className={styles.badge}>
        <span className={styles.dot} />
        En vivo
      </div>

      <div className={styles.cornerMask} aria-hidden="true">
        Súper Navidad
      </div>

      {behind ? (
        <button
          type="button"
          className={styles.goLive}
          onClick={goLive}
          aria-label="Ir al momento en vivo de la transmisión"
          title="Saltar al último segundo del directo"
        >
          <Radio className="h-3.5 w-3.5" strokeWidth={2} />
          Ir al vivo
        </button>
      ) : null}

      {!playing ? (
        <button type="button" className={styles.centerPlay} onClick={togglePlay} aria-label="Reproducir">
          <Play className="h-7 w-7" strokeWidth={2} fill="currentColor" />
        </button>
      ) : null}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? (
            <Pause className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={2} />
          )}
        </button>

        <button
          type="button"
          className={styles.control}
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? (
            <VolumeX className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Volume2 className="h-5 w-5" strokeWidth={2} />
          )}
        </button>

        <span className={styles.titleText}>{title}</span>

        <button
          type="button"
          className={styles.control}
          onClick={goLive}
          aria-label="Ir al momento en vivo"
          title="Ir al momento en vivo"
        >
          <Radio className="h-5 w-5" strokeWidth={2} />
        </button>

        <button
          type="button"
          className={styles.control}
          onClick={fullscreen}
          aria-label="Pantalla completa"
        >
          <Maximize className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default function Player({
  videoId,
  embedUrl,
  title,
}: {
  videoId?: string;
  embedUrl: string;
  title: string;
}) {
  if (!videoId) {
    return <CortinaLive />;
  }
  return <MaskedPlayer videoId={videoId} title={title} />;
}
