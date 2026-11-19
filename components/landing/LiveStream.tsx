"use client";

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

  if (snap.state === "after") {
    return (
      <StreamPlaceholder
        title="Gracias por acompañarnos"
        message="La maratón terminó. La campaña sigue abierta hasta el 30 de noviembre."
        note="Puedes seguir donando desde esta misma página."
        cta={{ href: "/donar", label: "Donar ahora" }}
        extra={<LiveHoursPill />}
      />
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
