import Link from "next/link";
import type { PublicConfig } from "@/lib/types";
import { getLiveStatus, snapshot } from "@/lib/streaming/service";
import DonationQR from "./DonationQR";
import LiveStream from "./LiveStream";
import StreamPromo from "@/components/public/StreamPromo";

export default async function StreamPlayer({
  stream,
}: {
  stream: PublicConfig["stream"];
}) {
  const status = await getLiveStatus(stream.videoId);
  const initial = snapshot(status);

  return (
    <section className="stream-wrapper" aria-label="Transmisión en vivo">
      <div className="stream-frame">
        <LiveStream initial={initial} embedUrl={stream.embedUrl} />
      </div>

      <StreamPromo />

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
