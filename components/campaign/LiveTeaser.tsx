"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

const START = new Date("2026-11-20T18:00:00-05:00").getTime();
const END = new Date("2026-11-22T18:00:00-05:00").getTime();
const PREVIEW = process.env.NEXT_PUBLIC_HEADER_LIVE === "1";

export default function LiveTeaser() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const live = PREVIEW || (now !== null && now >= START && now <= END);
  if (!live) return null;

  return (
    <section className="live-teaser" aria-labelledby="live-teaser-title">
      <div className="wrap">
        <div className="live-teaser__card card">
          <div className="live-teaser__screen" aria-hidden="true">
            <div className="live-teaser__logos">
              <span className="live-teaser__logo-card">
                <img src="/img/logo-fsv-official.png" alt="" />
              </span>
              <span className="live-teaser__cross">×</span>
              <img className="live-teaser__kavanah" src="/img/kavanah-horizontal-gold.png" alt="" />
            </div>
            <span className="live-teaser__badge">
              <i aria-hidden="true" />
              En vivo
            </span>
            <p className="live-teaser__screen-title">48 horas por La Supercasa</p>
          </div>

          <div className="live-teaser__copy">
            <p className="live-teaser__kicker">Ahora mismo</p>
            <h2 id="live-teaser-title">Estamos en vivo</h2>
            <p className="live-teaser__lead">
              La maratón ya arrancó. Entra, mira lo que está pasando y pon tu pieza mientras los
              Super Calvitos siguen construyendo su casa.
            </p>

            <div className="live-teaser__actions">
              <Link href="/envivo" className="btn btn--primary btn--xl live-teaser__cta">
                <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" />
                Ver la transmisión
              </Link>
              <Link href="/donar" className="btn btn--white">
                Donar ahora
              </Link>
            </div>

            <p className="live-teaser__note">48 horas seguidas · hora de Bogotá</p>
          </div>
        </div>
      </div>
    </section>
  );
}
