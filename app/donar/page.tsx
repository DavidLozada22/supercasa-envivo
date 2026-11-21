import {
  ArrowRight,
  CreditCard,
  Landmark,
  Mail,
  MessageCircle,
} from "lucide-react";
import CopyHandler from "@/components/landing/CopyHandler";
import DonationFlow from "@/components/campaign/DonationFlow";
import DonationLive from "@/components/donations/DonationLive";
import HouseProgress from "@/components/landing/HouseProgress";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import SocialSection from "@/components/public/SocialSection";
import HelpWidget from "@/components/public/HelpWidget";
import { getConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";
import { paymentsAvailable } from "@/lib/donations/wompi";
import { mailtoLink, RECEIPT_MESSAGE, whatsappLink } from "@/lib/contact";
import { getLiveStatus, snapshot } from "@/lib/streaming/service";

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

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const query = await searchParams;
  const [config, online] = await Promise.all([getConfig(), progress()]);
  const raised = config.totals.raised + online.raisedCop;
  const payments = paymentsAvailable();
  const liveStatus = await getLiveStatus(config.stream.videoId);
  const baseSnapshot = snapshot(liveStatus);
  const previewLive = query.preview === "live";
  const live = previewLive
    ? { ...baseSnapshot, state: "live" as const, live: true, videoId: "RMAXHKK_VqM" }
    : baseSnapshot;

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
                habitación. Elige el camino que te quede más fácil. Los dos llegan a la misma
                meta.
              </p>
            </div>

            <div className="wrap">
              <DonationLive initial={live} preview={previewLive} />
            </div>

            <div className="wrap donate-paths">
              <a
                href={payments ? "#pago-en-linea" : "#transferencia"}
                className={`donate-path${payments ? " donate-path--primary" : ""}`}
              >
                <span className="donate-path__icon" aria-hidden="true">
                  <CreditCard size={22} strokeWidth={2} />
                </span>
                <span className="donate-path__copy">
                  <strong>Pagar en línea</strong>
                  <small>
                    {payments
                      ? "Tarjeta o transferencia Bancolombia con Wompi. Es lo más rápido."
                      : "Wompi está en activación. Mientras tanto, usa Bre-B o transferencia."}
                  </small>
                </span>
                <ArrowRight className="donate-path__arrow" size={20} strokeWidth={2} aria-hidden="true" />
              </a>

              <a
                href="#transferencia"
                className={`donate-path${!payments ? " donate-path--primary" : ""}`}
              >
                <span className="donate-path__icon" aria-hidden="true">
                  <Landmark size={22} strokeWidth={2} />
                </span>
                <span className="donate-path__copy">
                  <strong>Transferir sin tarjeta</strong>
                  <small>Bre-B o Bancolombia. Envías el comprobante y listo.</small>
                </span>
                <ArrowRight className="donate-path__arrow" size={20} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>

            <div className="wrap" style={{ marginBottom: 28 }}>
              <HouseProgress initialRaised={raised} initialGoal={config.totals.goal} />
            </div>

            <div className="wrap" id="pago-en-linea">
              <div className="donate-path-label">
                <span className="donate-path-label__num">1</span>
                <div>
                  <strong>Pago en línea</strong>
                  <small>Tarjeta o transferencia Bancolombia. Lo procesa Wompi.</small>
                </div>
                <a href="#transferencia">¿No tienes tarjeta? Transfiere aquí</a>
              </div>

              <DonationFlow
                available={payments}
                raised={raised}
                goal={config.totals.goal}
              />
            </div>
          </section>

          <section className="section" id="transferencia">
            <div className="wrap">
              <div className="donate-path-label donate-path-label--soft">
                <span className="donate-path-label__num">2</span>
                <div>
                  <strong>Transferencia directa</strong>
                  <small>Sin tarjeta, sin comisión. Envías el comprobante por WhatsApp.</small>
                </div>
              </div>

              <p className="eyebrow">Sin tarjeta</p>
              <h2>Transfiere en tres pasos</h2>
              <p className="lead donate-transfer__lead">
                Copia la llave Bre-B o la cuenta de Bancolombia, haz la transferencia y mándanos
                la foto del comprobante. Así registramos tu pieza y te confirmamos.
              </p>

              <ol className="transfer-steps">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Elige el dato</strong>
                    <p>Copia la llave Bre-B o la cuenta de ahorros de la Fundación.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Transfiere</strong>
                    <p>
                      Escribe <strong>SUPERCASA y tu nombre</strong> en la descripción para poder
                      cruzar el pago.
                    </p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Envía el comprobante</strong>
                    <p>Mándanos la foto por WhatsApp o correo y te confirmamos.</p>
                  </div>
                </li>
              </ol>

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

                {payments ? (
                  <article className="card transfer-card">
                    <span className="transfer-card__tag">Tarjetas / Bancolombia</span>
                    <h3>Pago en línea</h3>
                    <p>Usa el formulario de esta misma página. Lo procesa Wompi.</p>
                    <strong className="transfer-card__value">Tarjeta o transferencia</strong>
                    <small>Pago seguro</small>
                    <a className="btn btn--white" href="#pago-en-linea">
                      Ir al formulario
                    </a>
                  </article>
                ) : (
                  <article className="card transfer-card">
                    <span className="transfer-card__tag">También suma</span>
                    <h3>Donación en especie</h3>
                    <p>Materiales para la casa, muebles o insumos para los niños.</p>
                    <strong className="transfer-card__value">Lo que puedas aportar</strong>
                    <small>Coordinamos la entrega</small>
                    <a
                      className="btn btn--white"
                      href={whatsappLink(
                        "Hola, quiero donar en especie a La Supercasa. Les cuento qué tengo disponible:",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ofrecer materiales
                    </a>
                  </article>
                )}
              </div>

              <div className="receipt-cta">
                <div className="receipt-cta__copy">
                  <strong>¿Ya transferiste?</strong>
                  <p>
                    Envía la foto del comprobante con tu nombre y el valor. Te confirmamos tu
                    pieza y te damos las gracias.
                  </p>
                </div>
                <div className="receipt-cta__actions">
                  <a
                    className="btn btn--primary"
                    href={whatsappLink(RECEIPT_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                    Enviar por WhatsApp
                  </a>
                  <a
                    className="btn btn--white"
                    href={mailtoLink(
                      "Comprobante de transferencia La Supercasa",
                      RECEIPT_MESSAGE,
                    )}
                  >
                    <Mail size={18} strokeWidth={2} aria-hidden="true" />
                    Enviar por correo
                  </a>
                </div>
              </div>

              <p className="receipt-note">
                Si prefieres, también puedes donar en especie: materiales para la casa, muebles o
                insumos para los niños. <a href={whatsappLink("Hola, quiero donar en especie a La Supercasa. Les cuento qué tengo disponible:")} target="_blank" rel="noopener noreferrer">Escríbenos y coordinamos</a>.
              </p>
            </div>
          </section>
        </main>

        <SocialSection />

        <SiteFooter />
      </div>
      <HelpWidget />
    </>
  );
}
