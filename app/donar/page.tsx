import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CopyHandler from "@/components/landing/CopyHandler";

export const metadata = {
  title: "Opciones de pago | Súper Navidad por La Supercasa",
  description: "Llave Bre-B, cuenta Bancolombia y donación en línea para La Supercasa.",
};

export default function DonatePage() {
  return (
    <div className="landing-root">
      <div className="bg-pattern" aria-hidden="true" />
      <CopyHandler />

      <div className="top-bar">
        Ayúdanos a terminar <strong>LA SUPERCASA</strong> • Más de 13 años regalando amor, esperanza y
        calidad de vida
      </div>

      <header>
        <div className="nav-container">
          <div className="brand-logo-text">
            Fundación <span>Segundos</span> de Vida
          </div>
          <div className="nav-actions">
            <Link href="/" className="nav-donate-btn">
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Volver al live
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section id="donar" style={{ marginTop: "48px" }}>
          <div className="section-title">
            <h2>¿Cómo puedes sumarte hoy?</h2>
            <p>
              Elige tu medio favorito para aportar a la construcción de La Supercasa. Todo suma para
              nuestros pequeños guerreros y sus familias.
            </p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-top">
                <span className="card-tag tag-breb">Transferencia Inmediata</span>
                <h3>Llave Bre-B</h3>
                <p className="card-desc">
                  Envía tu aporte al instante desde la app de cualquier banco en Colombia usando
                  nuestra llave oficial:
                </p>
                <div className="dato-box">
                  <span>Llave oficial Bre-B:</span>
                  <span className="dato-destacado">@lasupercasa</span>
                  <small>A nombre de: Fundación Segundos de Vida</small>
                </div>
              </div>
              <button type="button" className="btn-pill btn-magenta" data-copy="@lasupercasa">
                Copiar Llave @lasupercasa
              </button>
            </div>

            <div className="card">
              <div className="card-top">
                <span className="card-tag tag-banco">Cuenta Oficial</span>
                <h3>Bancolombia</h3>
                <p className="card-desc">
                  Realiza tu transferencia o consignación directa a la cuenta de ahorros de la
                  Fundación:
                </p>
                <div className="dato-box">
                  <span>Cuenta de Ahorros Bancolombia:</span>
                  <span className="dato-destacado">186-000090-54</span>
                  <small>Fundación Segundos de Vida • NIT 900.649.809-2</small>
                </div>
              </div>
              <button type="button" className="btn-pill" data-copy="18600009054">
                Copiar Número de Cuenta
              </button>
            </div>

            <div className="card">
              <div className="card-top">
                <span className="card-tag tag-web">Tarjetas / PSE / Internacional</span>
                <h3>Donación en Línea</h3>
                <p className="card-desc">
                  Aporta desde cualquier lugar del mundo con tarjeta débito, crédito o PSE a través
                  de nuestro portal:
                </p>
                <div className="dato-box">
                  <span>Portal oficial de la Fundación:</span>
                  <span className="dato-destacado dato-url">supercasa.segundosdevida.com</span>
                  <small>Ingresa y haz clic en el botón de Donaciones</small>
                </div>
              </div>
              <a
                href="https://supercasa.segundosdevida.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill"
              >
                Ir a supercasa.segundosdevida.com &raquo;
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-hashtags">
          #SuperNavidad48H &nbsp;•&nbsp; #PonteLaCapa &nbsp;•&nbsp; #48HorasPorLaSupercasa &nbsp;•&nbsp;
          #SegundosDeVida
        </div>
        <p>Fundación Segundos de Vida • NIT 900.649.809-2 • Niños hoy. Héroes siempre.</p>
        <p className="mt-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Fundación Segundos de Vida. All Rights Reserved. | Built by{" "}
          <a
            href="https://svgvisual.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#E6009E] transition hover:brightness-110"
          >
            SVG
          </a>
        </p>
      </footer>
    </div>
  );
}
