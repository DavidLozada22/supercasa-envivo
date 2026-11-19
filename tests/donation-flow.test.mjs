import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el formulario conserva el diseño original de Sebastián', () => {
  const flow = readFileSync('components/campaign/DonationFlow.tsx', 'utf8');
  const pieces = readFileSync('lib/donations/pieces.ts', 'utf8');
  for (const marker of ['stepper', 'piece__badge', 'check--fee', 'data-astro-cid-erlevsxa', 'certificate']) {
    assert.ok(flow.includes(marker), `Falta ${marker}`);
  }
  assert.ok(flow.includes('Plan Padrino mensual'));
  assert.ok(pieces.includes('Calvito la recomienda'));
});

test('hay una sola ruta pública de donación', () => {
  for (const file of ['app/donar/page.tsx', 'components/landing/LandingMarkup.tsx']) {
    const source = readFileSync(file, 'utf8');
    assert.ok(!source.includes('supercasa.segundosdevida.com'), `${file} no debe enviar a otro portal de donaciones`);
  }
});
