import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el live usa un placeholder con las dos marcas y cortina sin tecnicismos', () => {
  const placeholder = readFileSync('components/landing/StreamPlaceholder.tsx', 'utf8');
  assert.ok(placeholder.includes('/img/logo-fsv-official.png'));
  assert.ok(placeholder.includes('/img/kavanah-horizontal-gold.png'));
  assert.ok(placeholder.includes('Transmisión especial'));
  assert.ok(placeholder.includes('stream-placeholder__cta'));

  const player = readFileSync('components/landing/StreamPlayer.tsx', 'utf8');
  assert.ok(player.includes('StreamPlaceholder'));
  assert.ok(player.includes('liveState'));

  const live = readFileSync('lib/live.ts', 'utf8');
  assert.ok(live.includes('2026-11-20T18:00:00-05:00'));
  assert.ok(live.includes('YOUTUBE_API_KEY'));

  const cortina = readFileSync('components/landing/CortinaLive.tsx', 'utf8');
  assert.ok(cortina.includes('En breves momentos continúa la transmisión'));
  assert.ok(cortina.includes('Seguimos apoyando a los Super Calvitos'));
  assert.ok(cortina.includes('/audio/cortina.mp3'));
  assert.ok(!cortina.toLowerCase().includes('reconex'));

  const masked = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(masked.includes('CortinaLive'));
  assert.ok(!masked.includes('Reconectando la transmisión'));
});
