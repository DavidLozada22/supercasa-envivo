"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import StreamPlaceholder from "./StreamPlaceholder";

const VARIANTS = [
  {
    title: "En breves momentos continúa la transmisión",
    message:
      "Estamos preparando el siguiente momento de la maratón. Mientras tanto, tu aporte sigue construyendo La Supercasa.",
    note: "Cada pieza cuenta.",
  },
  {
    title: "La maratón no se detiene",
    message:
      "Aprovecha este momento para poner tu pieza. Los Super Calvitos te esperan con su casa a medio construir.",
    note: "Dona en menos de un minuto.",
  },
  {
    title: "Seguimos apoyando a los Super Calvitos",
    message:
      "La transmisión vuelve en un momento. Tu aporte hace la diferencia ahora mismo.",
    note: "Ponte la capa.",
  },
];

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
