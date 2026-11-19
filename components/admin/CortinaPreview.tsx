"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import StreamPlaceholder from "@/components/landing/StreamPlaceholder";
import { CORTINA_VARIANTS } from "@/lib/cortina";

function format(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:36";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function CortinaPreview() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const toggle = async (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (active === index && playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    setActive(index);
    audio.currentTime = 0;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="landing-root">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="mb-6 text-sm text-slate-700">
          Toca play en cada cortina para verla y escucharla. Solo suena una a la vez y la música
          está en loop.
        </p>

        <div className="cortina-list">
          {CORTINA_VARIANTS.map((variant, index) => {
            const isActive = active === index && playing;
            return (
              <article className="cortina-card" key={variant.title}>
                <StreamPlaceholder
                  title={variant.title}
                  message={variant.message}
                  note={variant.note}
                  cta={{ href: "/donar", label: "Donar ahora" }}
                />

                <div className="cortina-controls">
                  <button
                    type="button"
                    className="cortina-play"
                    onClick={() => toggle(index)}
                    aria-label={isActive ? `Pausar cortina ${index + 1}` : `Reproducir cortina ${index + 1}`}
                    aria-pressed={isActive}
                  >
                    {isActive ? (
                      <Pause className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
                    )}
                  </button>

                  <span className="cortina-label">Cortina {index + 1} de 3</span>
                  <span className="cortina-time">{format(duration)} · loop</span>

                  <span className={`cortina-eq${isActive ? " is-playing" : ""}`} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          src="/audio/cortina.mp3"
          loop
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        />
      </div>
    </div>
  );
}
