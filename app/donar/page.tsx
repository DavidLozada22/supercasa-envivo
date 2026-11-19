import Link from "next/link";
import CopyHandler from "@/components/landing/CopyHandler";
import DonationFlow from "@/components/campaign/DonationFlow";
import HouseProgress from "@/components/landing/HouseProgress";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import SocialSection from "@/components/public/SocialSection";
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
    <>
      <SiteHeader current="donate" />

      <div className="sv-root sv-donate-page">
        <CopyHandler />

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

      <SocialSection />

        <SiteFooter />
      </div>
    </>
  );
}
