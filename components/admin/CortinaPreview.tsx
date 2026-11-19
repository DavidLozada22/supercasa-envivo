"use client";

import { useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import StreamPlaceholder from "@/components/landing/StreamPlaceholder";
import { CORTINA_VARIANTS } from "@/lib/cortina";

export default function CortinaPreview() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

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
          <button type="button" className="btn btn--primary" onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause className="h-4 w-4" strokeWidth={2} /> : <Music className="h-4 w-4" strokeWidth={2} />}
            {playing ? "Pausar cortina" : "Reproducir cortina"}
          </button>
          <audio
            ref={audioRef}
            src="/audio/cortina.mp3"
            loop
            preload="metadata"
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          />
          <span className="text-sm font-semibold text-slate-600">
            {duration > 0
              ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")} · en loop`
              : "En loop"}
          </span>
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
