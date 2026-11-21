import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page = readFileSync('app/envivo/page.tsx', 'utf8');
const landing = readFileSync('components/landing/LandingMarkup.tsx', 'utf8');
const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
const sponsors = readFileSync('components/campaign/SponsorsSection.tsx', 'utf8');
test('la maratón conserva secciones y personajes originales', () => {
  for (const text of ['Ningún niño debería luchar solo', 'HouseProgress', 'bombero.webp', 'doctora.webp', 'Terraf','@lasupercasa', '18600009054', 'kavanah35']) assert.ok((landing + page + sponsors).toLowerCase().includes(text.toLowerCase()), `Falta ${text}`);
  assert.ok(page.includes('LandingMarkup'));
});
test('el header unico enlaza a campaña, maratón y donación', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('href="/"'));
  assert.ok(header.includes('href="/envivo"'));
  assert.ok(header.includes('href="/donar"'));
  assert.ok(header.includes('Conoce La Supercasa'));
  assert.ok(header.includes('Maratón 48 horas'));
});

test('el header avisa cuando hay transmisión en vivo y cuenta regresiva', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('site-live-pill'));
  assert.ok(header.includes('En vivo'));
  assert.ok(header.includes('Empezamos en vivo en'));
  assert.ok(header.includes('remainingLabel'));
  assert.ok(header.includes('setInterval'));
  const css = readFileSync('app/campaign.css', 'utf8');
  assert.ok(css.includes('siteLivePulse'));
  assert.ok(css.includes('prefers-reduced-motion'));
});

test('el menu de celular tiene accesos grandes y los logos', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('site-burger'));
  assert.ok(header.includes('id="site-menu"'));
  assert.ok(header.includes('site-menu__donate'));
  assert.ok(header.includes('/img/logo-fsv-official.png'));
  assert.ok(header.includes('kavanah-horizontal-white.png'));
  assert.ok(header.includes('Escape'));
});
test('la demostración administrativa está protegida y no inicia pagos', () => {
  const demo = readFileSync('app/admin/recorrido/page.tsx', 'utf8');
  assert.ok(demo.includes('requirePageRole'));
  assert.ok(demo.includes('FlowDemo'));
  const component = readFileSync('components/admin/FlowDemo.tsx', 'utf8');
  assert.ok(!component.includes('/api/donations'));
  for (const status of ['Aprobado', 'Pendiente', 'Rechazado']) assert.ok(component.includes(status));
});


test('el cronometro del live muestra lo que llevamos', () => {
  const pill = readFileSync('components/landing/LiveHoursPill.tsx', 'utf8');
  assert.ok(pill.includes('Llevamos'));
  assert.ok(pill.includes('clock(elapsed)'));
  assert.ok(pill.includes('setInterval(tick, 1000)'));
  assert.ok(!pill.includes('Faltan'));
});

test('la pantalla completa funciona en iPhone sin la API del navegador', () => {
  const player = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  const css = readFileSync('components/landing/masked-player.module.css', 'utf8');
  assert.ok(player.includes('webkitRequestFullscreen'), 'Debe intentar la variante de Safari');
  assert.ok(player.includes('setFauxFull(true)'), 'Debe caer en la capa fija');
  assert.ok(player.includes('stageFull'), 'Debe aplicar la clase de pantalla completa');
  assert.ok(player.includes('Salir de pantalla completa'), 'Debe poder salir');
  assert.ok(css.includes('.stageFull'), 'Falta el estilo de la capa fija');
  assert.ok(css.includes('100dvh'), 'La capa debe medir la ventana real');
});

test('la máscara del live tiene control de volumen', () => {
  const player = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  const css = readFileSync('components/landing/masked-player.module.css', 'utf8');
  assert.ok(player.includes('Nivel de volumen'), 'Falta el control accesible');
  assert.ok(player.includes('setVolume'), 'Debe cambiar el volumen del reproductor');
  assert.ok(player.includes('type="range"'), 'Debe ser un deslizador');
  assert.ok(css.includes('.volumePanel'), 'Falta el estilo del panel');
  assert.ok(css.includes('.volumeRange'), 'Falta el estilo del deslizador');
});

test('el volumen activa el sonido de inmediato y deja ajustarlo', () => {
  const player = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(player.includes('toggleMute();'), 'El botón debe silenciar o activar');
  assert.ok(player.includes('if (!finePointer) setVolumeOpen(true)'), 'En celular debe abrir el deslizador');
  assert.ok(!player.includes('setVolumeOpen((open) => !open)'), 'No debe quedarse esperando el nivel');
});

test('el minivisor del home muestra la señal real como el de donar', () => {
  const hero = readFileSync('components/campaign/HeroLiveOverlay.tsx', 'utf8');
  assert.ok(hero.includes('/api/live/current'), 'Debe consultar el mismo estado del live');
  assert.ok(hero.includes('youtube-nocookie.com/embed'), 'Debe incrustar la transmisión');
  assert.ok(hero.includes('hero-live--video'), 'Debe tener el modo video');
});

test('no queda ningún enlace al correo sin recepción', () => {
  const files = [
    'lib/contact.ts',
    'lib/resend.ts',
    'app/donar/page.tsx',
    'app/api/admin/announcements/route.ts',
  ];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    assert.ok(!source.includes('hola@supercasa.svgvisual.com'), `${file} todavía menciona el correo`);
  }
  const donar = readFileSync('app/donar/page.tsx', 'utf8');
  assert.ok(!donar.includes('Enviar por correo'), 'El botón de correo debe desaparecer');
  assert.ok(donar.includes('Enviar por WhatsApp'));
});
