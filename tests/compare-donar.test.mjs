import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la comparación de la casa responde al control', () => {
  const compare = readFileSync('components/campaign/HouseCompare.tsx', 'utf8');
  assert.ok(compare.includes('useState'));
  assert.ok(compare.includes('clipPath'));
  assert.ok(compare.includes('type="range"'));
  const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
  assert.ok(shell.includes('HouseCompare'));
});

test('la donación muestra el render de la casa', () => {
  const page = readFileSync('app/donar/page.tsx', 'utf8');
  assert.ok(page.includes('HouseProgress'));
});

test('la vista previa muestra la música en loop', () => {
  const preview = readFileSync('components/admin/CortinaPreview.tsx', 'utf8');
  assert.ok(preview.includes('Reproducir cortina'));
  assert.ok(preview.includes('loop'));
  assert.ok(preview.includes('en loop'));
});
