import Link from "next/link";
import type { PublicConfig } from "@/lib/types";
import { liveState, resolveLiveVideoId } from "@/lib/live";
import DonationQR from "./DonationQR";
import Player from "./MaskedPlayer";
import StreamPlaceholder from "./StreamPlaceholder";
import PromoInline from "@/components/public/PromoInline";

export default async function StreamPlayer({
  stream,
}: {
  stream: PublicConfig["stream"];
}) {
  const preview = process.env.NEXT_PUBLIC_LIVE_PREVIEW === "1";
  const state = preview ? "live" : liveState();
  const videoId =
    state === "live" ? await resolveLiveVideoId(stream.videoId) : stream.videoId;

  return (
    <section className="stream-wrapper" aria-label="Transmisión en vivo">
      <div className="stream-frame">
        {state === "live" ? (
          <Player
            videoId={videoId}
            embedUrl={stream.embedUrl}
            title="Súper Navidad: 48 Horas por la Supercasa"
          />
        ) : state === "before" ? (
          <StreamPlaceholder
            title="El viernes 20 empieza la maratón"
            message="A las 6:00 p. m., hora de Bogotá, arrancan 48 horas por La Supercasa. Guarda este enlace y acompáñanos."
            note="Tu aporte construye la casa de los Super Calvitos."
            cta={{ href: "/donar", label: "Donar ahora" }}
            extra={<PromoInline />}
          />
        ) : (
          <StreamPlaceholder
            title="Gracias por acompañarnos"
            message="La maratón terminó. La campaña sigue abierta hasta el 30 de noviembre."
            note="Puedes seguir donando desde esta misma página."
            cta={{ href: "/donar", label: "Donar ahora" }}
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
