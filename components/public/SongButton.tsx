"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import { SONG } from "@/lib/song";

export default function SongButton({
  autoPlay = false,
  compact = false,
}: {
  autoPlay?: boolean;
  compact?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [autoPlay]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <span className={`song-button${compact ? " song-button--compact" : ""}`}>
      <audio ref={audioRef} src={SONG.src} loop preload="none" />
      <button
        type="button"
        className="song-button__btn"
        onClick={toggle}
        aria-pressed={playing}
      >
        {playing ? (
          <Pause className="h-[16px] w-[16px]" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Music className="h-[16px] w-[16px]" strokeWidth={2} aria-hidden="true" />
        )}
        {playing ? "Pausar la canción" : "Escuchar la canción"}
      </button>
    </span>
  );
}
