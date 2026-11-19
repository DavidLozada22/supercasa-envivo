import type { PublicConfig } from "@/lib/types";
import { Lock } from "lucide-react";
import CopyHandler from "./CopyHandler";
import StickyDonate from "./StickyDonate";
import StreamPlayer from "./StreamPlayer";
import SponsorsSection from "@/components/campaign/SponsorsSection";
import ReminderForm from "@/components/campaign/ReminderForm";
import HouseProgress from "./HouseProgress";

export default function LandingMarkup({ config, raised }: { config: PublicConfig; raised?: number }) {
  return (
    <>
      <CopyHandler />
      <div className="landing-root pb-24 md:pb-0">
<div className="bg-pattern" aria-hidden="true"></div>

  <div className="top-bar">
    Ayúdanos a terminar <a href="/donar">LA SUPERCASA</a> • Más de 13 años regalando amor, esperanza y calidad de vida
  </div>

  <header>
    <div className="nav-container">
      <a className="brand-logo" href="/"><img src="/img/logo-fsv.png" alt="Fundación Segundos de Vida" /></a>
      <div className="nav-actions">
        <a href="/" className="nav-link">La campaña</a>
        <div className="live-pill">
          <span className="pulse-dot"></span> En Vivo • 48 Horas
        </div>
        <a href="/donar" className="nav-donate-btn">Donar Ahora</a>
        <a className="nav-admin" href="/admin" aria-label="Panel de administración" title="Panel de administración"><Lock className="h-4 w-4" strokeWidth={1.75} /></a>
      </div>
    </div>
  </header>

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


    <HouseProgress initialRaised={raised ?? config.totals.raised} initialGoal={config.totals.goal} />

    <div className="reminder-section">
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

  <footer>
    <div className="org-logos">
      <p className="org-logos__label">Organizan</p>
      <div className="org-logos__row">
        <span className="org-logos__chip"><img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" /></span>
        <span className="org-logos__cross" aria-hidden="true">×</span>
        <span className="org-logos__chip"><img src="/img/kavanah-horizontal-gold.png" alt="Kavanah" /></span>
      </div>
    </div>

    <div className="footer-hashtags">#SuperNavidad48H &nbsp;•&nbsp; #PonteLaCapa &nbsp;•&nbsp; #48HorasPorLaSupercasa &nbsp;•&nbsp; #SegundosDeVida</div>
    <p>Fundación Segundos de Vida • NIT 900.649.809-2 • Niños hoy. Héroes siempre.</p>
    <p className="mt-6 text-center text-xs text-white/40">Evento producido por Kavanah · <a href="https://svgvisual.com" target="_blank" rel="noopener noreferrer" className="svg-support">Apoya a SVG</a></p>
  </footer>
      <StickyDonate />
      </div>
    </>
  );
}
