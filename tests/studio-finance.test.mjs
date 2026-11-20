import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('roles: marketing, finance y admin', () => {
  const users = read('lib/users.ts');
  assert.ok(users.includes('"finance"'));

  const nav = read('components/admin/nav.ts');
  assert.ok(nav.includes('/admin/recaudo'));
  assert.ok(nav.includes('FINANCE'));

  const login = read('app/api/admin/login/route.ts');
  assert.ok(login.includes('/admin/recaudo'));
  assert.ok(login.includes('/admin/estudio'));

  const root = read('app/admin/page.tsx');
  assert.ok(root.includes('/admin/recaudo'));

  const financePage = read('app/admin/recaudo/page.tsx');
  assert.ok(financePage.includes('requirePageRole'));
  assert.ok(financePage.includes('FinancePanel'));
});

test('el recaudo suma, edita y borra aportes manuales', () => {
  const api = read('app/api/admin/finance/route.ts');
  assert.ok(api.includes('insert into donations'));
  assert.ok(api.includes('apiRole'));
  assert.ok(api.includes('Bre-B'));

  const detail = read('app/api/admin/finance/[reference]/route.ts');
  assert.ok(detail.includes('update donations'));
  assert.ok(detail.includes('delete from donations'));

  const panel = read('components/admin/FinancePanel.tsx');
  assert.ok(panel.includes('Registrar aporte manual'));
  assert.ok(panel.includes('Aportes manuales'));
  assert.ok(panel.includes('Bre-B'));
  assert.ok(panel.includes('Bancolombia'));
  assert.ok(panel.includes('Wompi'));
});

test('el acceso rápido móvil mantiene el módulo activo', () => {
  const mobile = read('components/admin/MobileAdminNav.tsx');
  assert.ok(mobile.includes('Accesos rápidos'));
  assert.ok(mobile.includes('Todos los módulos'));
  assert.ok(mobile.includes('primary'));

  const shell = read('components/admin/AdminShell.tsx');
  assert.ok(shell.includes('MobileAdminNav'));

  const dashboard = read('components/admin/AdminDashboard.tsx');
  assert.ok(dashboard.includes('MobileAdminNav'));
});

test('el estudio tiene catálogo, edición y descarga', () => {
  const studio = read('components/admin/studio/ContentStudio.tsx');
  assert.ok(studio.includes('AD_CREATIVES'));
  assert.ok(studio.includes('downloadAdPng'));
  assert.ok(studio.includes('toPng'));
  assert.ok(studio.includes('Descargar PNG'));
  assert.ok(studio.includes('Guardar'));
  assert.ok(studio.includes('downloadCarousel'));
  assert.ok(studio.includes('Descargar carrusel (ZIP)'));
  assert.ok(studio.includes('Capas PNG transparentes'));
  assert.ok(studio.includes('PNG transparente'));
  assert.ok(studio.includes('Datos de campaña'));
  assert.ok(studio.includes('Avance de la obra'));
  assert.ok(studio.includes('Recaudo real'));
  assert.ok(studio.includes('Destino del QR y del enlace'));
  assert.ok(studio.includes('Agenda del carrusel'));
  assert.ok(studio.includes('Niveles de donación'));
  assert.ok(studio.includes('LiveThumb'));
  assert.ok(studio.includes('SceneView scene={merged}'));

  const merge = read('lib/streaming/merge.ts');
  assert.ok(merge.includes('resolveStreamingCopy'));
  assert.ok(merge.includes('progressPercent'));
  assert.ok(merge.includes('qrTarget'));

  const qrApi = read('app/api/qr/route.ts');
  assert.ok(qrApi.includes('QRCode.toBuffer'));

  const streamingApi = read('app/api/admin/streaming/content/route.ts');
  assert.ok(streamingApi.includes('progressPercent'));
  assert.ok(streamingApi.includes('guestRole'));
  assert.ok(streamingApi.includes('cleanCopy'));

  const marketingApi = read('app/api/admin/marketing/state/route.ts');
  assert.ok(marketingApi.includes('apiRole'));
  assert.ok(marketingApi.includes('AD_CREATIVES'));
  assert.ok(marketingApi.includes('showProgressBar'));
  assert.ok(marketingApi.includes('scheduleRows'));
  assert.ok(marketingApi.includes('tierRows'));

  const sceneApi = read('app/api/admin/streaming/content/route.ts');
  assert.ok(sceneApi.includes('apiRole'));
  assert.ok(sceneApi.includes('SCENES'));
});
