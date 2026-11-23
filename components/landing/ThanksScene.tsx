"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarClock, Heart, Instagram, Music2, Youtube } from "lucide-react";
import { KAVANAH, THANKS, daysLeftLabel } from "@/lib/thanks";
import SongButton from "@/components/public/SongButton";

const CONFETTI = [
  { left: 8, delay: 0, duration: 7.5, color: "#ffd400", tilt: -12 },
  { left: 16, delay: 1.8, duration: 6.8, color: "#e6009e", tilt: 24 },
  { left: 24, delay: 3.4, duration: 8.2, color: "#7bdff2", tilt: -30 },
  { left: 33, delay: 0.6, duration: 7.1, color: "#ffd400", tilt: 16 },
  { left: 41, delay: 2.6, duration: 8.6, color: "#ff8fd0", tilt: -18 },
  { left: 49, delay: 4.2, duration: 6.9, color: "#ffffff", tilt: 28 },
  { left: 57, delay: 1.2, duration: 7.8, color: "#ffd400", tilt: -24 },
  { left: 65, delay: 3.1, duration: 8.1, color: "#7bdff2", tilt: 10 },
  { left: 73, delay: 0.2, duration: 7.3, color: "#e6009e", tilt: -16 },
  { left: 81, delay: 2.2, duration: 8.4, color: "#ffd400", tilt: 22 },
  { left: 89, delay: 4.6, duration: 7.6, color: "#ffffff", tilt: -8 },
  { left: 95, delay: 1.6, duration: 8.9, color: "#ff8fd0", tilt: 14 },
];

export default function ThanksScene({ variant = "full" }: { variant?: "full" | "compact" | "mini" }) {
  const days = daysLeftLabel();

  return (
    <div className={`thanks-scene thanks-scene--${variant}`}>
      <div className="thanks-scene__confetti" aria-hidden="true">
        {CONFETTI.map((piece, index) => (
          <span
            key={index}
            style={{
              left: `${piece.left}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: `rotate(${piece.tilt}deg)`,
            }}
          />
        ))}
      </div>

      <div className="thanks-scene__glow" aria-hidden="true" />

      <div className="thanks-scene__inner">
        <div className="thanks-scene__copy">
          <div className="thanks-scene__logos">
            <span className="thanks-scene__logo-card">
              <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
            </span>
            <span className="thanks-scene__cross" aria-hidden="true">
              ×
            </span>
            <img
              className="thanks-scene__kavanah-logo"
              src="/img/kavanah-horizontal-white.png"
              alt="Kavanah"
            />
          </div>

          <p className="thanks-scene__eyebrow">{THANKS.eyebrow}</p>

          <h2 className="thanks-scene__title">
            <span>{THANKS.titleLead}</span> {THANKS.titleRest}
          </h2>

          <p className="thanks-scene__body">{THANKS.body}</p>

          <p className="thanks-scene__days">
            <CalendarClock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {days}
          </p>

          <div className="thanks-scene__actions">
            <Link href="/donar" className="thanks-scene__cta">
              <Heart className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              {THANKS.primary}
            </Link>
            <a
              href={KAVANAH.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="thanks-scene__cta thanks-scene__cta--ghost"
            >
              <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              {THANKS.secondary}
            </a>
          </div>

          <p className="thanks-scene__note">{THANKS.note}</p>
        </div>

        <div className="thanks-scene__art">
          <img src="/img/casa/supercasa-100-1400.webp" alt={THANKS.houseAlt} loading="lazy" />
          <span className="thanks-scene__seal">Gracias</span>
        </div>

        <div className="thanks-scene__kavanah">
          <span className="thanks-scene__kavanah-label">{KAVANAH.label}</span>
          {variant !== "mini" ? <SongButton compact autoPlay={variant === "full"} /> : null}
          <span className="thanks-scene__socials">
            <a
              href={KAVANAH.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Kavanah"
            >
              <Instagram className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </a>
            <a
              href={KAVANAH.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok de Kavanah"
            >
              <Music2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </a>
            <a
              href={KAVANAH.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube de Kavanah"
            >
              <Youtube className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
