import Link from "next/link";
import { Lock } from "lucide-react";
import CopyHandler from "@/components/landing/CopyHandler";
import DonationFlow from "@/components/campaign/DonationFlow";
import HouseProgress from "@/components/landing/HouseProgress";
import { getConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";
import { paymentsAvailable } from "@/lib/donations/wompi";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pon tu pieza",
  description:
    "Dona en línea con Wompi o por transferencia. Cada pieza se ve en la casa que construyen los Super Calvitos.",
  alternates: { canonical: "/donar" },
  openGraph: {
    title: "Pon tu pieza · La SUPERCASA",
    description: "Dona en línea y ayuda a terminar La Supercasa de los Super Calvitos.",
    url: "/donar",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Dona por La Supercasa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pon tu pieza · La SUPERCASA",
    description: "Dona en línea y ayuda a terminar La Supercasa.",
    images: ["/og-image.jpg"],
  },
};

export default async function DonatePage() {
  const [config, online] = await Promise.all([getConfig(), progress()]);
  const raised = config.totals.raised + online.raisedCop;

  return (
    <div className="sv-root sv-donate-page">
      <CopyHandler />

      <header className="header" data-astro-cid-gfykqide>
        <div className="wrap header__inner" data-astro-cid-gfykqide>
          <Link className="logo" href="/" aria-label="Volver a La SUPERCASA" data-astro-cid-gfykqide>
            <span className="logo__fsv" data-astro-cid-gfykqide>
              <img src="/img/logo-fsv.png" width="188" height="39" alt="" data-astro-cid-gfykqide />
            </span>
            <strong data-astro-cid-gfykqide>La SUPERCASA</strong>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="btn btn--white header__cta" href="/" data-astro-cid-gfykqide>
              Volver al inicio
            </Link>
            <a className="admin-shortcut" href="/admin" aria-label="Panel de administración" title="Panel de administración">
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="section" id="donar-form">
          <div className="wrap donate-page__intro">
            <p className="eyebrow">Pon tu pieza</p>
            <h1>Elige cómo ayudar</h1>
            <p className="lead">
              Cada aporte se convierte en una pieza real de la casa: una ventana, un baño, una
              habitación. Paga con tarjeta, PSE o Nequi, o transfiere desde tu banco.
            </p>
          </div>

          <div className="wrap" style={{ marginBottom: 28 }}>
            <HouseProgress initialRaised={raised} initialGoal={config.totals.goal} />
          </div>

          <div className="wrap">
            <DonationFlow
              available={paymentsAvailable()}
              raised={raised}
              goal={config.totals.goal}
            />
          </div>
        </section>

        <section className="section" id="transferencia">
          <div className="wrap">
            <p className="eyebrow">Sin tarjeta</p>
            <h2>Paga por transferencia</h2>

            <div className="transfer-grid">
              <article className="card transfer-card">
                <span className="transfer-card__tag">Transferencia inmediata</span>
                <h3>Llave Bre-B</h3>
                <p>Envía tu aporte desde la app de cualquier banco.</p>
                <strong className="transfer-card__value">@lasupercasa</strong>
                <small>A nombre de Fundación Segundos de Vida</small>
                <button type="button" className="btn btn--primary" data-copy="@lasupercasa">
                  Copiar llave
                </button>
              </article>

              <article className="card transfer-card">
                <span className="transfer-card__tag">Cuenta oficial</span>
                <h3>Bancolombia</h3>
                <p>Cuenta de ahorros de la Fundación.</p>
                <strong className="transfer-card__value">186-000090-54</strong>
                <small>NIT 900.649.809-2</small>
                <button type="button" className="btn btn--primary" data-copy="18600009054">
                  Copiar cuenta
                </button>
              </article>

              <article className="card transfer-card">
                <span className="transfer-card__tag">Tarjetas / PSE</span>
                <h3>Pago en línea</h3>
                <p>Usa el formulario de esta misma página. Lo procesa Wompi.</p>
                <strong className="transfer-card__value">Tarjeta, PSE o Nequi</strong>
                <small>Pago seguro</small>
                <a className="btn btn--white" href="#donar-form">
                  Ir al formulario
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" data-astro-cid-scinlfmn>
        <div className="wrap footer__grid" data-astro-cid-scinlfmn>
          <div data-astro-cid-scinlfmn>
            <p className="footer__brand" data-astro-cid-scinlfmn>
              <span className="footer__logo" data-astro-cid-scinlfmn>
                <img
                  src="/img/logo-fsv.png"
                  width="188"
                  height="39"
                  alt="Fundación Segundos de Vida"
                  data-astro-cid-scinlfmn
                />
              </span>
              La SUPERCASA
            </p>
            <p data-astro-cid-scinlfmn>
              Fundación Segundos de Vida · Entidad sin ánimo de lucro · NIT 900.649.809-2
            </p>
          </div>
          <nav aria-label="Legal" data-astro-cid-scinlfmn>
            <ul data-astro-cid-scinlfmn>
              <li data-astro-cid-scinlfmn>
                <a href="/politica-de-datos" data-astro-cid-scinlfmn>
                  Política de tratamiento de datos
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="/terminos" data-astro-cid-scinlfmn>
                  Términos de donación
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Síguenos" data-astro-cid-scinlfmn>
            <p className="footer__label" data-astro-cid-scinlfmn>
              Síguenos
            </p>
            <ul className="social" data-astro-cid-scinlfmn>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.instagram.com/segundosdevidafundacion/" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  Instagram
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.facebook.com/fundsegundosdevida" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  Facebook
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.tiktok.com/@fundacionsegundosdevida" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  TikTok
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.youtube.com/@segundosdevidaFSV" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  YouTube
                </a>
              </li>
            </ul>
            <p className="footer__label" style={{ marginTop: "1rem" }} data-astro-cid-scinlfmn>
              Producción y Comunidad Kavanah
            </p>
            <ul className="social" data-astro-cid-scinlfmn>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.tiktok.com/@kavanah35" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  TikTok
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.instagram.com/kavanahpl35" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  Instagram
                </a>
              </li>
              <li data-astro-cid-scinlfmn>
                <a href="https://www.youtube.com/@KavanahPL35" target="_blank" rel="noopener" data-astro-cid-scinlfmn>
                  YouTube
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          © 2026 Fundación Segundos de Vida · Evento producido por Kavanah · <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" className="svg-support">Apoya a SVG</a>
        </p>
      </footer>
    </div>
  );
}
