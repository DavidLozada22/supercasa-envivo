import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('las cortinas cubren cuentas regresivas, casa, bloques y donacion', () => {
  const scenes = read('lib/streaming/scenes.ts');

  for (const id of [
    'empezamos-1',
    'empezamos-5',
    'empezamos-15',
    'empezamos-20',
    'empezamos-30',
    'empezamos-60',
    'casa-00',
    'casa-25',
    'casa-50',
    'casa-75',
    'casa-100',
    'donacion',
    'en-vivo-qr',
    'mosca',
    'fondo-live',
    'marco-live',
  ]) {
    assert.ok(scenes.includes(`id: "${id}"`), `falta la escena ${id}`);
  }

  for (const id of [
    'horas-2',
    'horas-5',
    'horas-10',
    'horas-24',
    'horas-30',
    'horas-32',
    'casi-terminamos',
    'gracias-donaciones',
  ]) {
    assert.ok(scenes.includes(`id: "${id}"`), `falta la escena de horas ${id}`);
  }

  assert.ok(scenes.includes('group: "hora"'));

  assert.ok(scenes.includes('countValue: "½"'));
  assert.ok(scenes.includes('houseLive: true'));
  assert.ok(scenes.includes('illustrationCluster'));
  assert.ok(scenes.includes('CALVITOS'));

  const view = read('components/streaming/SceneView.tsx');
  assert.ok(view.includes('HoursBug'));
  assert.ok(view.includes('DonationOverlay'));
  assert.ok(view.includes('LiveFrame'));
  assert.ok(view.includes('calvitoSrc'));
  assert.ok(view.includes('/api/qr'));

  const copy = read('lib/streaming/merge.ts');
  assert.ok(copy.includes('supercasa.svgvisual.com/donar'));
  assert.ok(copy.includes('DEFAULT_STREAMING_COPY'));
});

test('el live muestra horas, causa y llamados a donar', () => {
  const actions = read('components/landing/LiveActions.tsx');
  assert.ok(actions.includes('EVENT_HOURS'));
  assert.ok(actions.includes('Horas en vivo'));
  assert.ok(actions.includes('/donar'));
  assert.ok(actions.includes('#avisame'));

  const landing = read('components/landing/LandingMarkup.tsx');
  assert.ok(landing.includes('LiveActions'));
  assert.ok(landing.includes('HelpWidget'));

  const home = read('components/campaign/CampaignShell.tsx');
  assert.ok(home.includes('HelpWidget'));
});

test('el chatbot tiene memoria, atajos y captura de correo', () => {
  const knowledge = read('lib/chat/knowledge.ts');
  for (const id of ['que-es', 'causa', 'donar', 'comprobante', 'progreso', 'programa', 'avisos']) {
    assert.ok(knowledge.includes(`id: "${id}"`), `falta la respuesta ${id}`);
  }
  assert.ok(knowledge.includes('programAnswer'));
  assert.ok(knowledge.includes('progressAnswer'));
  assert.ok(knowledge.includes('matchEntry'));

  const widget = read('components/public/HelpWidget.tsx');
  assert.ok(widget.includes('/api/reminders'));
  assert.ok(widget.includes('whatsappLink'));
  assert.ok(widget.includes('matchEntry'));
  assert.ok(widget.includes('sessionStorage'));
  assert.ok(widget.includes('aria-live'));

  const api = read('app/api/reminders/route.ts');
  assert.ok(api.includes('allowedSources'));
  assert.ok(api.includes('chat'));
});

test('los recordatorios tienen mensajes listos y persuasivos', () => {
  const presets = read('lib/announcements/presets.ts');
  for (const id of [
    'antes-24h',
    'antes-1h',
    'antes-30',
    'antes-15',
    'en-vivo',
    'dona',
    '15h',
    'media',
    '30h',
    'ultimas-2h',
    'gracias',
    'campana',
    'empresas',
    'especie',
    'visita',
  ]) {
    assert.ok(presets.includes(`id: "${id}"`), `falta el recordatorio ${id}`);
  }
  assert.ok(presets.includes('Antes del evento'));
  assert.ok(presets.includes('Durante el live'));
  assert.ok(presets.includes('Después del live'));

  const panel = read('components/admin/RemindersPanel.tsx');
  assert.ok(panel.includes('REMINDER_PRESETS'));
  assert.ok(panel.includes('/api/admin/announcements'));
  assert.ok(panel.includes('¿Enviar a'));
  assert.ok(panel.includes('Sí, enviar'));
  assert.ok(panel.includes('/api/admin/reminders'));
});

test('la pagina de donar muestra dos caminos y el comprobante', () => {
  const donate = read('app/donar/page.tsx');
  assert.ok(donate.includes('donate-paths'));
  assert.ok(donate.includes('Pagar en línea'));
  assert.ok(donate.includes('Transferir sin tarjeta'));
  assert.ok(donate.includes('receipt-cta'));
  assert.ok(donate.includes('whatsappLink'));
  assert.ok(donate.includes('RECEIPT_MESSAGE'));
  assert.ok(donate.includes('SUPERCASA y tu nombre'));

  const contact = read('lib/contact.ts');
  assert.ok(contact.includes('DONATION_WHATSAPP'));
  assert.ok(contact.includes('whatsappLink'));
});

test('el agradecimiento al donante sale por Resend y lo inscribe', () => {
  const resend = read('lib/resend.ts');
  assert.ok(resend.includes('sendDonationThanks'));
  assert.ok(resend.includes('Gracias por poner tu pieza'));

  const service = read('lib/donations/service.ts');
  assert.ok(service.includes('sendDonationThanks'));
  assert.ok(service.includes('afterApproved'));
  assert.ok(service.includes("'donacion'"));
});

test('el panel agrupa los accesos y muestra todo desde el inicio', () => {
  const nav = read('components/admin/nav.ts');
  assert.ok(nav.includes('Producción'));
  assert.ok(nav.includes('Recaudo y casa'));
  assert.ok(nav.includes('ADMIN_GROUPS'));

  const dashboard = read('components/admin/AdminDashboard.tsx');
  assert.ok(dashboard.includes('AdminSidebar'));
  assert.ok(dashboard.includes('PanelMap'));

  const map = read('components/admin/PanelMap.tsx');
  assert.ok(map.includes('/admin/streaming'));
  assert.ok(map.includes('Todo lo que necesitas'));
});

test('donar tiene mini visor y el panel tiene placeholders claros', () => {
  const donate = read('app/donar/page.tsx');
  assert.ok(donate.includes('DonationLive'));
  assert.ok(donate.includes('getLiveStatus'));
  assert.ok(donate.includes('snapshot'));

  const mini = read('components/donations/DonationLive.tsx');
  assert.ok(mini.includes('/api/live/current'));
  assert.ok(mini.includes('Pantalla completa'));
  assert.ok(mini.includes('youtube-nocookie.com/embed'));
  assert.ok(mini.includes('IntersectionObserver'));
  assert.ok(mini.includes('aria-modal'));

  const grid = read('components/admin/streaming/SceneGrid.tsx');
  assert.ok(grid.includes('ScenePreview'));
  assert.ok(grid.includes('PNG pendiente'));
  assert.ok(grid.includes('scene-preview--overlay'));
  assert.ok(grid.includes('SceneKindBadge'));
});
