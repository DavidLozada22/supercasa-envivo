"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
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
            setPlaying(event.data === window.YT.PlayerState.PLAYING);
            setMuted(Boolean(event.target.isMuted?.()));
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
