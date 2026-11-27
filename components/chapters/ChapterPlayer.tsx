"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

export default function ChapterPlayer({
  provider,
  src,
  poster,
  title,
  externalUrl,
  externalLabel,
  durationLabel,
}: {
  provider: "drive" | "file";
  src: string;
  poster: string;
  title: string;
  externalUrl: string;
  externalLabel: string;
  durationLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="chapter-player">
      {playing ? (
        provider === "drive" ? (
          <iframe
            className="chapter-player__frame"
            src={src}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="chapter-player__frame"
            src={src}
            poster={poster || undefined}
            controls
            autoPlay
            playsInline
          >
            Tu navegador no puede reproducir este video.
          </video>
        )
      ) : (
        <button
          type="button"
          className="chapter-player__poster"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir ${title}`}
        >
          {poster ? <img src={poster} alt="" /> : null}
          <span className="chapter-player__shade" aria-hidden="true" />
          <span className="chapter-player__play" aria-hidden="true">
            <Play className="h-7 w-7" strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="chapter-player__time">{durationLabel}</span>
        </button>
      )}

      <a
        className="chapter-player__fallback"
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {externalLabel}
      </a>
    </div>
  );
}
