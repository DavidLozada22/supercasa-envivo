import Link from "next/link";
import LiveStage from "@/components/campaign/LiveStage";
import { getConfig, toPublicConfig } from "@/lib/config";
import { progress } from "@/lib/donations/service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "En vivo | 48 horas por La Supercasa",
  description:
    "Transmisión especial de 48 horas por La Supercasa. Viernes 20 de noviembre, 6:00 p. m., a domingo 22, 6:00 p. m.",
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function LivePage() {
  const config = toPublicConfig(await getConfig());

  let online = { raisedCop: 0, donations: 0 };
  try {
    online = await progress();
  } catch {
    // Sin base de datos el recaudo manual sigue visible.
  }

  const raised = config.totals.raised + online.raisedCop;
  const goal = config.totals.goal;
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  return (
    <div className="sv-root sv-envivo">
      <header className="header" data-astro-cid-gfykqide>
        <div className="wrap header__inner" data-astro-cid-gfykqide>
          <Link className="logo" href="/" aria-label="Volver a La SUPERCASA" data-astro-cid-gfykqide>
            <span className="logo__fsv" data-astro-cid-gfykqide>
              <img src="/img/logo-fsv.png" width="188" height="39" alt="" data-astro-cid-gfykqide />
            </span>
            <strong data-astro-cid-gfykqide>La SUPERCASA</strong>
          </Link>
          <Link className="btn btn--white header__cta" href="/" data-astro-cid-gfykqide>
            Volver a la campaña
          </Link>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="wrap envivo__head">
            <p className="eyebrow">Transmisión especial</p>
            <h1>48 horas por La Supercasa</h1>
            <p className="lead">
              Del viernes 20 de noviembre a las 6:00 p. m. al domingo 22 a las 6:00 p. m. Dona
              mientras nos acompañas.
            </p>
          </div>

          <div className="wrap envivo__stage">
            <LiveStage stream={config.stream} />
          </div>

          <div className="wrap envivo__progress">
            <div className="envivo__progress-head">
              <span>Recaudado hasta ahora</span>
              <strong>{pct.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</strong>
            </div>
            <div className="envivo__bar">
              <div style={{ width: `${pct}%` }} />
            </div>
            <p>
              {cop.format(raised)} de {cop.format(goal)} · la campaña cierra el 30 de noviembre
            </p>
          </div>
        </section>
      </main>

      <footer className="footer" data-astro-cid-scinlfmn>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          #SuperNavidad48H · #PonteLaCapa · #48HorasPorLaSupercasa
        </p>
        <p className="wrap small copy" data-astro-cid-scinlfmn>
          © 2026 Fundación Segundos de Vida. All Rights Reserved. | Built by{" "}
          <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" data-astro-cid-scinlfmn>
            SVG
          </a>
        </p>
      </footer>
    </div>
  );
}
