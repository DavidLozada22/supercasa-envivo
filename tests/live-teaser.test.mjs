import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el live reemplaza la imagen del hero cuando hay transmisión', () => {
  const overlay = readFileSync('components/campaign/HeroLiveOverlay.tsx', 'utf8');
  assert.ok(overlay.includes('En vivo'));
  assert.ok(overlay.includes('Ver la transmisión'));
  assert.ok(overlay.includes('href="/envivo"'));
  assert.ok(overlay.includes('forceLive'));
  const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
  assert.ok(shell.includes('HeroLiveOverlay'));
  assert.ok(!shell.includes('LiveTeaser'));
});

test('existe una vista previa del home para el panel', () => {
  const page = readFileSync('app/admin/preview-home/page.tsx', 'utf8');
  assert.ok(page.includes('requirePageRole'));
  assert.ok(page.includes('HomePreview'));
  const preview = readFileSync('components/admin/HomePreview.tsx', 'utf8');
  assert.ok(preview.includes('?preview=live'));
  assert.ok(preview.includes('iframe'));
  const home = readFileSync('app/page.tsx', 'utf8');
  assert.ok(home.includes('forceLive'));
  assert.ok(home.includes('preview'));
});

test('el reproductor permite volver al momento en vivo', () => {
  const player = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(player.includes('goLive'));
  assert.ok(player.includes('Ir al vivo'));
  assert.ok(player.includes('Ir al momento en vivo'));
  assert.ok(player.includes('seekTo'));
  assert.ok(player.includes('pausedSince'));

  const css = readFileSync('components/landing/masked-player.module.css', 'utf8');
  assert.ok(css.includes('.goLive'));
});
