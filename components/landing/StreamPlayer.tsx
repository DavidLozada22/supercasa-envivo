import Link from "next/link";
import type { PublicConfig } from "@/lib/types";
import DonationQR from "./DonationQR";
import Player from "./MaskedPlayer";
import StreamPlaceholder from "./StreamPlaceholder";

const START = new Date("2026-11-20T18:00:00-05:00");
const END = new Date("2026-11-22T18:00:00-05:00");

export default function StreamPlayer({ stream }: { stream: PublicConfig["stream"] }) {
  const now = new Date();
  const preview = process.env.NEXT_PUBLIC_LIVE_PREVIEW === "1";
  const state = preview ? "live" : now < START ? "before" : now > END ? "after" : "live";

  return (
    <section className="stream-wrapper" aria-label="Transmisión en vivo">
      <div className="stream-frame">
        {state === "live" ? (
          <Player
            videoId={stream.videoId}
            embedUrl={stream.embedUrl}
            title="Súper Navidad: 48 Horas por la Supercasa"
          />
        ) : state === "before" ? (
          <StreamPlaceholder
            title="La transmisión empieza el viernes 20 de noviembre"
            message="A las 6:00 p. m., hora de Bogotá. Vuelve en ese momento para acompañarnos."
            note="Mientras tanto puedes donar y seguir el avance de la casa."
          />
        ) : (
          <StreamPlaceholder
            title="Gracias por acompañarnos"
            message="La maratón de 48 horas terminó. La campaña sigue abierta hasta el 30 de noviembre."
            note="Puedes seguir donando desde esta misma página."
          />
        )}
      </div>

      <div className="stream-donate">
        <DonationQR />

        <div className="stream-donate-copy">
          <p className="stream-donate-kicker">Aporta desde tu celular</p>
          <h3>Escanea el QR y elige cómo donar</h3>
          <p>
            Llave Bre-B, cuenta Bancolombia o tarjeta. Cada aporte avanza la construcción de La
            Supercasa.
          </p>
          <Link href="/donar" className="stream-donate-btn">
            Donar ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
