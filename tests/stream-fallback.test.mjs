import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('el live resuelve el directo y cae a la cortina sin romper la pagina', () => {
  const player = readFileSync('components/landing/StreamPlayer.tsx', 'utf8');
  assert.ok(player.includes('getLiveStatus'));
  assert.ok(player.includes('LiveStream'));

  const live = readFileSync('components/landing/LiveStream.tsx', 'utf8');
  assert.ok(live.includes('StreamPlaceholder'));
  assert.ok(live.includes('CortinaLive'));
  assert.ok(live.includes('/api/live/current'));

  const resolver = readFileSync('lib/youtube/live.ts', 'utf8');
  assert.ok(resolver.includes('YOUTUBE_API_KEY'));
  assert.ok(resolver.includes('/playlistItems'));
  assert.ok(resolver.includes('api-uploads'));
  assert.ok(resolver.includes('quota'));

  const masked = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(masked.includes('CortinaLive'));

  const dates = readFileSync('lib/event.ts', 'utf8');
  assert.ok(dates.includes('2026-11-20T18:00:00-05:00'));
  assert.ok(dates.includes('2026-11-22T18:00:00-05:00'));
});

test('el panel de streaming esta protegido y tiene las cortinas listas', () => {
  const page = readFileSync('app/admin/streaming/page.tsx', 'utf8');
  assert.ok(page.includes('requirePageRole'));
  assert.ok(page.includes('StreamingConsole'));

  const grid = readFileSync('components/admin/streaming/SceneGrid.tsx', 'utf8');
  assert.ok(grid.includes('/cortinas/'));
  assert.ok(grid.includes('/pantalla/'));

  const scenes = readFileSync('lib/streaming/scenes.ts', 'utf8');
  for (const text of ['Empezamos en 1 minuto', 'Ya regresamos', 'Ajuste técnico']) {
    assert.ok(scenes.includes(text), `falta la escena ${text}`);
  }

  const blocks = readFileSync('lib/program/blocks.json', 'utf8');
  for (const text of [
    'La Gran Gala de los Sueños',
    'El Gran Cierre',
    'Copa de Campeones',
  ]) {
    assert.ok(blocks.includes(text), `falta el bloque ${text}`);
  }

  assert.ok(scenes.includes('blockScenes'));
  assert.ok(scenes.includes('blocksJson'));
  assert.ok(scenes.includes('ProgramBlock'));

  for (const file of [
    'empezamos-1',
    'empezamos-15',
    'empezamos-30',
    'ya-volvemos',
    'casa-50',
    'bloque-01',
    'bloque-12',
    'lower-third',
    'meta',
    'reloj',
    'en-vivo',
    'donacion',
    'en-vivo-qr',
    'mosca',
    'fondo-live',
    'marco-live',
    'horas-24',
    'casi-terminamos',
    'gracias-donaciones',
  ]) {
    assert.ok(existsSync(`public/cortinas/${file}.png`), `falta el PNG ${file}`);
  }

  const onair = readFileSync('app/pantalla/onair/page.tsx', 'utf8');
  assert.ok(onair.includes('state.token'));
  assert.ok(onair.includes('notFound'));

  const state = readFileSync('app/api/admin/streaming/state/route.ts', 'utf8');
  assert.ok(state.includes('apiRole'));
  assert.ok(state.includes('getScene'));
});
