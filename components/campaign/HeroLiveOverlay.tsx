"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

const START = new Date("2026-11-20T18:00:00-05:00").getTime();
const END = new Date("2026-11-22T18:00:00-05:00").getTime();
const PREVIEW = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";

export default function HeroLiveOverlay({ forceLive }: { forceLive?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const live = forceLive || PREVIEW || (now !== null && now >= START && now <= END);
  if (!live) return null;

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
