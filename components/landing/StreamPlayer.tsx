import type { PublicConfig } from "@/lib/types";

export default function StreamPlayer({ stream }: { stream: PublicConfig["stream"] }) {
  return (
    <section className="stream-wrapper" aria-label="Transmisión en vivo">
      <div className="stream-frame">
        <div className="video-responsive">
          <iframe
            src={stream.embedUrl}
            title="Súper Navidad: 48 Horas por la Supercasa - En Vivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      <div className="stream-footer-bar">
        <div className="stream-status-text">
          Si la transmisión aún no inicia o prefieres interactuar en el chat oficial:
        </div>
        <a
          href={stream.backupUrl || stream.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-youtube-direct"
        >
          Ver directo en YouTube
        </a>
      </div>
    </section>
  );
}
