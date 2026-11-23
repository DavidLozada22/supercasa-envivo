"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import ThanksScene from "@/components/landing/ThanksScene";

const START = new Date("2026-11-20T18:00:00-05:00").getTime();
const END = new Date("2026-11-22T18:00:00-05:00").getTime();
const PREVIEW = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";

type Snapshot = {
  state: "before" | "live" | "after";
  live?: boolean;
  videoId?: string | null;
};

export default function HeroLiveOverlay({ forceLive }: { forceLive?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  // El mismo estado que usa /donar: así el home muestra la señal real y no
  // solo una tarjeta con el botón.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/live/current", { cache: "no-store" });
        if (!response.ok) throw new Error("sin estado");
        const body = (await response.json()) as Snapshot;
        if (alive) {
          setSnap(body);
          setFailed(false);
        }
      } catch {
        if (alive) setFailed(true);
      }
    };
    void load();
    const id = window.setInterval(load, 30000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const byClock = forceLive || PREVIEW || (now !== null && now >= START && now <= END);
  const live = snap ? snap.state === "live" : failed ? byClock : false;
  const after = snap?.state === "after";
  const videoId = snap?.videoId ?? null;

  // Terminado el directo, el hero muestra el cierre y la campaña.
  if (after) {
    return (
      <div className="hero-live hero-live--after">
        <ThanksScene variant="mini" />
      </div>
    );
  }

  if (!live) return null;

  if (videoId) {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });

    return (
      <div className="hero-live hero-live--video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title="Transmisión en vivo de La Supercasa"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
        <span className="hero-live__badge">
          <i aria-hidden="true" />
          En vivo
        </span>
        <Link href="/envivo" className="hero-live__cta hero-live__cta--float">
          <Play className="h-4 w-4" strokeWidth={2} fill="currentColor" />
          Ver la transmisión
        </Link>
      </div>
    );
  }

  return (
    <div className="hero-live">
      <div className="hero-live__logos">
        <span className="hero-live__logo-card">
          <img src="/img/logo-fsv-official.png" alt="" />
        </span>
        <span className="hero-live__cross" aria-hidden="true">×</span>
        <img className="hero-live__kavanah" src="/img/kavanah-horizontal-gold.png" alt="" />
      </div>

      <span className="hero-live__badge">
        <i aria-hidden="true" />
        En vivo
      </span>

      <p className="hero-live__title">48 horas por La Supercasa</p>

      <Link href="/envivo" className="hero-live__cta">
        <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
        Ver la transmisión
      </Link>

      <p className="hero-live__note">Estamos al aire · hora de Bogotá</p>
    </div>
  );
}
