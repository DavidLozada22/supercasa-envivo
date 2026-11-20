import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('el estudio copia links de OBS y genera moscas desde la agenda', () => {
  const studio = read('components/admin/studio/ContentStudio.tsx');
  assert.ok(studio.includes('ObsCopyButton'));
  assert.ok(studio.includes('scenePath'));
  assert.ok(studio.includes('creativePath'));
  assert.ok(studio.includes('Moscas y agenda'));

  const creativeRoute = read('app/pantalla/creativo/[id]/page.tsx');
  assert.ok(creativeRoute.includes('CreativeStage'));
  assert.ok(creativeRoute.includes('readMarketingState'));

  const creativeStage = read('components/marketing/CreativeStage.tsx');
  assert.ok(creativeStage.includes('AdCanvasPreview'));
  assert.ok(creativeStage.includes('presentation'));

  const links = read('lib/streaming/links.ts');
  assert.ok(links.includes('scenePath'));
  assert.ok(links.includes('progressPercent'));
  assert.ok(links.includes('guestRole'));

  const presets = read('lib/program/presets.ts');
  assert.ok(presets.includes('PROGRAM_PRESETS'));
  assert.ok(presets.includes('lower-third'));
  assert.ok(presets.includes('ya-viene'));
  assert.ok(presets.includes('estamos-en'));

  const presetsUi = read('components/admin/streaming/ProgramPresets.tsx');
  assert.ok(presetsUi.includes('Moscas y agenda'));
  assert.ok(presetsUi.includes('ObsCopyButton'));

  const streaming = read('components/admin/streaming/StreamingConsole.tsx');
  assert.ok(streaming.includes('ProgramPresets'));
  assert.ok(streaming.includes('Moscas y agenda'));
  assert.ok(streaming.includes('ContentStudio'));
  assert.ok(streaming.includes('embedded'));
  assert.ok(streaming.includes('editingScene'));

  const grid = read('components/admin/streaming/SceneGrid.tsx');
  assert.ok(grid.includes('onEdit'));
  assert.ok(!grid.includes('/admin/estudio?tab='));

  const scenes = read('lib/streaming/scenes.ts');
  assert.ok(scenes.includes('basicScenes'));
  assert.ok(scenes.includes('personalizada'));
  assert.ok(scenes.includes('Ya regresamos'));

  const studioEmbed = read('components/admin/studio/ContentStudio.tsx');
  assert.ok(studioEmbed.includes('isBasicScene'));
  assert.ok(studioEmbed.includes('Básicas'));
  assert.ok(studioEmbed.includes('embedded'));

  const copyButton = read('components/admin/streaming/ObsCopyButton.tsx');
  assert.ok(copyButton.includes('clipboard'));
  assert.ok(copyButton.includes('Copiar enlace para OBS'));
});

test('los bloques salen del minuto a minuto y el QR tiene defaults por tipo', () => {
  const scenes = read('lib/streaming/scenes.ts');
  assert.ok(scenes.includes('blocksJson'));
  assert.ok(scenes.includes('ProgramBlock'));

  const kit = read('lib/marketing/campaign-kit.ts');
  assert.ok(kit.includes('creativeQrFallback'));
  assert.ok(kit.includes("category === 'donar'"));
  assert.ok(kit.includes("fallback: QrTarget = 'live'"));

  const preview = read('components/admin/marketing/AdCanvasPreview.tsx');
  assert.ok(preview.includes('creativeQrFallback'));

  const exporter = read('lib/marketing/ad-exporter.ts');
  assert.ok(exporter.includes('creativeQrFallback'));

  const css = read('app/streaming.css');
  assert.ok(css.includes('width: 200px'));
  assert.ok(css.includes('.scene--donaciones .scene__foot-qr'));
});
