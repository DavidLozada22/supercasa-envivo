import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el live usa un placeholder con las dos marcas y cortina sin tecnicismos', () => {
  const placeholder = readFileSync('components/landing/StreamPlaceholder.tsx', 'utf8');
  assert.ok(placeholder.includes('/img/logo-fsv-official.png'));
  assert.ok(placeholder.includes('/img/kavanah-horizontal-white.png'));
  assert.ok(placeholder.includes('Transmisión especial'));
  assert.ok(placeholder.includes('stream-placeholder__cta'));

  const player = readFileSync('components/landing/StreamPlayer.tsx', 'utf8');
  assert.ok(player.includes('StreamPlaceholder'));
  assert.ok(player.includes('liveState'));

  const live = readFileSync('lib/live.ts', 'utf8');
  assert.ok(live.includes('2026-11-20T18:00:00-05:00'));
  assert.ok(live.includes('2026-11-22T18:00:00-05:00'));
  assert.ok(live.includes('YOUTUBE_API_KEY'));

  const cortina = readFileSync('components/landing/CortinaLive.tsx', 'utf8');
  const variants = readFileSync('lib/cortina.ts', 'utf8');
  assert.ok(variants.includes('En breves momentos continúa la transmisión'));
  assert.ok(variants.includes('Seguimos apoyando a los Super Calvitos'));
  assert.ok(cortina.includes('/audio/cortina.mp3'));
  assert.ok(cortina.includes('CORTINA_VARIANTS'));
  assert.ok(!variants.toLowerCase().includes('reconex'));

  const masked = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(masked.includes('CortinaLive'));
  assert.ok(!masked.includes('Reconectando la transmisión'));
});

test('el panel tiene una vista previa de las cortinas', () => {
  const page = readFileSync('app/admin/cortina/page.tsx', 'utf8');
  assert.ok(page.includes('isAuthenticated'));
  assert.ok(page.includes('CortinaPreview'));
  const preview = readFileSync('components/admin/CortinaPreview.tsx', 'utf8');
  const variants = readFileSync('lib/cortina.ts', 'utf8');
  for (const text of ['En breves momentos', 'La maratón no se detiene', 'Seguimos apoyando']) assert.ok(variants.includes(text));
  assert.ok(preview.includes('/audio/cortina.mp3'));
});
