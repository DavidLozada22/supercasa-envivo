import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__orgs">
          <p className="site-footer__label">Organizan</p>
          <div className="site-footer__logos">
            <img
              className="site-footer__fsv"
              src="/img/logo-fsv-official.png"
              alt="Fundación Segundos de Vida"
            />
            <span className="site-footer__cross" aria-hidden="true">×</span>
            <img
              className="site-footer__kavanah"
              src="/img/kavanah-horizontal-gold.png"
              alt="Kavanah"
            />
          </div>
        </div>

        <p className="site-footer__hashtags">
          #SuperNavidad48H &nbsp;•&nbsp; #PonteLaCapa &nbsp;•&nbsp; #48HorasPorLaSupercasa
          &nbsp;•&nbsp; #SegundosDeVida
        </p>

        <p className="site-footer__line">
          Fundación Segundos de Vida • NIT 900.649.809-2 • Niños hoy. Héroes siempre.
        </p>

        <nav className="site-footer__legal" aria-label="Legal">
          <Link href="/politica-de-datos">Política de datos</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terminos">Términos</Link>
          <span aria-hidden="true">·</span>
          <a href="mailto:admonsegundosdevida@hotmail.com">Tesorería</a>
          <span aria-hidden="true">·</span>
          <a href="https://segundosdevida.com" target="_blank" rel="noopener noreferrer">
            segundosdevida.com
          </a>
        </nav>

        <p className="site-footer__credit">
          Evento producido por Kavanah ·{" "}
          <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" className="svg-support">
            Apoya a SVG
          </a>
        </p>
      </div>
    </footer>
  );
}
