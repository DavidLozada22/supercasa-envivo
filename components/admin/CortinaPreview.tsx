"use client";

import { useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import StreamPlaceholder from "@/components/landing/StreamPlaceholder";
import { CORTINA_VARIANTS } from "@/lib/cortina";

export default function CortinaPreview() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

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
    <div className="landing-root">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" className="cortina-audio__btn" onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause className="h-3.5 w-3.5" strokeWidth={2} /> : <Music className="h-3.5 w-3.5" strokeWidth={2} />}
            {playing ? "Pausar música" : "Activar música"}
          </button>
          <audio ref={audioRef} src="/audio/cortina.mp3" loop preload="none" />
          <p className="text-sm text-slate-600">
            Se muestra una variante al azar en cada carga del live.
          </p>
        </div>

        <div className="space-y-8">
          {CORTINA_VARIANTS.map((variant, index) => (
            <div key={variant.title}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Variante {index + 1} de {CORTINA_VARIANTS.length}
              </p>
              <StreamPlaceholder
                title={variant.title}
                message={variant.message}
                note={variant.note}
                cta={{ href: "/donar", label: "Donar ahora" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
