import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el pie invita a apoyar a SVG en todas las paginas', () => {
  const files = [
    'components/landing/LandingMarkup.tsx',
    'components/campaign/CampaignShell.tsx',
    'app/donar/page.tsx',
    'app/donar/gracias/page.tsx',
    'components/legal/LegalPage.tsx',
  ];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    assert.ok(source.includes('Apoya a SVG'), `${file} debe invitar a apoyar a SVG`);
    assert.ok(source.includes('svgvisual.com'), `${file} debe enlazar a SVG`);
    assert.ok(!source.includes('Built by'), `${file} no debe usar el credito anterior`);
  }
});
