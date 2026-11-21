import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('el panel de streaming tiene metricas en vivo', () => {
  const console_ = read('components/admin/streaming/StreamingConsole.tsx');
  assert.ok(console_.includes('Métricas en vivo'));
  assert.ok(console_.includes('LiveMetrics'));

  const metrics = read('components/admin/streaming/LiveMetrics.tsx');
  assert.ok(metrics.includes('Viendo ahora /envivo'));
  assert.ok(metrics.includes('Únicos hoy'));
  assert.ok(metrics.includes('Recaudo total'));
  assert.ok(metrics.includes('Vistas por hora'));
  assert.ok(metrics.includes('YouTube Studio'));
  assert.ok(metrics.includes('setInterval(() => void load(), 12_000)'));

  const api = read('app/api/admin/analytics/live/route.ts');
  assert.ok(api.includes('apiRole'));
  assert.ok(api.includes('liveReport'));
  assert.ok(api.includes('studio.youtube.com'));

  const publicApi = read('app/api/analytics/live/route.ts');
  assert.ok(publicApi.includes('getSession'));
  assert.ok(publicApi.includes('isBotUserAgent'));
  assert.ok(publicApi.includes('recordLiveEvent'));
});

test('el medidor manda vistas y presencia sin frenar la pagina', () => {
  const tracker = read('components/analytics/LiveAnalytics.tsx');
  assert.ok(tracker.includes('sendBeacon'));
  assert.ok(tracker.includes('20_000'));
  assert.ok(tracker.includes('visibilitychange'));
  assert.ok(tracker.includes('"/envivo"'));

  const layout = read('app/layout.tsx');
  assert.ok(layout.includes('LiveAnalytics'));

  const store = read('lib/analytics/live.ts');
  assert.ok(store.includes('live_pageviews'));
  assert.ok(store.includes('live_presence'));
  assert.ok(store.includes('70 seconds'));
  assert.ok(store.includes('create table if not exists'));
});
