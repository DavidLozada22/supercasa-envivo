import Link from "next/link";
import { CalendarClock, HeartHandshake, Radio } from "lucide-react";
import DonationQR from "@/components/landing/DonationQR";
import Player from "@/components/landing/MaskedPlayer";
import type { PublicConfig } from "@/lib/types";

const START = new Date("2026-11-20T18:00:00-05:00");
const END = new Date("2026-11-22T18:00:00-05:00");

function state(): "before" | "live" | "after" {
  if (process.env.NEXT_PUBLIC_LIVE_PREVIEW === "1") return "live";
  const now = new Date();
  if (now < START) return "before";
  if (now > END) return "after";
  return "live";
}

function countdown(): string {
  const diff = START.getTime() - Date.now();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days === 1) return `Falta 1 día y ${hours} horas`;
  if (days > 1) return `Faltan ${days} días y ${hours} horas`;
  return `Faltan ${Math.max(1, hours)} horas`;
}

export default function LiveStage({ stream }: { stream: PublicConfig["stream"] }) {
  const current = state();

  return (
    <div className="live-stage">
      <div className="live-stage__frame">
        {current === "live" ? (
          <Player
            videoId={stream.videoId}
            embedUrl={stream.embedUrl}
            title="Súper Navidad: 48 horas por La Supercasa"
          />
        ) : (
          <div className="live-stage__standby">
            <span className="live-stage__icon">
              {current === "before" ? (
                <CalendarClock className="h-7 w-7" strokeWidth={1.75} />
              ) : (
                <Radio className="h-7 w-7" strokeWidth={1.75} />
              )}
            </span>
            <p className="live-stage__eyebrow">
              {current === "before" ? "Transmisión especial" : "Transmisión finalizada"}
            </p>
            <p className="live-stage__title">
              {current === "before"
                ? "El live empieza el viernes 20 de noviembre"
                : "Gracias por acompañarnos"}
            </p>
            <p className="live-stage__note">
              {current === "before"
                ? `${countdown()} · 6:00 p. m. a 6:00 p. m. del domingo 22`
                : "La campaña sigue abierta hasta el 30 de noviembre."}
            </p>
          </div>
        )}

        <span className="live-stage__badge">
          <span className="live-stage__dot" />
          {current === "live" ? "En vivo" : current === "before" ? "Próximamente" : "Cerrado"}
        </span>
      </div>

      <div className="live-stage__bar">
        <DonationQR />
        <div className="live-stage__copy">
          <p className="live-stage__kicker">Aporta mientras ves el live</p>
          <p className="live-stage__hint">Tarjeta, PSE, Bre-B o transferencia.</p>
          <div className="live-stage__actions">
            <Link href="/donar" className="btn btn--primary">
              <HeartHandshake className="h-5 w-5" strokeWidth={2} />
              Donar ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
