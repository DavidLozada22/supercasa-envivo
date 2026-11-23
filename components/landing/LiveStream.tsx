"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LiveSnapshot } from "@/lib/youtube/live";
import CortinaLive from "./CortinaLive";
import LiveHoursPill from "./LiveHoursPill";
import Player from "./MaskedPlayer";
import StreamPlaceholder from "./StreamPlaceholder";

export default function LiveStream({
  initial,
  embedUrl,
}: {
  initial: LiveSnapshot;
  embedUrl: string;
}) {
  const [snap, setSnap] = useState<LiveSnapshot>(initial);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        const response = await fetch("/api/live/current", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as LiveSnapshot;
        if (alive) setSnap(body);
      } catch {
        // Se conserva el ultimo estado valido.
      }
    };

    const id = setInterval(tick, 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (snap.state === "before") {
    return (
      <StreamPlaceholder
        title="El viernes 20 empieza la maratón"
        message="A las 6:00 p. m., hora de Bogotá, arrancan 48 horas por La Supercasa. Guarda este enlace y acompáñanos."
        note="Tu aporte construye la casa de los Super Calvitos."
        cta={{ href: "/donar", label: "Donar ahora" }}
        extra={<LiveHoursPill />}
      />
    );
  }

  // Cuando termina el directo no se despide: se deja el último video
  // reproducible para que la gente vea la transmisión completa.
  if (snap.state === "after") {
    if (!snap.videoId) {
      return (
        <div className="live-player-wrap">
          <CortinaLive />
        </div>
      );
    }
    const params = new URLSearchParams({
      autoplay: "0",
      controls: "1",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });
    return (
      <div className="live-player-wrap live-replay">
        <div className="live-replay__frame">
          <iframe
            src={`https://www.youtube.com/embed/${snap.videoId}?${params.toString()}`}
            title="Última transmisión de La Supercasa"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
          <span className="live-replay__badge">Última transmisión</span>
        </div>
        <div className="live-replay__foot">
          <p>
            Dale play para ver la última transmisión completa. La campaña sigue abierta hasta el
            30 de noviembre.
          </p>
          <Link href="/donar" className="live-replay__cta">
            Donar ahora
          </Link>
        </div>
      </div>
    );
  }

  if (!snap.live || !snap.videoId) {
    return (
      <div className="live-player-wrap">
        <CortinaLive />
        <LiveHoursPill compact />
      </div>
    );
  }

  return (
    <div className="live-player-wrap">
      <Player
        key={snap.videoId}
        videoId={snap.videoId}
        embedUrl={embedUrl}
        title="Súper Navidad: 48 Horas por la Supercasa"
      />
      <LiveHoursPill compact />
    </div>
  );
}
