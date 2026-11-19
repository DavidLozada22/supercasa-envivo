import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el live usa un placeholder con las dos marcas', () => {
  const placeholder = readFileSync('components/landing/StreamPlaceholder.tsx', 'utf8');
  assert.ok(placeholder.includes('/img/logo-fsv-official.png'));
  assert.ok(placeholder.includes('/img/kavanah-horizontal-gold.png'));
  assert.ok(placeholder.includes('Transmisión especial'));
  const player = readFileSync('components/landing/StreamPlayer.tsx', 'utf8');
  assert.ok(player.includes('StreamPlaceholder'));
  assert.ok(player.includes('2026-11-20'));
  const masked = readFileSync('components/landing/MaskedPlayer.tsx', 'utf8');
  assert.ok(masked.includes('onError'));
  assert.ok(masked.includes('StreamPlaceholder'));
  assert.ok(masked.includes('Reconectando la transmisión'));
});
