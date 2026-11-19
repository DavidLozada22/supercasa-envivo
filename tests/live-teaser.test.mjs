import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la campaña muestra un mini visor cuando hay live', () => {
  const teaser = readFileSync('components/campaign/LiveTeaser.tsx', 'utf8');
  assert.ok(teaser.includes('Estamos en vivo'));
  assert.ok(teaser.includes('Ver la transmisión'));
  assert.ok(teaser.includes('href="/envivo"'));
  assert.ok(teaser.includes('setInterval'));
  const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
  assert.ok(shell.includes('LiveTeaser'));
});
