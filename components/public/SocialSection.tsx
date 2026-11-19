const FOUNDATION = [
  { label: "Instagram", href: "https://www.instagram.com/segundosdevidafundacion/" },
  { label: "Facebook", href: "https://www.facebook.com/fundsegundosdevida" },
  { label: "TikTok", href: "https://www.tiktok.com/@fundacionsegundosdevida" },
  { label: "YouTube", href: "https://www.youtube.com/@segundosdevidaFSV" },
  { label: "Spotify", href: "https://open.spotify.com/show/033jb41KEgnrdwXP5Xx31w" },
];

const KAVANAH = [
  { label: "TikTok", href: "https://www.tiktok.com/@kavanah35" },
  { label: "Instagram", href: "https://www.instagram.com/kavanahpl35" },
  { label: "YouTube", href: "https://www.youtube.com/@KavanahPL35" },
];

export default function SocialSection() {
  return (
    <section className="site-social" aria-labelledby="site-social-title">
      <h2 id="site-social-title" className="site-social__title">Síguenos</h2>
      <div className="site-social__grid">
        <article className="site-social__card">
          <h3>Redes Fundación Segundos de Vida</h3>
          <ul>
            {FOUNDATION.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="site-social__card">
          <h3>Producción y Comunidad Kavanah</h3>
          <ul>
            {KAVANAH.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
