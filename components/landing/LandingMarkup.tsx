import type { PublicConfig } from "@/lib/types";
import CopyHandler from "./CopyHandler";
import StickyDonate from "./StickyDonate";
import StreamPlayer from "./StreamPlayer";
import SponsorsSection from "@/components/campaign/SponsorsSection";
import ReminderForm from "@/components/campaign/ReminderForm";
import SiteFooter from "@/components/public/SiteFooter";
import HouseProgress from "./HouseProgress";
import SiteHeader from "@/components/public/SiteHeader";

export default function LandingMarkup({ config, raised }: { config: PublicConfig; raised?: number }) {
  return (
    <>
      <CopyHandler />
      <SiteHeader current="live" />

      <div className="landing-root pb-24 md:pb-0">
<div className="bg-pattern" aria-hidden="true"></div>

  <main className="container">
    
    <section className="hero-showcase">
      <div className="hero-mascot left">
        <img src="/img/calvitos/bombero.webp" alt="Súper Calvito Bombero" />
      </div>

      <div className="hero-header">
        <div className="kicker">#SuperNavidad48H • #PonteLaCapa</div>
        <h1>Ningún niño debería luchar solo.</h1>
        <p className="hero-sub">
          Acompáñanos durante <strong>48 horas continuas</strong> en esta maratón solidaria por <strong>La Supercasa</strong>. Cada aporte transforma pequeños gestos en grandes oportunidades llenas de alegría.
        </p>
      </div>

      <div className="hero-mascot right">
        <img src="/img/calvitos/doctora.webp" alt="Súper Calvito Doctora" />
      </div>
    </section>

    <StreamPlayer stream={config.stream} />

    <div className="live-alerts">
      <a href="#avisame">Recibe un aviso cuando empiece cada bloque</a>
    </div>


    <HouseProgress initialRaised={raised ?? config.totals.raised} initialGoal={config.totals.goal} />

    <div className="reminder-section" id="avisame">
      <ReminderForm />
    </div>

    
    <section className="squad-section" aria-label="Escuadrón Súper Calvitos">
      <span className="squad-badge">Nuestros Pequeños Héroes</span>
      <h2>Los sueños que construimos juntos en La Supercasa</h2>
      <p>Cada donación impulsa los sueños de nuestros Súper Calvitos y les brinda un hogar lleno de cuidado, juego y esperanza.</p>

      <div className="squad-grid">
        <div className="squad-card">
          <img src="/img/calvitos/bombero.webp" alt="" /><span className="squad-card__tag">Quiero ser bombero</span>
        </div>
        <div className="squad-card">
          <img src="/img/calvitos/doctora.webp" alt="" /><span className="squad-card__tag">Quiero ser doctora</span>
        </div>
        <div className="squad-card">
          <img src="/img/calvitos/piloto.webp" alt="" /><span className="squad-card__tag">Quiero ser piloto</span>
        </div>
        <div className="squad-card">
          <img src="/img/calvitos/policia-calvita.webp" alt="" /><span className="squad-card__tag">Quiero ser policía</span>
        </div>
        <div className="squad-card">
          <img src="/img/calvitos/chef.webp" alt="" /><span className="squad-card__tag">Quiero ser chef</span>
        </div>
        <div className="squad-card">
          <img src="/img/calvitos/constructor.webp" alt="" /><span className="squad-card__tag">Quiero ser constructor</span>
        </div>
      </div>
    </section>

    
    <section id="donar">
      <div className="section-title">
        <h2>¿Cómo puedes sumarte hoy?</h2>
        <p>Elige tu medio favorito para aportar a la construcción de La Supercasa. Todo suma para nuestros pequeños guerreros y sus familias.</p>
      </div>

      <div className="cards-grid">
        
        <div className="card">
          <div className="card-top">
            <span className="card-tag tag-breb">Transferencia Inmediata</span>
            <h3>Llave Bre-B</h3>
            <p className="card-desc">Envía tu aporte al instante desde la app de cualquier banco en Colombia usando nuestra llave oficial:</p>
            <div className="dato-box">
              <span>Llave oficial Bre-B:</span>
              <span className="dato-destacado">@lasupercasa</span>
              <small>A nombre de: Fundación Segundos de Vida</small>
            </div>
          </div>
          <button className="btn-pill btn-magenta" data-copy="@lasupercasa">Copiar Llave @lasupercasa</button>
        </div>

        
        <div className="card">
          <div className="card-top">
            <span className="card-tag tag-banco">Cuenta Oficial</span>
            <h3>Bancolombia</h3>
            <p className="card-desc">Realiza tu transferencia o consignación directa a la cuenta de ahorros de la Fundación:</p>
            <div className="dato-box">
              <span>Cuenta de Ahorros Bancolombia:</span>
              <span className="dato-destacado">186-000090-54</span>
              <small>Fundación Segundos de Vida • NIT 900.649.809-2</small>
            </div>
          </div>
          <button className="btn-pill" data-copy="18600009054">Copiar Número de Cuenta</button>
        </div>

        
        <div className="card">
          <div className="card-top">
            <span className="card-tag tag-web">Tarjetas / PSE / Internacional</span>
            <h3>Donación en Línea</h3>
            <p className="card-desc">Aporta con tarjeta débito, crédito o PSE en el formulario seguro de esta misma página:</p>
            <div className="dato-box">
              <span>Pago procesado por Wompi:</span>
              <span className="dato-destacado dato-url">Tarjeta, PSE o Nequi</span>
              <small>La Fundación recibe tu aporte directamente</small>
            </div>
          </div>
          <a href="/donar" className="btn-pill">Donar en línea &raquo;</a>
        </div>
      </div>
    </section>
    <SponsorsSection />

    
    <section className="social-wrapper">
      <div className="social-group">
        <div className="social-group-title">Redes Fundación Segundos de Vida</div>
        <div className="social-bar">
          <a className="social-link" href="https://instagram.com/segundosdevidafundacion" target="_blank" rel="noopener">Instagram @segundosdevidafundacion</a>
          <a className="social-link" href="https://youtube.com/@segundosdevidafsv" target="_blank" rel="noopener">YouTube @segundosdevidafsv</a>
          <a className="social-link" href="https://www.facebook.com/share/1EPQyRAsbk/" target="_blank" rel="noopener">Facebook Oficial</a>
        </div>
      </div>

      <div className="social-group">
        <div className="social-group-title">Producción y Comunidad Kavanah</div>
        <div className="social-bar">
          <a className="social-link social-link-kavanah" href="https://www.tiktok.com/@kavanah35" target="_blank" rel="noopener">TikTok @kavanah35</a>
          <a className="social-link social-link-kavanah" href="https://www.instagram.com/kavanahpl35" target="_blank" rel="noopener">Instagram @kavanahpl35</a>
          <a className="social-link social-link-kavanah" href="https://www.youtube.com/@KavanahPL35" target="_blank" rel="noopener">YouTube @KavanahPL35</a>
        </div>
      </div>
    </section>
  </main>

  <SiteFooter />
      <StickyDonate />
      </div>
    </>
  );
}
