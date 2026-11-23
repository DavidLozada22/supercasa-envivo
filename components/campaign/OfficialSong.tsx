import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SongButton from "@/components/public/SongButton";
import { SONG } from "@/lib/song";

export default function OfficialSong() {
  return (
    <section className="official-song" id="cancion" aria-labelledby="song-title">
      <div className="official-song__bg" aria-hidden="true" />
      <div className="official-song__shade" aria-hidden="true" />

      <div className="wrap official-song__grid">
        <div className="official-song__copy">
          <p className="official-song__eyebrow">{SONG.label}</p>
          <h2 id="song-title">Gracias, Machare</h2>
          <p className="official-song__lead">
            Machare, artista invitado, le puso música a estas 48 horas por los Súper Calvitos.
            Escucha aquí la canción oficial de la campaña.
          </p>

          <div className="official-song__actions">
            <SongButton />
            <Link href="/donar" className="official-song__cta">
              Donar ahora
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <p className="official-song__meta">
            {SONG.title} · {SONG.artist} · {SONG.durationNote}
          </p>
        </div>
      </div>
    </section>
  );
}
