"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import StreamPlaceholder from "./StreamPlaceholder";
import { CORTINA_VARIANTS } from "@/lib/cortina";

const VARIANTS = CORTINA_VARIANTS;

export default function CortinaLive() {
  const [variant] = useState(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
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
    <StreamPlaceholder
      title={variant.title}
      message={variant.message}
      note={variant.note}
      cta={{ href: "/donar", label: "Donar ahora" }}
      extra={
        <div className="cortina-audio">
          <audio ref={audioRef} src="/audio/cortina.mp3" loop preload="none" />
          <button type="button" className="cortina-audio__btn" onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause className="h-3.5 w-3.5" strokeWidth={2} /> : <Music className="h-3.5 w-3.5" strokeWidth={2} />}
            {playing ? "Pausar música" : "Activar música"}
          </button>
        </div>
      }
    />
  );
}
